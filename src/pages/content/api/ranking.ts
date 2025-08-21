import {
  OldRankingData,
  Ranking,
  RankingData,
  RankingType,
} from '@pages/content/types';

export const getRankingNumber = (type: RankingType): number | null => {
  if (type === 'top100') return 286594;
  if (type === 'rookie') return 286595;
  if (type === 'remix') return 286596;
  if (type === 'exhibition') return 301441;

  return null;
};
export const getRankingType = (num: number): RankingType | null => {
  if (num === 286594) return 'top100';
  if (num === 286595) return 'rookie';
  if (num === 286596) return 'remix';
  if (num === 301441) return 'exhibition';

  return null;
};

export const getOldType = (): string | null => {
  const [, oldType] =
    location.pathname.match(
      /^\/(20[0-9]{2}\-(?:winter|summer|spring|autumn))/
    ) ?? [];

  return oldType;
};
export const getBuildId = (): string | null => {
  const temp = getRankingData()?.buildId;

  if (typeof temp === 'string') return temp;
  return null;
};

const buildURL = (type: RankingType, frontendId = 1) => {
  const oldType = getOldType();
  const buildId = getBuildId();

  if (oldType && buildId) {
    return `https://vocaloid-collection.jp/${oldType}/_next/data/${buildId}/ranking/${type}.json?id=${type}`;
  }

  return `https://nvapi.nicovideo.jp/v1/ranking/nicotop/${getRankingNumber(
    type
  )}?_frontendId=${frontendId}`;
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
  (): Promise<Ranking[]>;

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
      ?.catch(() => {
        console.warn('[Vocacolle Player] 랭킹 데이터를 파싱할 수 없습니다.');
        return null;
      });

    if (!json) return null;

    if ('pageProps' in json) {
      const myList = json.pageProps.localRankingData.data?.mylist;
      if (!myList) return null;

      const videos = myList.items.map((item) => item.video) ?? [];

      return {
        id: myList.id,
        videos,
      } satisfies Ranking;
    }

    return json.data?.ranking ?? null;
  };

  if (!type) {
    const urls = [
      buildURL('top100'),
      buildURL('rookie'),
      buildURL('remix'),
      buildURL('exhibition'),
    ];

    const responses = await Promise.all(
      urls.map((url) => fetchPartialRanking(url))
    );

    return responses.filter((it): it is Ranking => !!it);
  } else {
    const url = buildURL(type);
    return await fetchPartialRanking(url);
  }
}) as FetchRanking;
