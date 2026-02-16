import { createEffect, createMemo, createSignal, on, onCleanup } from 'solid-js';
import { Show } from 'solid-js/web';
import { FlipProvider } from 'solid-flip';

import { Player } from '@/ui/player';
import { PlayerBar } from '@/ui/player-bar';
import { addToast, ToastProvider } from '@/ui/toast-provider';
import { PlayerProvider, usePlayer } from '@/ui/player-provider';
import { PlaylistView } from '@/ui/playlist-view';
import { Dialog } from '@/ui/dialog';

import { Event } from '@/shared/event';

import { player, setPlayer } from './store/player';
import { playlist, setPlaylist } from './store/playlist';
import { resetVideoData, useVideoData } from './hook/use-video-data';

import { fixedStyle, playerBarWrapperAnimationStyle, playerBarWrapperStyle, sidebarAnimationStyle, sidebarHeaderStyle, sidebarStyle, sidebarTitleStyle, videoContainerStyle, videoWrapperAnimationStyle } from './app.css';
import { ListMusic, ListX } from 'lucide-solid';
import { IconButton } from '@/ui/button';

const EventList = Object.values(Event);
const Content = () => {
  const { sendEvent } = usePlayer();
  const [videoData] = useVideoData();

  const [showSidebar, setShowSidebar] = createSignal(false);
  const [showPlayer, setShowPlayer] = createSignal(false);
  const [openExistCheck, setOpenExistCheck] = createSignal(false);

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

  // video clicked
  createEffect(
    on(videoData, (data) => {
      if (!data) return;

      const isPlaylistExist = playlist.playlist.length > 0;
      if (isPlaylistExist) {
        setOpenExistCheck(true);
      } else {
        setPlaylist('playlist', (prev) => [...prev, data.videoData]);
        addToast({
          message: `"${data.videoData.video.title}"(이)가 재생목록에 추가되었습니다.`,
        });
        resetVideoData();
      }
    }),
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
          onOpen={() => {
            const video = playlist.currentVideo;
            if (!video) return;

            window.open(`https://www.nicovideo.jp/watch/${video.id}`);
          }}
          onAlbumClick={() => { }}
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
          <div class={sidebarHeaderStyle}>
            <h2 class={sidebarTitleStyle}>재생목록</h2>
            <IconButton icon={ListX} onClick={() => setPlaylist({ playlist: [], currentIndex: 0, type: null })} />
            <IconButton icon={ListMusic} onClick={() => setShowSidebar(false)} />
          </div>
        </PlaylistView>
      </div>
      <Dialog
        title={'재생목록이 이미 존재합니다'}
        description={'현재 재생목록이 존재합니다. 현재 재생목록을 리셋하고 새로운 재생목록을 만드시겠습니까?'}
        actions={[
          { id: 'cancel', label: '취소', type: 'default' },
          { id: 'confirm', label: '새로 만들기', type: 'primary' },
        ]}
        open={openExistCheck()}
        onClose={() => setOpenExistCheck(false)}
        onAction={(id) => {
          setOpenExistCheck(false);

          if (id === 'confirm') {
            const data = videoData()?.videoData;
            if (!data) {
              addToast({
                message: `"${videoData()?.videoData.video.title}"(을)를 재생목록에 추가하지 못하였습니다.`,
              });
              return;
            }

            setPlaylist({
              playlist: [data],
              currentIndex: 0,
              type: videoData()?.type ?? null,
            });
            addToast({
              message: `"${videoData()?.videoData.video.title}"(이)가 재생목록에 추가되었습니다.`,
            });
            resetVideoData();
          }
        }}
      >
      </Dialog>
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
