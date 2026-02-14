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

const EventList = Object.values(Event);

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

  // createEffect(
  //   on(
  //     () => playlist.currentVideo,
  //     () => {
  //       const listener = (event: MessageEvent) => {
  //         if (!event.data) return;
  //         if (typeof event.data !== 'object') return;
  //         if (!('type' in event.data && EventList.includes(event.data.type)))
  //           return;

  //         switch (event.data.type) {
  //           case Event.progress: {
  //             setPlayer('progress', event.data.percentage);
  //             break;
  //           }
  //           default:
  //             break;
  //         }
  //       };

  //       window.addEventListener('message', listener);
  //       onCleanup(() => {
  //         window.removeEventListener('message', listener);
  //       });
  //     }
  //   )
  // );

  // // auto play
  // const currentVideoId = createMemo(() => playlist.currentVideo?.id);
  // createEffect(
  //   on(currentVideoId, (video) => {
  //     if (!video) return;

  //     const dom = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
  //     if (!dom) return;

  //     setPlayer('state', 'paused');
  //     requestAnimationFrame(() => {
  //       setPlayer('state', 'playing');
  //     });
  //   })
  // );

  // // onNext
  // createEffect(
  //   on(
  //     () => player.progress,
  //     (progress) => {
  //       if (Math.abs(1 - progress) > 0.0005) return;
  //       setPlaylist('currentIndex', (index) =>
  //         Math.min(index + 1, playlist.playlist.length - 1)
  //       );
  //     }
  //   )
  // );

  // // event
  // createEffect(
  //   on(
  //     () => player.state,
  //     (state) => {
  //       if (state === 'playing') {
  //         sendEvent({ type: Event.play });
  //       }
  //       if (state === 'paused') {
  //         sendEvent({ type: Event.pause });
  //       }
  //     }
  //   )
  // );

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
