import { createStore } from 'solid-js/store';

import { RankingType, Video, VideoData } from '@/shared/types';
import { rankingTypeToText } from '@/utils/convert';

import { fetchRanking } from '../api/ranking';

export type PlaylistStore = {
  playlist: VideoData[];
  currentIndex: number;
  mode: 'hidden' | 'full';
  type: RankingType | null;

  get typeName(): string | null;
  get current(): VideoData | null;
  get currentVideo(): Video | null;
};
export const [playlist, setPlaylist] = createStore<PlaylistStore>({
  playlist: [],
  currentIndex: 0,
  mode: 'hidden',
  type: null,

  get typeName() {
    return rankingTypeToText(this.type);
  },
  get current() {
    return this.playlist[this.currentIndex] ?? null;
  },
  get currentVideo() {
    return this.current?.video ?? null;
  },
});

export const setRankingPlaylist = async (type: RankingType) => {
  const ranking = await fetchRanking(type);
  if (!ranking) return;

  setPlaylist({
    playlist: ranking.videos.map((video) => ({
      video,
      type,
      ranking: ranking.videos.indexOf(video) + 1,
    })),
    type,
  });
};

export const addPlaylist = async (videoUrl: string): Promise<VideoData | null> => {
  const rankings = await fetchRanking();

  let type: RankingType | null = null;
  let videoData: VideoData | null = null;
  rankings.forEach((it) => {
    const video = it.ranking.videos.find((v) => videoUrl?.includes(v.id));
    if (!video) return;

    videoData = {
      video,
      type: it.type,
      ranking: it.ranking.videos.indexOf(video) + 1,
    };
    type = it.type;
  });

  if (!videoData || !type) return null;

  setPlaylist({
    playlist: [...playlist.playlist, videoData],
    type,
  });

  return videoData;
};
