import { createEffect, createSignal } from 'solid-js';

type InjectEvent = {
  type: string;
  [key: string]: unknown;
};
const [data, setData] = createSignal<InjectEvent | null>(null);
export const useInjectData = (callback?: (data: InjectEvent | null) => void) => {
  createEffect(() => {
    callback?.(data());
  });

  return data;
};

export const resetInjectData = () => setData(null);
export const broadcastInjectData = (data: InjectEvent) => setData(data);