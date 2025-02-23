import {
  createContext,
  createEffect,
  JSX,
  on,
  onCleanup,
  useContext,
} from 'solid-js';
import { currentVideo, playlist, setPlaylist } from '@pages/content/store/playlist';
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
    on(currentVideo, () => {
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

  createEffect(
    on(currentVideo, (video) => {
      if (!video) return;

      const dom = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
      if (!dom) return;

      setPlayer('state', 'paused');
      setTimeout(() => {
        setPlayer('state', 'playing');
      }, 1000);
    })
  );

  createEffect(on(() => player.progress, (progress) => {
    if (Math.abs(1 - progress) > 0.0005) return;
    setPlaylist('currentIndex', (index) => Math.min(index + 1, playlist.playlist.length - 1));
  }));

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
