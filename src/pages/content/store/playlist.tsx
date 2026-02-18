import { createContext, JSX, useContext } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';

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
const PlaylistContext = createContext<{
  playlist: PlaylistStore;
  setPlaylist: SetStoreFunction<PlaylistStore>;
}>();

type PlaylistProviderProps = {
  children: JSX.Element;
};
export const PlaylistProvider = (props: PlaylistProviderProps) => {
  const [playlist, setPlaylist] = createStore<PlaylistStore>({
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

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist }}>
      {props.children}
    </PlaylistContext.Provider>
  );
};
export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylist must be used within a PlaylistProvider');

  const setRankingPlaylist = async (type: RankingType) => {
    const ranking = await fetchRanking(type);
    if (!ranking) return;

    context.setPlaylist({
      playlist: ranking.videos.map((video) => ({
        video,
        type,
        ranking: ranking.videos.indexOf(video) + 1,
      })),
      type,
    });
  };

  const addPlaylist = async (videoUrl: string): Promise<VideoData | null> => {
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

    context.setPlaylist({
      playlist: [...context.playlist.playlist, videoData],
      type,
    });

    return videoData;
  };


  return {
    playlist: context.playlist,
    setPlaylist: context.setPlaylist,
    setRankingPlaylist,
    addPlaylist,
  };
};
