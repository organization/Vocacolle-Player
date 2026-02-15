import { createEffect, createMemo, createSignal, on, onCleanup } from 'solid-js';
import { Show } from 'solid-js/web';
import { FlipProvider } from 'solid-flip';

import { Player } from '@/ui/player';
import { PlayerBar } from '@/ui/player-bar';
import { ToastProvider } from '@/ui/toast-provider';
import { PlayerProvider, usePlayer } from '@/ui/player-provider';
import { PlaylistView } from '@/ui/playlist-view';

import { Event } from '@/shared/event';

import { player, setPlayer } from './store/player';
import { playlist, setPlaylist } from './store/playlist';

import { fixedStyle, playerBarWrapperAnimationStyle, playerBarWrapperStyle, sidebarAnimationStyle, sidebarStyle, sidebarTitleStyle, videoContainerStyle, videoWrapperAnimationStyle } from './app.css';

const EventList = Object.values(Event);
const Content = () => {
  const { sendEvent } = usePlayer();

  const [showSidebar, setShowSidebar] = createSignal(false);
  const [showPlayer, setShowPlayer] = createSignal(false);

  createEffect(on(() => !!playlist.current, (added) => {
    if (added && !showPlayer()) {
      setShowPlayer(true);
    }
  }));

  createEffect(
    on(
      () => playlist.currentVideo,
      () => {
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
      }
    )
  );

  // auto play
  const currentVideoId = createMemo(() => playlist.currentVideo?.id);
  createEffect(
    on(currentVideoId, (video) => {
      if (!video) return;

      const dom = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
      if (!dom) return;

      setPlayer('state', 'paused');
      requestAnimationFrame(() => {
        setPlayer('state', 'playing');
      });
    })
  );

  // onNext
  createEffect(
    on(
      () => player.progress,
      (progress) => {
        if (Math.abs(1 - progress) > 0.0005) return;
        setPlaylist('currentIndex', (index) =>
          Math.min(index + 1, playlist.playlist.length - 1)
        );
      }
    )
  );

  // event
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


  return (
    <div class={fixedStyle}>
      <div
        classList={{
          [videoContainerStyle]: true,
          [videoWrapperAnimationStyle.enter]: showPlayer(),
          [videoWrapperAnimationStyle.exit]: !showPlayer(),
        }}
      >
        <Show when={playlist.current}>
          {(video) => (
            <Player
              videoId={video().video.id}
            />
          )}
        </Show>
      </div>
      <div
        classList={{
          [playerBarWrapperStyle]: true,
          [playerBarWrapperAnimationStyle.enter]: showPlayer(),
          [playerBarWrapperAnimationStyle.exit]: !showPlayer(),
        }}
      >
        <PlayerBar
          nowPlaying={playlist.current}
          playlistIndex={playlist.currentIndex}
          progress={player.progress}
          state={player.state}
          onPrevious={() => setPlaylist('currentIndex', (index) => Math.max(index - 1, 0))}
          onPlayPause={() => setPlayer('state', (state) => (state === 'playing' ? 'paused' : 'playing'))}
          onNext={() => setPlaylist('currentIndex', (index) => Math.min(index + 1, playlist.playlist.length - 1))}
          onOpen={() => { }}
          onPlaylist={() => setShowSidebar((prev) => !prev)}
          onClose={() => setShowPlayer(false)}
          onProgressChange={(progress) => sendEvent({ type: Event.progress, progress })}
        />
      </div>
      <div
        class={sidebarStyle}
        classList={{
          [sidebarStyle]: true,
          [sidebarAnimationStyle.show]: showSidebar(),
          [sidebarAnimationStyle.hide]: !showSidebar(),
        }}
      >
        <PlaylistView
          playlist={playlist.playlist}
        >
          <div>
            <h2 class={sidebarTitleStyle}>플레이리스트</h2>
          </div>
        </PlaylistView>
      </div>
    </div>
  );
};

export const App = () => (
  <FlipProvider>
    <ToastProvider>
      <PlayerProvider>
        <Content />
      </PlayerProvider>
    </ToastProvider>
  </FlipProvider>
);
