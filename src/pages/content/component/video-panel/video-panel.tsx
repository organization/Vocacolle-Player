import { createSignal, For, onCleanup, onMount } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { ExternalLink, X } from 'lucide-solid';
import { JSX } from 'solid-js/jsx-runtime';

import { IconButton } from '@/ui/button';
import { PlayerController, PlayerControllerProps, useProgressDrag } from '@/ui/player-bar';
import { PlaylistView, PlaylistViewProps } from '@/ui/playlist-view';

import { Logo2026Winter } from '../logo';

import { hoverProgressStyle, progressStyle, progressVar } from '@/ui/player-bar/player-bar.css';
import { containerStyle, contentStyle, count, headerStyle, imageEffectAnimationStyle, imageEffectStyle, logoStyle, playlistTitleStyle, playlistWrapperStyle, progressWrapperStyle, sectionStyle, toolbarStyle } from './video-panel.css';

const availableBackgroundList = [
  '2025-summer/images/bg/bg_detail_pc.png',
  '2025-winter/images/bg/bg_detail_pc.png',
  '2024-winter/images/bg/bg_detail_pc.png',
  '2023-summer/images/bg/bg_detail_pc.png',
  '2023-spring/_nuxt/img/bg_detail_pc.503fade.png',
];

export type VideoPanelProps = PlayerControllerProps & Omit<PlaylistViewProps, 'nowPlayingId'> & {
  children?: JSX.Element;
  playlistIndex: number;
  onOpen: () => void;
  onClose: () => void;
  onProgressChange: (progress: number) => void;
};
export const VideoPanel = (props: VideoPanelProps) => {
  const {
    movingProgress,
    hoverProgress,
    isMoving,
    props: dragProps,
  } = useProgressDrag({
    initProgress: props.progress,
    onProgressChange: props.onProgressChange,
  });

  const [effectBackgroundList, setEffectBackgroundList] = createSignal<string[]>(availableBackgroundList);
  const [effectIndex, setEffectIndex] = createSignal(0);

  const progress = () => movingProgress() ?? props.progress;

  onMount(() => {
    const getShuffled = () => {
      const list = [...availableBackgroundList];

      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }

      return list;
    };

    setEffectBackgroundList(getShuffled());
    const interval = setInterval(() => {
      setEffectIndex((prev) => (prev + 1) % availableBackgroundList.length);
      if (effectIndex() === 0) {
        setEffectBackgroundList(getShuffled());
      }
    }, 5000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return (
    <div
      class={containerStyle}
      style={assignInlineVars({
        [count]: effectBackgroundList().length.toString(),
      })}
    >
      <For each={effectBackgroundList()}>
        {(url, index) => (
          <img
            src={`https://vocaloid-collection.jp/${url}`}
            classList={{
              [imageEffectStyle]: true,
              [imageEffectAnimationStyle.show]: index() === effectIndex(),
              [imageEffectAnimationStyle.hide]: index() !== effectIndex(),
            }}
            style={{
              'animation-delay': `${(index() - effectBackgroundList().length) * 5}s`,
            }}
          />
        )}
      </For>
      <div class={contentStyle}>
        <div class={headerStyle}>
          <Logo2026Winter class={logoStyle} />
          <IconButton
            icon={X}
            onClick={props.onClose}
          />
        </div>
        <div class={sectionStyle}>
          {props.children}
          <div class={playlistWrapperStyle}>
            <PlaylistView
              nowPlayingId={props.nowPlaying?.video.id}
              playlist={props.playlist}
              onVideo={props.onVideo}
            >
              <h2 class={playlistTitleStyle}>
                재생목록 ({props.playlistIndex + 1} / {props.playlist.length})
              </h2>
            </PlaylistView>
          </div>
        </div>
        <div class={toolbarStyle}>
          <PlayerController
            nowPlaying={props.nowPlaying}
            state={props.state}
            canPrevious={props.canPrevious}
            canNext={props.canNext}
            onPrevious={props.onPrevious}
            onPlayPause={props.onPlayPause}
            onNext={props.onNext}
            progress={progress()}
          />
          <div
            {...dragProps}
            class={progressWrapperStyle}
          >
            <div
              class={hoverProgressStyle}
              style={assignInlineVars({
                [progressVar]: `${hoverProgress() ?? 0}`,
              })}
            />
            <div
              class={progressStyle}
              style={assignInlineVars({
                [progressVar]: `${progress()}`,
                transition: isMoving() ? 'unset' : undefined,
              })}
            />
          </div>
          <IconButton icon={ExternalLink} onClick={props.onOpen} />
        </div>
      </div>
    </div>
  );
};
