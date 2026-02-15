import {
  createContext,
  createEffect,
  createMemo,
  JSX,
  on,
  onCleanup,
  useContext,
} from 'solid-js';

import { Event } from '@/shared/event';

type PlayerContextType = {
  sendEvent: (event: unknown) => void;
};
const PlayerContext = createContext<PlayerContextType | null>(null);

export type PlayerProviderProps = {


  children: JSX.Element;
};
export const PlayerProvider = (props: PlayerProviderProps) => {
  const sendEvent = (event: unknown) => {
    let timestamp = Date.now();

    const iframe = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
    iframe?.addEventListener(
      'load',
      () => {
        if (Date.now() - timestamp > 5000) return;

        setTimeout(() => {
          iframe?.contentWindow?.postMessage(event, '*');
        }, 100);
      },
      { once: true }
    );

    let count = 0;
    const trySend = setInterval(() => {
      count += 1;
      if (!iframe?.contentWindow || count > 500) return;

      iframe?.contentWindow?.postMessage(event, '*');
      clearInterval(trySend);
    }, 100);
  };

  return (
    <PlayerContext.Provider
      value={{
        sendEvent,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error('usePlayer must be used within a PlayerProvider');

  return context;
};
