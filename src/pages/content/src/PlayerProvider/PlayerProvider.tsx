import {
  createContext,
  createEffect,
  JSX,
  on,
  onCleanup,
  useContext,
} from 'solid-js';
import { currentVideo } from '@pages/content/store/playlist';
import { Event } from '@pages/content/event';
import { player, setPlayer } from '@pages/content/store/player';

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
    const iframe = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
    iframe?.contentWindow?.postMessage(event, '*');
  };

  createEffect(
    on(
      () => player.state,
      (state) => {
        if (state === 'playing') {
          sendEvent({ type: Event.play });
        }
        if (state === 'paused') {
          sendEvent({ type: Event.pause });
        }
      }
    )
  );

  createEffect(
    on(currentVideo, (video) => {
      const listener = (event: MessageEvent) => {
        if (!event.data) return;
        if (typeof event.data !== 'object') return;
        if (!('type' in event.data && EventList.includes(event.data.type)))
          return;

        switch (event.data.type) {
          case Event.progress: {
            setPlayer('progress', event.data.percentage);
            break;
          }
          default:
            break;
        }
      };

      window.addEventListener('message', listener);
      onCleanup(() => {
        window.removeEventListener('message', listener);
      });
    })
  );

  // createEffect(
  //   on(currentVideo, (video) => {
  //     if (!video) return;
  //
  //     const url = `https://embed.nicovideo.jp/watch/${video.id}?persistence=1&oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1`;
  //     const dom = (<iframe
  //       id={'vcp-iframe'}
  //       src={url}
  //       style={{ opacity: 0, position: 'fixed', top: 0, left: 0, 'pointer-events': 'none' }}
  //     />) as HTMLIFrameElement;
  //
  //     dom.addEventListener("load", () => {
  //       setTimeout(() => {
  //         setPlayer('state', 'playing');
  //       }, 100);
  //     });
  //
  //     document.body.append(dom);
  //     onCleanup(() => dom.remove());
  //   })
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
