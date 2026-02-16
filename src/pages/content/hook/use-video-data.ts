import { createResource, createSignal } from 'solid-js';

import { fetchRanking } from '../api/ranking';
import { RankingType, VideoData } from '@/shared/types';

const [url, setUrl] = createSignal<string | null>(null);
export const useVideoData = () => createResource(
  url,
  async (url): Promise<{ type: RankingType; videoData: VideoData; } | null> => {
    const rankings = await fetchRanking();

    let type: RankingType | null = null;
    let videoData: VideoData | null = null;
    rankings.forEach((it) => {
      const video = it.ranking.videos.find((v) => url?.includes(v.id));
      if (!video) return;

      videoData = {
        video,
        type: it.type,
        ranking: it.ranking.videos.indexOf(video) + 1,
      };
      type = it.type;
    });

    if (!videoData || !type) return null;

    return {
      type,
      videoData,
    };
  },
);

export const resetVideoData = () => setUrl(null);
export const broadcastVideoClick = (url: string) => setUrl(url);
