import { createContext, JSX, useContext } from 'solid-js';

type PlayerContextType = {
  sendEvent: (event: unknown, signal?: AbortSignal) => void;
};
const PlayerContext = createContext<PlayerContextType | null>(null);

export type PlayerProviderProps = {
  children: JSX.Element;
};
export const PlayerProvider = (props: PlayerProviderProps) => {
  const sendEvent = (event: unknown, signal?: AbortSignal) => {
    if (signal?.aborted) return;

    let timestamp = Date.now();

    const iframe = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const onLoad = () => {
      if (Date.now() - timestamp > 5000 || signal?.aborted) return;

      timeout = setTimeout(() => {
        if (!signal?.aborted) iframe?.contentWindow?.postMessage(event, '*');
      }, 100);
    };
    iframe?.addEventListener('load', onLoad, { once: true });

    let count = 0;
    const trySend = setInterval(() => {
      count += 1;
      if (!iframe?.contentWindow || count > 500) return;

      iframe?.contentWindow?.postMessage(event, '*');
      clearInterval(trySend);
    }, 100);
    signal?.addEventListener(
      'abort',
      () => {
        iframe?.removeEventListener('load', onLoad);
        clearTimeout(timeout);
        clearInterval(trySend);
      },
      { once: true }
    );
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
