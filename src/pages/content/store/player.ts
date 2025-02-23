import { createStore } from 'solid-js/store';

export type PlayerStore = {
  state: 'playing' | 'paused';
  volume: number;
  mode: 'hidden' | 'full' | 'pip';
  progress: number;
};
export const [player, setPlayer] = createStore<PlayerStore>({
  state: 'paused',
  volume: 0.5,
  mode: 'hidden',
  progress: 0,
});
