import { createStore } from 'solid-js/store';
import { fetchRanking } from '@pages/content/api/ranking';
import { Video } from '@pages/content/types';

export type PlaylistStore = {
  playlist: Video[];
  currentIndex: number;
  mode: 'hidden' | 'full';
};
export const [playlist, setPlaylist] = createStore<PlaylistStore>({
  playlist: [],
  currentIndex: 0,
  mode: 'hidden',
});

interface RankingPlaylistOptions {
  videoUrl?: string;
  ranking?: number;
}

export const setRankingPlaylist = async ({
  videoUrl,
  ranking: rankingNumber = 0,
}: RankingPlaylistOptions) => {
  const rankings = await fetchRanking();

  let index = rankingNumber - 1;
  let videos: Video[] = [];

  if (index < 0) {
    rankings.forEach((ranking) => {
      if (index >= 0) return;

      const foundIndex = ranking.videos.findIndex((v) =>
        videoUrl?.includes(v.id)
      );
      if (foundIndex < 0) return;

      index = foundIndex;
      videos = ranking.videos;
    });
  }

  if (index < 0) return;

  setPlaylist({
    playlist: videos,
    currentIndex: index,
  });
};

export const currentVideo = (): Video | undefined =>
  playlist.playlist[playlist.currentIndex];
