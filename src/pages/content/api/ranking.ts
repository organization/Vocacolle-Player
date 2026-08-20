import {
  OldRankingData,
  Ranking,
  RankingData,
  RankingType,
} from '@/shared/types';

export const getRankingNumber = (type: RankingType): number | null => {
  if (type === 'top100') return 329892;
  if (type === 'rookie') return 329893;
  if (type === 'remix') return 329894;
  if (type === 'exhibition') return 329895;

  return null;
};
export const getRankingType = (num: number): RankingType | null => {
  if (num === 329892) return 'top100';
  if (num === 329893) return 'rookie';
  if (num === 329894) return 'remix';
  if (num === 329895) return 'exhibition';

  return null;
};

export const getOldType = (): string | null => {
  const [, oldType] =
    location.pathname.match(
      /^\/(20[0-9]{2}-(?:winter|summer|spring|autumn))/
    ) ?? [];

  return oldType;
};
export const getBuildId = (): string | null => {
  const temp = getRankingData()?.buildId;

  if (typeof temp === 'string') return temp;
  return null;
};

const buildURL = (type: RankingType, frontendId = 146) => {
  const oldType = getOldType();
  const buildId = getBuildId();

  const suffix =
    type === 'exhibition'
      ? '/exhibition.json'
      : `/ranking/${type}.json?id=${type}`;

  if (oldType && buildId) {
    return `https://vocaloid-collection.jp/${oldType}/_next/data/${buildId}${suffix}`;
  }

  // return `https://vocaloid-collection.jp/_next/data/${buildId}${suffix}`;
  return `https://nvapi.nicovideo.jp/v1/ranking/nicotop/${getRankingNumber(type)}?_frontendId=${frontendId}`;
};
const buildHistoryURL = (type: RankingType, time: Date) => {
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, '0');
  const day = String(time.getDate()).padStart(2, '0');
  const hour = String(time.getHours()).padStart(2, '0');

  return `https://data.sds.nicovideo.jp/static/vocacolle-ranking-history/${type}/${year}-${month}-${day}-${hour}00.json`;
};

const getRankingData = () => {
  const jsonScript =
    document.querySelector<HTMLScriptElement>('#__NEXT_DATA__');

  try {
    const json = JSON.parse(jsonScript?.textContent ?? '{}');

    return json;
  } catch {
    return null;
  }
};

interface FetchRanking {
  (): Promise<{ type: RankingType; ranking: Ranking }[]>;

  (type: RankingType): Promise<Ranking | undefined>;
}
export const fetchRanking = (async (type) => {
  const fetchPartialRanking = async (url: string) => {
    const response = await fetch(url).catch(() => {
      console.log('랭킹 데이터를 불러올 수 없습니다.');
      return null;
    });
    const json: RankingData | OldRankingData | null = await response
      ?.json()
      ?.catch((err) => {
        console.warn(
          '[Vocacolle Player] 랭킹 데이터를 파싱할 수 없습니다.',
          err
        );
        return null;
      });

    if (!json) return null;

    if ('pageProps' in json) {
      const id =
        json.pageProps.localRankingData.data?.mylist?.id ??
        json.pageProps.pageId;
      const videos =
        json.pageProps.localRankingData.data?.mylist?.items.map(
          (item) => item.video
        ) ??
        json.pageProps.localRankingData.data?.items?.map(
          (item) => item.video
        ) ??
        [];

      return {
        id,
        videos,
      } satisfies Ranking;
    }

    return json.data?.ranking ?? null;
  };

  if (!type) {
    const types: RankingType[] = ['top100', 'rookie', 'remix', 'exhibition'];

    const responses = await Promise.all(
      types.map(async (type) => {
        console.log(`랭킹 데이터 (${type}) 를 불러오는 중...`, buildURL(type));
        const response = await fetchPartialRanking(buildURL(type));
        if (!response) return null;

        return { type, ranking: response };
      })
    );

    return responses.filter(
      (it): it is { type: RankingType; ranking: Ranking } => !!it
    );
  } else {
    const url = buildURL(type);
    return await fetchPartialRanking(url);
  }
}) as FetchRanking;

export const fetchHistory = async (type: RankingType, start: Date, end: Date) => {
  const timeList = [];

  const clampedStart = new Date(start);
  clampedStart.setMinutes(0, 0, 0);

  for (let time = clampedStart; time <= end; time.setHours(time.getHours() + 1)) {
    timeList.push(new Date(time));
  }

  return await Promise.all(
    timeList.map(async (time) => {
      const url = buildHistoryURL(type, time);

      const response = await fetch(url).catch(() => {
        console.log('히스토리 데이터를 불러올 수 없습니다.');
        return null;
      });
      const json: RankingData | null = await response
        ?.json()
        ?.catch((err) => {
          console.warn('[Vocacolle Player] 히스토리 데이터를 파싱할 수 없습니다.', err);
          return null;
        });

      const ranking = json?.data?.ranking ?? null;

      return {
        time: new Date(time),
        ranking,
      };
    }),
  );
};

const historyRangeList: Record<string, Record<RankingType, { start: Date; end: Date }>> = {
  ['2026-winter']: {
    top100: {
      start: new Date('2026-02-20T00:00:00Z'),
      end: new Date('2026-02-23T17:00:00Z'),
    },
    rookie: {
      start: new Date('2026-02-20T19:00:00Z'),
      end: new Date('2026-02-23T17:00:00Z'),
    },
    remix: {
      start: new Date('2026-02-20T00:00:00Z'),
      end: new Date('2026-02-23T17:00:00Z'),
    },
    exhibition: {
      start: new Date('2026-02-19T18:00:00Z'),
      end: new Date('2026-02-23T17:00:00Z'),
    },
  }
}
export const fetchHistoryRange = async (type: RankingType, seasonType?: string) => {
  const data = historyRangeList[seasonType ?? ''];
  if (data) {
    const range = data[type];
    return {
      start: range.start,
      end: range.end,
    };
  }

  const response = await fetch(buildURL(type)).catch(() => {
    console.log('랭킹 데이터를 불러올 수 없습니다.');
    return null;
  });
  const json: RankingData | OldRankingData | null = await response
    ?.json()
    ?.catch((err) => {
      console.warn(
        '[Vocacolle Player] 랭킹 데이터를 파싱할 수 없습니다.',
        err
      );
      return null;
    });

  if (!(json && 'data' in json)) return null;

  const startTimeString = json.data?.ranking?.setting?.startDateTime;
  const endTimeString = json.data?.ranking?.setting?.endDateTime;

  if (!startTimeString || !endTimeString) return null;

  return {
    start: new Date(startTimeString),
    end: new Date(endTimeString),
  };
};
