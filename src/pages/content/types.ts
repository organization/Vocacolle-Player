export type RankingType = 'top100' | 'rookie' | 'remix';

export interface RankingData {
  meta: Meta;
  data?: Data;
}

export interface Meta {
  status: number;
}

export interface Data {
  ranking: Ranking;
}

export interface Ranking {
  id: number;
  setting: Setting;
  videos: Video[];
}

export interface Setting {
  id: number;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  genres: Genre[];
  tag: string;
  term: string;
  startDateTime: string;
  endDateTime: string;
  channelVideoListingStatus: string;
}

export interface Genre {
  key: string;
  label: string;
}

export interface Video {
  type: string;
  id: string;
  title: string;
  registeredAt: string;
  count: Count;
  thumbnail: Thumbnail;
  duration: number;
  shortDescription: string;
  latestCommentSummary: string;
  isChannelVideo: boolean;
  isPaymentRequired: boolean;
  playbackPosition: number | null;
  owner: Owner;
  requireSensitiveMasking: boolean;
  videoLive: any; // 필요 시 구체적인 타입으로 수정
  isMuted: boolean;
  '9d091f87': boolean;
  acf68865: boolean;
}

export interface Count {
  view: number;
  comment: number;
  mylist: number;
  like: number;
}

export interface Thumbnail {
  url: string;
  middleUrl: string;
  largeUrl: string;
  listingUrl: string;
  nHdUrl: string;
}

export interface Owner {
  ownerType: string;
  type: string;
  visibility: string;
  id: string;
  name: string;
  iconUrl: string;
}
