import { createEffect, createMemo, createSignal, on, onCleanup, onMount } from 'solid-js';
import { Show } from 'solid-js/web';
import { Flip, FlipProvider } from 'solid-flip';
import { ListMusic, ListX } from 'lucide-solid';

import { Player } from '@/ui/player';
import { Dialog } from '@/ui/dialog';
import { IconButton } from '@/ui/button';
import { PlayerBar } from '@/ui/player-bar';
import { addToast, ToastProvider } from '@/ui/toast-provider';
import { PlayerProvider, usePlayer } from '@/ui/player-provider';
import { PlaylistView } from '@/ui/playlist-view';

import { Event } from '@/shared/event';

import { player, setPlayer } from './store/player';
import { PlaylistProvider, usePlaylist } from './store/playlist';
import { resetVideoData, useVideoData } from './hook/use-video-data';

import { VideoPanel } from './component/video-panel';

import { fixedStyle, playerBarWrapperAnimationStyle, playerBarWrapperStyle, sidebarAnimationStyle, sidebarHeaderStyle, sidebarStyle, sidebarTitleStyle, videoContainerStyle, videoPanelAnimationStyle, videoWrapperAnimationStyle } from './app.css';

const EventList = Object.values(Event);
const Content = () => {
  const { sendEvent } = usePlayer();
  const { playlist, setPlaylist } = usePlaylist();
  const [videoData] = useVideoData();

  const [showFullscreen, setShowFullscreen] = createSignal(false);
  const [showSidebar, setShowSidebar] = createSignal(false);
  const [showPlayer, setShowPlayer] = createSignal(false);
  const [openExistCheck, setOpenExistCheck] = createSignal(false);

  createEffect(on(() => !!playlist.current, (added) => {
    if (added && !showPlayer()) {
      setShowPlayer(true);
    }
  }));

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
      if (!data || data.length <= 0) return;

      const isPlaylistExist = playlist.playlist.length > 0;
      if (isPlaylistExist) {
        setOpenExistCheck(true);
      } else {
        setPlaylist('playlist', (prev) => [...prev, ...data.map((d) => d.videoData)]);
        if (data.length === 1) {
          addToast({
            message: `"${data[0].videoData.video.title}"(이)가 재생목록에 추가되었습니다.`,
          });
        } else {
          addToast({
            message: `${data.length}개의 곡이 재생목록에 추가되었습니다.`,
          });
        }

        resetVideoData();
      }
    }),
  );

  onMount(() => {
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
    onCleanup(() => window.removeEventListener('message', listener));
  })

  const videoPlayer = (
    <Player
      videoId={playlist.current?.video.id}
      pip={!showFullscreen()}
    />
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
        <Show when={playlist.current && !showFullscreen()}>
          {videoPlayer}
        </Show>
      </div>
      <Show when={showFullscreen()} keyed>
        <Flip
          id={'video-panel'}
          enter={videoPanelAnimationStyle.enter}
          exit={videoPanelAnimationStyle.exit}
        >
          <VideoPanel
            nowPlaying={playlist.current}
            playlistIndex={playlist.currentIndex}
            progress={player.progress}
            state={player.state}
            playlist={playlist.playlist}
            canPrevious={playlist.currentIndex > 0}
            canNext={playlist.currentIndex < playlist.playlist.length - 1}
            onPrevious={() => setPlaylist('currentIndex', (index) => Math.max(index - 1, 0))}
            onPlayPause={() => setPlayer('state', (state) => (state === 'playing' ? 'paused' : 'playing'))}
            onNext={() => setPlaylist('currentIndex', (index) => Math.min(index + 1, playlist.playlist.length - 1))}
            onOpen={() => {
              const video = playlist.currentVideo;
              if (!video) return;

              window.open(`https://www.nicovideo.jp/watch/${video.id}`);
            }}
            onAlbumClick={() => setShowFullscreen(true)}
            onPlaylist={() => setShowSidebar((prev) => !prev)}
            onClose={() => setShowFullscreen(false)}
            onProgressChange={(progress) => sendEvent({ type: Event.progress, progress })}
            onVideo={(_, index) => setPlaylist('currentIndex', index)}
          >
            {videoPlayer}
          </VideoPanel>
        </Flip>
      </Show>
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
          canPrevious={playlist.currentIndex > 0}
          canNext={playlist.currentIndex < playlist.playlist.length - 1}
          onPrevious={() => setPlaylist('currentIndex', (index) => Math.max(index - 1, 0))}
          onPlayPause={() => setPlayer('state', (state) => (state === 'playing' ? 'paused' : 'playing'))}
          onNext={() => setPlaylist('currentIndex', (index) => Math.min(index + 1, playlist.playlist.length - 1))}
          onOpen={() => {
            const video = playlist.currentVideo;
            if (!video) return;

            window.open(`https://www.nicovideo.jp/watch/${video.id}`);
          }}
          onAlbumClick={() => setShowFullscreen(true)}
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
          nowPlayingId={playlist.currentVideo?.id}
          playlist={playlist.playlist}
          onVideo={(_, index) => setPlaylist('currentIndex', index)}
        >
          <div class={sidebarHeaderStyle}>
            <h2 class={sidebarTitleStyle}>
              {`재생목록 (${playlist.currentIndex + 1} / ${playlist.playlist.length})`}
            </h2>
            <IconButton icon={ListX} onClick={() => setPlaylist({ playlist: [], currentIndex: 0, type: null })} />
            <IconButton icon={ListMusic} onClick={() => setShowSidebar(false)} />
          </div>
        </PlaylistView>
      </div>
      <Dialog
        title={'재생목록이 이미 존재합니다'}
        description={'현재 재생목록이 존재합니다. 선택한 곡을 현재 재생목록에 추가하시겠습니까? 혹은 새로 재생목록을 만드시겠습니까?'}
        actions={[
          { id: 'add', label: '현재 재생목록에 추가', type: 'default' },
          { id: 'confirm', label: '새로 만들기', type: 'primary' },
        ]}
        open={openExistCheck()}
        onClose={() => setOpenExistCheck(false)}
        onAction={(id) => {
          setOpenExistCheck(false);

          const data = videoData()?.[0]?.videoData;
          if (!data) {
            addToast({
              message: `"${videoData()?.[0]?.videoData.video.title}"(을)를 재생목록에 추가하지 못하였습니다.`,
            });
            return;
          }

          if (id === 'confirm') {
            setPlaylist({
              playlist: [data],
              currentIndex: 0,
              type: videoData()?.[0]?.type ?? null,
            });
            resetVideoData();
          } else {
            setPlaylist('playlist', (prev) => [...prev, data]);
          }

          addToast({
            message: `"${videoData()?.[0]?.videoData.video.title}"(이)가 재생목록에 추가되었습니다.`,
          });
        }}
      >
      </Dialog>
    </div>
  );
};

export const App = () => (
  <PlaylistProvider>
    <FlipProvider>
      <ToastProvider>
        <PlayerProvider>
          <Content />
        </PlayerProvider>
      </ToastProvider>
    </FlipProvider>
  </PlaylistProvider>
);
