import { PlayerBar } from '@/ui/player-bar';
import { ToastProvider } from '@/ui/toast-provider';
import { PlayerProvider } from '@/ui/player-provider';

import { fixedStyle } from './app.css';
import { playlist } from './store/playlist';
import { player } from './store/player';
import { Portal, Show } from 'solid-js/web';
import { Player } from '@/ui/player/player';

export const App = () => {
  return (
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
          <PlayerBar
            nowPlaying={playlist.current}
            playlistIndex={playlist.currentIndex}
            progress={player.progress}
            state={player.state}
            mode={player.mode}
            onPrevious={() => { }}
            onPlayPause={() => { }}
            onNext={() => { }}
            onOpen={() => { }}
            onTogglePiP={() => { }}
            onPlaylist={() => { }}
            onClose={() => { }}
            onProgressChange={() => { }}
          />
        </div>
      </PlayerProvider>
    </ToastProvider>
  );
};
