import { Ranking, RankingData, RankingType } from "@pages/content/types";

export const getRankingNumber = (type: RankingType): number | null => {
  if (type === "top100") return 286594;
  if (type === "rookie") return 286595;
  if (type === "remix") return 286596;

  return null;
};
export const getRankingType = (num: number): RankingType | null => {
  if (num === 286594) return "top100";
  if (num === 286595) return "rookie";
  if (num === 286596) return "remix";

  return null;
};

const buildURL = (type: RankingType, frontendId = 1) =>
  `https://nvapi.nicovideo.jp/v1/ranking/nicotop/${getRankingNumber(
    type
  )}?_frontendId=${frontendId}`;

const getRankingData = () => {
  const jsonScript =
    document.querySelector<HTMLScriptElement>("#__NEXT_DATA__");

  try {
    const json = JSON.parse(jsonScript?.textContent ?? "{}");

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
      throw Error("랭킹 데이터를 불러올 수 없습니다.");
    });
    const json: RankingData = await response.json().catch(() => {
      throw Error("랭킹 데이터를 파싱할 수 없습니다.");
    });

    return json;
  };

  if (!type) {
    const urls = [buildURL("top100"), buildURL("rookie"), buildURL("remix")];

    const responses = await Promise.all(
      urls.map((url) => fetchPartialRanking(url))
    );

    return responses
      .map((data) => data.data?.ranking)
      .filter((it): it is Ranking => !!it);
  } else {
    const url = buildURL(type);
    const json = await fetchPartialRanking(url);

    return json.data?.ranking;
  }
}) as FetchRanking;
