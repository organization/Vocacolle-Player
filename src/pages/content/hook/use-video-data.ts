import { createResource, createSignal } from 'solid-js';

import { fetchRanking } from '../api/ranking';
import { RankingType, VideoData } from '@/shared/types';

type VideoDataOptions = {
  url: string;
} | {
  type: RankingType;
};
const [data, setData] = createSignal<VideoDataOptions | null>(null);
export const useVideoData = () => createResource(
  data,
  async (data): Promise<{ type: RankingType; videoData: VideoData; }[]> => {
    const rankings = await fetchRanking();

    if ('url' in data) {
      let type: RankingType | null = null;
      let videoData: VideoData | null = null;
      rankings.forEach((it) => {
        const video = it.ranking.videos.find((v) => data.url?.includes(v.id));
        if (!video) return;

        videoData = {
          video,
          type: it.type,
          ranking: it.ranking.videos.indexOf(video) + 1,
        };
        type = it.type;
      });

      if (!videoData || !type) return [];

      return [{
        type,
        videoData,
      }];
    }

    if ('type' in data) {
      const ranking = rankings.find((it) => it.type === data.type);
      if (!ranking) return [];

      return ranking.ranking.videos.map((video) => ({
        type: data.type,
        videoData: {
          video,
          type: data.type,
          ranking: ranking.ranking.videos.indexOf(video) + 1,
        },
      }));
    }

    return [];
  },
);

export const resetVideoData = () => setData(null);
export const broadcastVideoData = (data: VideoDataOptions) => setData(data);
