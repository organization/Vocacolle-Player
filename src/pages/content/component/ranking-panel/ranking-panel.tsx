import { Box, Popup, Select } from '@suis-ui/kit';
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { Ranking, RankingType, Video } from '@/shared/types';
import { PlayInfo } from '@/ui/play-info';
import { formatDate } from '@/utils';
import { rankingTypeToText } from '@/utils/convert';
import { fetchHistory, fetchHistoryRange } from '../../api/ranking';
import { FullscreenPanel } from '../fullscreen-panel';
import { RankingDialog } from '../ranking-dialog';
import * as styles from './ranking-panel.css';

const HOUR_WIDTH = 80;
const RANK_HEIGHT = 32;
const PLOT_PADDING = { top: 48, right: 40, bottom: 48, left: 56 };
const RANK_LIMIT_OPTIONS = [
  { value: '10', label: '10위' },
  { value: '20', label: '20위' },
  { value: '30', label: '30위' },
];

type RankLimit = 10 | 20 | 30;

type GraphPoint = {
  time: Date;
  slot: number;
  rank: number;
  x: number;
  y: number;
};

type GraphSeries = {
  id: string;
  video: Video;
  color: string;
  points: GraphPoint[];
  segments: GraphPoint[][];
};

type ActivePoint = {
  seriesId: string;
  video: Video;
  point: GraphPoint;
};

type SVGMouseEvent = MouseEvent & { currentTarget: SVGElement };

export type RankingPanelProps = {
  rankingType?: RankingType | null;
  seasonType?: string | null;
  onClose: () => void;
};

const hourKey = (time: Date) => {
  const hour = new Date(time);
  hour.setMinutes(0, 0, 0);
  return hour.getTime();
};

const createHourList = (startValue: Date, endValue: Date) => {
  const start = new Date(startValue);
  const end = new Date(endValue);
  start.setMinutes(0, 0, 0);

  const times: Date[] = [];
  for (const time = start; time <= end; time.setHours(time.getHours() + 1)) {
    times.push(new Date(time));
  }
  return times;
};

const colorForVideo = (videoId: string) => {
  let hash = 0;
  for (const character of videoId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return `hsl(${hash % 360} 72% 42%)`;
};

const pathForPoints = (points: GraphPoint[]) =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

export const RankingPanel = (props: RankingPanelProps) => {
  const [rankLimit, setRankLimit] = createSignal<RankLimit>(10);
  const source = createMemo(() => {
    if (!(props.rankingType && props.seasonType)) return null;
    return [props.rankingType, props.seasonType] as const;
  });

  const [history] = createResource(
    source,
    async ([rankingType, seasonType]) => {
      const range = await fetchHistoryRange(rankingType, seasonType);
      if (!range) return { times: [], snapshots: [] };

      const start = new Date(range.start);
      const end = new Date(Math.min(range.end.getTime(), Date.now()));
      const times = createHourList(start, end);
      if (times.length === 0) return { times, snapshots: [] };

      return {
        times,
        snapshots: await fetchHistory(rankingType, start, end),
      };
    }
  );

  const graph = createMemo(() => {
    const data = history();
    const times = data?.times ?? [];
    const limit = rankLimit();
    const snapshotByTime = new Map(
      (data?.snapshots ?? []).map((snapshot) => [
        hourKey(snapshot.time),
        snapshot,
      ])
    );
    const drafts = new Map<
      string,
      { video: Video; observations: Map<number, GraphPoint> }
    >();
    let unavailableSlots = 0;

    times.forEach((time, slot) => {
      const ranking = snapshotByTime.get(hourKey(time))?.ranking;
      if (!ranking) {
        unavailableSlots += 1;
        return;
      }

      ranking.videos.slice(0, limit).forEach((video, rankIndex) => {
        const rank = rankIndex + 1;
        let draft = drafts.get(video.id);
        if (!draft) {
          draft = { video, observations: new Map() };
          drafts.set(video.id, draft);
        }
        draft.observations.set(slot, {
          time,
          slot,
          rank,
          x: PLOT_PADDING.left + slot * HOUR_WIDTH + HOUR_WIDTH / 2,
          y: PLOT_PADDING.top + rankIndex * RANK_HEIGHT + RANK_HEIGHT / 2,
        });
      });
    });

    const series: GraphSeries[] = [...drafts.entries()].map(([id, draft]) => {
      const points = [...draft.observations.values()];
      const segments: GraphPoint[][] = [];
      points.forEach((point) => {
        const segment = segments.at(-1);
        if (!segment || point.slot !== segment.at(-1)!.slot + 1)
          segments.push([point]);
        else segment.push(point);
      });

      return {
        id,
        video: draft.video,
        color: colorForVideo(id),
        points,
        segments,
      };
    });

    return {
      times,
      series,
      snapshotByTime,
      unavailableSlots,
      width:
        PLOT_PADDING.left +
        Math.max(times.length, 1) * HOUR_WIDTH +
        PLOT_PADDING.right,
      height: PLOT_PADDING.top + limit * RANK_HEIGHT + PLOT_PADDING.bottom,
    };
  });

  const [hovered, setHovered] = createSignal<ActivePoint | null>(null);
  const [focused, setFocused] = createSignal<ActivePoint | null>(null);
  const [pinned, setPinned] = createSignal<ActivePoint | null>(null);
  const [selectedTime, setSelectedTime] = createSignal<Date | null>(null);
  const active = createMemo(() => pinned() ?? hovered() ?? focused());
  const selectedRanking = createMemo<Ranking | null | undefined>(() => {
    const time = selectedTime();
    if (!time) return undefined;
    return graph().snapshotByTime.get(hourKey(time))?.ranking ?? null;
  });

  createEffect(() => {
    source();
    setHovered(null);
    setFocused(null);
    setPinned(null);
    setSelectedTime(null);
  });

  createEffect(() => {
    rankLimit();
    setHovered(null);
    setFocused(null);
    setPinned(null);
  });

  onMount(() => {
    const clearInteraction = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setHovered(null);
      setFocused(null);
      setPinned(null);
    };
    window.addEventListener('keydown', clearInteraction);
    onCleanup(() => window.removeEventListener('keydown', clearInteraction));
  });

  const detailsFor = (series: GraphSeries, point: GraphPoint): ActivePoint => ({
    seriesId: series.id,
    video: series.video,
    point,
  });

  const nearestPoint = (series: GraphSeries, event: SVGMouseEvent) => {
    const svg = event.currentTarget.ownerSVGElement;
    const matrix = svg?.getScreenCTM();
    if (!(svg && matrix)) return series.points.at(-1)!;

    const cursor = svg.createSVGPoint();
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    const local = cursor.matrixTransform(matrix.inverse());

    return series.points.reduce((nearest, point) =>
      Math.abs(point.x - local.x) < Math.abs(nearest.x - local.x)
        ? point
        : nearest
    );
  };

  const showNearest = (series: GraphSeries, event: SVGMouseEvent) => {
    setHovered(detailsFor(series, nearestPoint(series, event)));
  };

  const togglePin = (details: ActivePoint) => {
    setPinned((current) =>
      current?.seriesId === details.seriesId ? null : details
    );
  };

  const rankTicks = createMemo(() =>
    [1, 10, 20, 30].filter((rank) => rank <= rankLimit())
  );
  const rankY = (rank: number) =>
    PLOT_PADDING.top + (rank - 1) * RANK_HEIGHT + RANK_HEIGHT / 2;
  const status = createMemo(() => {
    if (history.loading)
      return {
        message: '히스토리를 불러오는 중입니다.',
        role: 'status',
      } as const;
    if (history.error)
      return {
        message: '히스토리를 불러오지 못했습니다.',
        role: 'alert',
      } as const;
    if (!source()) return { message: '랭킹 조건이 없습니다.' } as const;
    if (graph().series.length === 0) {
      return { message: '표시할 히스토리 데이터가 없습니다.' } as const;
    }
    return null;
  });

  return (
    <FullscreenPanel onClose={props.onClose}>
      <section
        class={styles.panelStyle}
        aria-labelledby="ranking-history-title"
      >
        <header class={styles.headerStyle}>
          <h1 id="ranking-history-title" class={styles.titleStyle}>
            {rankingTypeToText(props.rankingType ?? null)} 랭킹 히스토리
          </h1>
          <div class={styles.limitControlStyle}>
            <span id="ranking-limit-label" class={styles.limitLabelStyle}>
              표시 순위
            </span>
            <Select
              data={RANK_LIMIT_OPTIONS}
              value={String(rankLimit())}
              onChangeValue={(value) =>
                setRankLimit(Number(value) as RankLimit)
              }
              required
              aria-labelledby="ranking-limit-label"
              popupProps={{ z: 10002 }}
            />
          </div>
        </header>

        <Show
          when={status()}
          keyed
          fallback={
            <>
              <div class={styles.viewportStyle} aria-label="시간별 랭킹 그래프">
                <div
                  class={styles.plotStyle}
                  style={{
                    width: `${graph().width}px`,
                    height: `${graph().height}px`,
                  }}
                >
                  <svg
                    width={graph().width}
                    height={graph().height}
                    viewBox={`0 0 ${graph().width} ${graph().height}`}
                    role="group"
                    aria-label={`가로축은 시간, 세로축은 1위부터 ${rankLimit()}위까지의 순위입니다.`}
                  >
                    <For each={rankTicks()}>
                      {(rank) => (
                        <text
                          class={styles.axisTextStyle}
                          x={PLOT_PADDING.left - 12}
                          y={rankY(rank)}
                        >
                          {rank}
                        </text>
                      )}
                    </For>
                    <For each={graph().times}>
                      {(time, slot) => {
                        const x =
                          PLOT_PADDING.left +
                          slot() * HOUR_WIDTH +
                          HOUR_WIDTH / 2;
                        return (
                          <text
                            class={styles.timeTextStyle}
                            x={x}
                            y={PLOT_PADDING.top - 16}
                            role="button"
                            tabIndex={0}
                            aria-label={`${formatDate(time, 'YYYY-MM-DD HH시')} 전체 랭킹 보기`}
                            onClick={() => setSelectedTime(time)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setSelectedTime(time);
                              }
                            }}
                          >
                            {formatDate(time, 'MM-DD HH시')}
                          </text>
                        );
                      }}
                    </For>

                    <For each={graph().series}>
                      {(series) => {
                        const isActive = () => active()?.seriesId === series.id;
                        const isDimmed = () => !!active() && !isActive();
                        const lastDetails = () =>
                          detailsFor(series, series.points.at(-1)!);
                        return (
                          <g
                            classList={{
                              [styles.seriesGroupStyle]: true,
                              [styles.activeSeriesStyle]: isActive(),
                              [styles.dimmedSeriesStyle]: isDimmed(),
                            }}
                            style={{ color: series.color }}
                            tabIndex={0}
                            role="button"
                            aria-label={`${series.video.title}, ${series.points.length}개 시간대 관측`}
                            onPointerEnter={(event) =>
                              showNearest(series, event)
                            }
                            onPointerMove={(event) =>
                              showNearest(series, event)
                            }
                            onPointerLeave={() => setHovered(null)}
                            onFocus={() => setFocused(lastDetails())}
                            onBlur={() => setFocused(null)}
                            onClick={(event) =>
                              togglePin(
                                detailsFor(series, nearestPoint(series, event))
                              )
                            }
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                togglePin(lastDetails());
                              }
                            }}
                          >
                            <For each={series.segments}>
                              {(segment) => (
                                <path
                                  class={styles.seriesPathStyle}
                                  d={pathForPoints(
                                    segment.length > 1
                                      ? segment
                                      : [
                                          ...segment,
                                          {
                                            ...segment[0],
                                            x: segment[0].x + 0.01,
                                          },
                                        ]
                                  )}
                                />
                              )}
                            </For>
                          </g>
                        );
                      }}
                    </For>
                  </svg>

                  <Popup
                    open={!!active()}
                    z={10001}
                    placement="top"
                    offset={10}
                    shift
                    flip
                    autoUpdate
                    content={
                      <Show when={active()} keyed>
                        {(details) => (
                          <Box
                            class={styles.popupContentStyle}
                            bg="surface.main"
                            c="text.main"
                            p="md"
                            r="md"
                            shadow="lg"
                          >
                            <PlayInfo
                              ranking={details.point.rank}
                              rankingType={props.rankingType}
                              title={details.video.title}
                              artist={details.video.owner.name}
                              album={details.video.thumbnail.url}
                            />
                            <time
                              class={styles.popupTimeStyle}
                              dateTime={details.point.time.toISOString()}
                            >
                              {formatDate(
                                details.point.time,
                                'YYYY-MM-DD HH시'
                              )}{' '}
                              기준
                            </time>
                          </Box>
                        )}
                      </Show>
                    }
                  >
                    <span
                      aria-hidden="true"
                      class={styles.popupAnchorStyle}
                      style={{
                        left: `${active()?.point.x ?? 0}px`,
                        top: `${active()?.point.y ?? 0}px`,
                        visibility: active() ? 'visible' : 'hidden',
                      }}
                    />
                  </Popup>
                </div>
              </div>
            </>
          }
        >
          {(currentStatus) => (
            <div class={styles.stateStyle} role={currentStatus.role}>
              {currentStatus.message}
            </div>
          )}
        </Show>
      </section>
      <RankingDialog
        rankingType={props.rankingType}
        time={selectedTime()}
        ranking={selectedRanking()}
        open={!!selectedTime()}
        onClose={() => setSelectedTime(null)}
      />
    </FullscreenPanel>
  );
};
