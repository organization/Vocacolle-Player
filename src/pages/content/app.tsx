import { createEffect, createSignal, on } from 'solid-js';
import { Portal, Show } from 'solid-js/web';
import { Flip, FlipProvider } from 'solid-flip';

import { Player } from '@/ui/player';
import { PlayerBar } from '@/ui/player-bar';
import { ToastProvider } from '@/ui/toast-provider';
import { PlayerProvider } from '@/ui/player-provider';
import { PlaylistView } from '@/ui/playlist-view';

import { player } from './store/player';
import { playlist } from './store/playlist';

import { fixedStyle, playerBarWrapperAnimationStyle, playerBarWrapperStyle, sidebarAnimationStyle, sidebarStyle } from './app.css';

export const App = () => {
  const [showSidebar, setShowSidebar] = createSignal(false);
  const [showPlayer, setShowPlayer] = createSignal(false);

  createEffect(on(() => !!playlist.current, (added) => {
    if (added && !showPlayer()) {
      setShowPlayer(true);
    }
  }));

  return (
    <FlipProvider>
      <ToastProvider>
        <PlayerProvider>
          <div class={fixedStyle}>
            <Portal>
              <Show when={playlist.current}>
                {(video) => (
                  <Player
                    videoId={video().video.id}
                    mode={player.mode}
                  />
                )}
              </Show>
            </Portal>
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
                onPrevious={() => { }}
                onPlayPause={() => { }}
                onNext={() => { }}
                onOpen={() => { }}
                onTogglePiP={() => { }}
                onPlaylist={() => setShowSidebar((prev) => !prev)}
                onClose={() => setShowPlayer(false)}
                onProgressChange={() => { }}
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
                  <h2>플레이리스트</h2>
                </div>
              </PlaylistView>
            </div>
          </div>
        </PlayerProvider>
      </ToastProvider>
    </FlipProvider>
  );
};
