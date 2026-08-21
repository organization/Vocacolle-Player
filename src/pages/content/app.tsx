import './suis-layer-order.css';
import '@suis-ui/kit/style.css';
import './reset.css';

import { ThemeProvider, useTheme } from '@suis-ui/kit';
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
} from 'solid-js';
import { Show } from 'solid-js/web';
import { Flip, FlipProvider } from 'solid-flip';
import { ListMusic, ListX } from 'lucide-solid';

import { Player } from '@/ui/player';
import { Dialog } from '@/ui/dialog';
import { IconButton } from '@/ui/button';
import { PlayerBar } from '@/ui/player-bar';
import { addToast, ToastProvider } from '@/ui/toast-provider';
import { PlayerProvider, usePlayer } from '@/ui/player-provider';
import { PlaylistView } from '@/ui/playlist-view';

import { Event } from '@/shared/event';
import { suisPixelTheme } from '@/theme/suis-theme';

import { fetchSongleChorusInterval, SongleChorusInterval } from './api/songle';
import { player, setPlayer } from './store/player';
import { PlaylistProvider, usePlaylist } from './store/playlist';
import { resetVideoData, useVideoData } from './hook/use-video-data';

import { VideoPanel } from './component/video-panel';

import {
  fixedStyle,
  playerBarWrapperAnimationStyle,
  playerBarWrapperStyle,
  sidebarAnimationStyle,
  sidebarHeaderStyle,
  sidebarStyle,
  sidebarTitleStyle,
  videoContainerStyle,
  videoPanelAnimationStyle,
  videoWrapperAnimationStyle,
} from './app.css';
import { useInjectData } from './hook/use-inject-data';
import { RankingType } from '@/shared/types';
import { RankingPanel } from './component/ranking-panel';

const EventList = Object.values(Event);
const PlayerEvent = { playing: Event.play, paused: Event.pause };
const Content = () => {
  const { sendEvent } = usePlayer();
  const { playlist, setPlaylist } = usePlaylist();
  const [videoData] = useVideoData();

  const [showFullscreen, setShowFullscreen] = createSignal(false);
  const [showSidebar, setShowSidebar] = createSignal(false);
  const [showPlayer, setShowPlayer] = createSignal(false);
  const [openExistCheck, setOpenExistCheck] = createSignal(false);
  const [openHistory, setOpenHistory] = createSignal(false);
  const [historyType, setHistoryType] = createSignal<RankingType | null>(null);
  const [historySeason, setHistorySeason] = createSignal<string | null>(null);
  const [sabi, setSabi] = createSignal(false);
  const [progressReport, reportProgress] = createSignal(0, { equals: false });
  const [medleyTrack, setMedleyTrack] = createSignal<{
    videoId: string;
    interval?: SongleChorusInterval;
    fallback?: boolean;
    intent?: 'playing' | 'paused';
    completed?: boolean;
    resume?: boolean;
    seeking?: boolean;
  } | null>(null);
  let medleyRequestId = 0;
  let medleyCommandSignal: AbortSignal | undefined;
  let playerEventSignal: AbortSignal | undefined;

  const setInternalPlayerState = (
    state: 'playing' | 'paused',
    signal?: AbortSignal,
    force = false
  ) => {
    if (player.state === state) {
      if (force) sendEvent({ type: PlayerEvent[state] }, signal);
      return;
    }
    playerEventSignal = signal;
    setPlayer('state', state);
  };

  const onPrevious = () =>
    setPlaylist('currentIndex', (index) => Math.max(index - 1, 0));
  const onPlayPause = () => {
    const track = medleyTrack();
    if (track?.intent) {
      const intent = track.intent === 'playing' ? 'paused' : 'playing';
      setMedleyTrack({ ...track, intent });
      return;
    }

    if (track?.resume) setMedleyTrack({ ...track, resume: false });
    playerEventSignal = undefined;
    setPlayer('state', (state) => (state === 'playing' ? 'paused' : 'playing'));
  };
  const onNext = () =>
    setPlaylist('currentIndex', (index) =>
      Math.min(index + 1, playlist.playlist.length - 1)
    );
  const onOpen = () => {
    const video = playlist.currentVideo;
    if (!video) return;

    window.open(`https://www.nicovideo.jp/watch/${video.id}`);
  };
  const onProgressChange = (progress: number) =>
    sendEvent({ type: Event.progress, progress });
  const playerProps = {
    get nowPlaying() {
      return playlist.current;
    },
    get playlistIndex() {
      return playlist.currentIndex;
    },
    get progress() {
      return player.progress;
    },
    get state() {
      return medleyTrack()?.intent ?? player.state;
    },
    get canPrevious() {
      return playlist.currentIndex > 0;
    },
    get canNext() {
      return playlist.currentIndex < playlist.playlist.length - 1;
    },
    get sabi() {
      return sabi();
    },
    get sabiRange() {
      const track = medleyTrack();
      const video = playlist.currentVideo;
      if (!sabi()) return;
      if (!track?.interval || !video || track.videoId !== video.id) return;
      const durationMs = video.duration * 1000;
      const { startMs, endMs } = track.interval;
      return [startMs / durationMs, (endMs - startMs) / durationMs] as const;
    },
    onPrevious,
    onPlayPause,
    onNext,
    onSabi: () => setSabi((enabled) => !enabled),
    onOpen,
    onProgressChange,
  };

  const onClose = () => {
    setShowPlayer(false);
    setShowSidebar(false);
    setPlaylist({ playlist: [], currentIndex: 0, type: null });
  };

  const onAction = (id: string) => {
    setOpenExistCheck(false);

    const data = videoData();
    if (!data) {
      addToast({ message: `선택한 곡을 재생목록에 추가하지 못하였습니다.` });
      return;
    }

    const newPlaylist = data.map((d) => d.videoData);
    if (id === 'confirm') {
      setPlaylist({
        playlist: newPlaylist,
        currentIndex: 0,
        type: data[0]?.type ?? null,
      });
      resetVideoData();
    } else {
      setPlaylist('playlist', (prev) => [...prev, ...newPlaylist]);
    }

    if (newPlaylist.length === 1) {
      addToast({
        message: `"${newPlaylist[0]?.video.title}"(이)가 재생목록에 추가되었습니다.`,
      });
    } else {
      addToast({
        message: `${newPlaylist.length}개의 곡이 재생목록에 추가되었습니다.`,
      });
    }
  };

  useInjectData((event) => {
    if (event?.type === 'showHistory') {
      const { rankingType, seasonType } = event as {
        type: string;
        rankingType: RankingType;
        seasonType: string;
      };

      setHistoryType(rankingType);
      setHistorySeason(seasonType);
      setOpenHistory(true);
    }
  });

  createEffect(
    on(
      () => !!playlist.current,
      (added) => {
        if (added && !showPlayer()) {
          setShowPlayer(true);
        }
      }
    )
  );

  // auto play
  const currentVideoId = createMemo(() => playlist.currentVideo?.id);
  createEffect(
    on(currentVideoId, (video) => {
      if (!video || sabi()) return;

      const dom = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
      if (!dom) return;

      setPlayer('state', 'paused');
      requestAnimationFrame(() => {
        if (sabi()) return;
        setPlayer('state', 'playing');
      });
    })
  );

  createEffect(
    on(
      () => [currentVideoId(), sabi(), playlist.currentIndex] as const,
      ([videoId, enabled], previous) => {
        const requestId = ++medleyRequestId;
        const controller = new AbortController();
        medleyCommandSignal = controller.signal;
        onCleanup(() => controller.abort());
        if (!enabled || !videoId) {
          const track = medleyTrack();
          setMedleyTrack(null);
          if (!enabled && videoId && previous?.[1]) {
            const intent =
              track?.intent ?? (track?.resume ? 'playing' : player.state);
            setInternalPlayerState(intent, controller.signal, true);
            if (Math.abs(1 - player.progress) <= 0.0005) onNext();
          }
          return;
        }

        const intent =
          previous?.[0] === videoId
            ? (medleyTrack()?.intent ?? player.state)
            : 'playing';
        setMedleyTrack({ videoId, intent });
        setInternalPlayerState('paused', controller.signal, true);
        void (async () => {
          const interval = await fetchSongleChorusInterval(
            videoId,
            controller.signal
          ).catch(() => null);

          if (
            controller.signal.aborted ||
            requestId !== medleyRequestId ||
            !sabi() ||
            currentVideoId() !== videoId
          )
            return;

          const durationMs = (playlist.currentVideo?.duration ?? 0) * 1000;
          const endMs = interval ? Math.min(interval.endMs, durationMs) : 0;
          if (
            !interval ||
            interval.startMs >= durationMs ||
            endMs <= interval.startMs
          ) {
            const intent = medleyTrack()?.intent;
            setMedleyTrack({ videoId, fallback: true });
            addToast({ message: '사비가 없어 전체 곡을 재생합니다.' });
            if (intent) setInternalPlayerState(intent, controller.signal, true);
            if (Math.abs(1 - player.progress) <= 0.0005) onNext();
            return;
          }

          const intent = medleyTrack()?.intent;
          setMedleyTrack({
            videoId,
            interval: { startMs: interval.startMs, endMs },
            seeking: true,
          });
          sendEvent(
            {
              type: Event.progress,
              progress: interval.startMs / durationMs,
            },
            controller.signal
          );
          if (intent) setInternalPlayerState(intent, controller.signal, true);
        })();
      }
    )
  );

  // onNext
  createEffect(
    on(
      () => progressReport(),
      (progress) => {
        if (sabi()) {
          const track = medleyTrack();
          if (!track || track.videoId !== currentVideoId()) return;

          if (!track.fallback) {
            if (!track.interval) return;
            if (track.completed) return;

            const durationMs = (playlist.currentVideo?.duration ?? 0) * 1000;
            const startProgress = track.interval.startMs / durationMs;
            const endProgress = track.interval.endMs / durationMs;
            const seekMargin = 3000 / durationMs;
            if (track.seeking) {
              if (Math.abs(progress - startProgress) <= seekMargin) {
                setMedleyTrack({ ...track, seeking: false });
              } else {
                sendEvent(
                  { type: Event.progress, progress: startProgress },
                  medleyCommandSignal
                );
              }
              return;
            }
            if (
              progress < startProgress - seekMargin ||
              progress > endProgress + seekMargin
            ) {
              sendEvent(
                { type: Event.progress, progress: startProgress },
                medleyCommandSignal
              );
              return;
            }
            if (progress < endProgress - 0.0005) return;

            if (playlist.currentIndex >= playlist.playlist.length - 1) {
              setMedleyTrack({ ...track, completed: true, resume: true });
              setInternalPlayerState('paused', medleyCommandSignal, true);
            } else {
              setMedleyTrack({ videoId: track.videoId });
              setPlaylist('currentIndex', (index) => index + 1);
            }
            return;
          }
        }

        if (Math.abs(1 - progress) > 0.0005) return;
        setPlaylist('currentIndex', (index) =>
          Math.min(index + 1, playlist.playlist.length - 1)
        );
      }
    )
  );

  // event
  createEffect(
    on(
      () => player.state,
      (state) => {
        const signal = playerEventSignal;
        playerEventSignal = undefined;
        sendEvent({ type: PlayerEvent[state] }, signal);
      }
    )
  );

  // fullscreen
  createEffect(
    on(showFullscreen, (state) => {
      if (state) {
        sendEvent({ type: Event.enableControl });
      } else {
        sendEvent({ type: Event.disableControl });
      }
    })
  );

  // video clicked
  createEffect(
    on(videoData, (data) => {
      if (!data || data.length <= 0) return;

      const isPlaylistExist = data.some(({ videoData }) =>
        playlist.playlist.find((p) => p.video.id === videoData.video.id)
      );
      if (isPlaylistExist) {
        setOpenExistCheck(true);
      } else {
        setPlaylist('playlist', (prev) => [
          ...prev,
          ...data.map((d) => d.videoData),
        ]);
        if (data.length === 1) {
          addToast({
            message: `"${data[0].videoData.video.title}"(이)가 재생목록에 추가되었습니다.`,
          });
        } else {
          addToast({
            message: `${data.length}개의 곡이 재생목록에 추가되었습니다.`,
          });
        }

        resetVideoData();
      }
    })
  );

  onMount(() => {
    const listener = (event: MessageEvent) => {
      if (!event.data) return;
      if (typeof event.data !== 'object') return;
      if (!('type' in event.data && EventList.includes(event.data.type)))
        return;

      switch (event.data.type) {
        case Event.progress: {
          setPlayer('progress', event.data.percentage);
          reportProgress(event.data.percentage);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('message', listener);
    onCleanup(() => window.removeEventListener('message', listener));
  });

  const videoPlayer = (
    <Player videoId={playlist.current?.video.id} pip={!showFullscreen()} />
  );

  return (
    <div class={fixedStyle}>
      <div
        classList={{
          [videoContainerStyle]: true,
          [videoWrapperAnimationStyle.enter]: showPlayer(),
          [videoWrapperAnimationStyle.exit]: !showPlayer(),
        }}
      >
        <Show when={playlist.current && !showFullscreen()}>{videoPlayer}</Show>
      </div>
      <Show when={showFullscreen()} keyed>
        <Flip
          id={'video-panel'}
          enter={videoPanelAnimationStyle.enter}
          exit={videoPanelAnimationStyle.exit}
        >
          <VideoPanel
            {...playerProps}
            playlist={playlist.playlist}
            onClose={() => setShowFullscreen(false)}
            onVideo={(_, index) => setPlaylist('currentIndex', index)}
          >
            {videoPlayer}
          </VideoPanel>
        </Flip>
      </Show>
      <div
        classList={{
          [playerBarWrapperStyle]: true,
          [playerBarWrapperAnimationStyle.enter]: showPlayer(),
          [playerBarWrapperAnimationStyle.exit]: !showPlayer(),
        }}
      >
        <PlayerBar
          {...playerProps}
          onAlbumClick={() => setShowFullscreen(true)}
          onPlaylist={() => setShowSidebar((prev) => !prev)}
          onClose={onClose}
        />
      </div>
      <div
        class={sidebarStyle}
        classList={{
          [sidebarStyle]: true,
          [sidebarAnimationStyle.show]: showSidebar(),
          [sidebarAnimationStyle.hide]: !showSidebar(),
        }}
      >
        <PlaylistView
          nowPlayingId={playlist.currentVideo?.id}
          playlist={playlist.playlist}
          onVideo={(_, index) => setPlaylist('currentIndex', index)}
        >
          <div class={sidebarHeaderStyle}>
            <h2 class={sidebarTitleStyle}>
              {`재생목록 (${playlist.currentIndex + 1} / ${playlist.playlist.length})`}
            </h2>
            <IconButton icon={ListX} onClick={onClose} />
            <IconButton
              icon={ListMusic}
              onClick={() => setShowSidebar(false)}
            />
          </div>
        </PlaylistView>
      </div>
      <Dialog
        title={'재생목록이 이미 존재합니다'}
        description={`현재 재생목록이 존재합니다. 선택한 곡(${videoData()?.length}개)을 현재 재생목록에 추가하시겠습니까? 혹은 새로 재생목록을 만드시겠습니까?`}
        actions={[
          { id: 'add', label: '현재 재생목록에 추가', type: 'default' },
          { id: 'confirm', label: '새로 만들기', type: 'primary' },
        ]}
        open={openExistCheck()}
        onClose={() => setOpenExistCheck(false)}
        onAction={onAction}
      ></Dialog>
      <Show when={openHistory()} keyed>
        <Flip
          id={'ranking-panel'}
          enter={videoPanelAnimationStyle.enter}
          exit={videoPanelAnimationStyle.exit}
        >
          <RankingPanel
            rankingType={historyType()}
            seasonType={historySeason()}
            onClose={() => setOpenHistory(false)}
          />
        </Flip>
      </Show>
    </div>
  );
};

const ApplySuisPixelTheme = () => {
  const [, setTheme] = useTheme();
  createEffect(() => setTheme(suisPixelTheme));
  return null;
};

export const App = () => (
  <ThemeProvider>
    <ApplySuisPixelTheme />
    <PlaylistProvider>
      <FlipProvider>
        <ToastProvider>
          <PlayerProvider>
            <Content />
          </PlayerProvider>
        </ToastProvider>
      </FlipProvider>
    </PlaylistProvider>
  </ThemeProvider>
);
