import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-solid';
import { JSX } from 'solid-js/jsx-runtime';
import { createReaction, createSignal, Show } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { IconButton } from '@/ui/button';
import { PlayerBarProps } from '@/ui/player-bar';
import { PlaylistView, PlaylistViewProps } from '@/ui/playlist-view';
import { timeStyle } from '@/ui/player-bar/player-bar.css';
import { formatTime } from '@/utils';

import { Logo2026Winter } from '../logo';

import { containerStyle, contentStyle, headerStyle, imageEffectStyle, logoStyle, playlistTitleStyle, playlistWrapperStyle, progressStyle, progressVar, progressWrapperStyle, sectionStyle, toolbarStyle } from './video-panel.css';

const availableBackgroundList = [
  '2025-summer/images/bg/bg_detail_pc.png',
  '2025-winter/images/bg/bg_detail_pc.png',
  '2024-winter/images/bg/bg_detail_pc.png',
  '2023-summer/images/bg/bg_detail_pc.png',
  '2023-spring/_nuxt/img/bg_detail_pc.503fade.png',
];

export type VideoPanelProps = PlayerBarProps & PlaylistViewProps & {
  children?: JSX.Element;

  onClose: () => void;
};
export const VideoPanel = (props: VideoPanelProps) => {
  const [isMoving, setIsMoving] = createSignal(false);
  const [progress, setProgress] = createSignal<number | null>(null);
  const [slider, setSlider] = createSignal<HTMLDivElement | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);
  const [effectIndex, setEffectIndex] = createSignal(Math.floor(Math.random() * availableBackgroundList.length));

  const backgroundEffectUrl = () => `https://vocaloid-collection.jp/${availableBackgroundList[effectIndex()]}`;
  const maxWidth = () => (rect()?.width ?? 16) - 16;

  const onMoveStart = (event: PointerEvent) => {
    const element = slider();
    if (!element) return;

    const last = event.composedPath()[0];
    if (!(last instanceof HTMLElement)) return;
    if (element !== last) return;

    setIsMoving(true);
    setProgress(props.progress);
    setRect(element.getBoundingClientRect());
    onMove(event);

    const onEnd = (event: PointerEvent) => {
      onMove(event, true);

      const track = createReaction(() => props.progress);
      track(() => {
        requestAnimationFrame(() => {
          setIsMoving(false);
          setProgress(null);
        });
      });

      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', cleanUp);
    };
    const cleanUp = (event: PointerEvent) => {
      onMove(event, false);

      setIsMoving(false);
      setProgress(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', cleanUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', cleanUp);
  };
  const onMove = (event: PointerEvent, isEnd = false) => {
    const domRect = rect();
    if (!domRect) return;

    const max = Math.max(1, maxWidth());
    const now = Math.min(Math.max(0, event.pageX - domRect.left), max);

    const value = now / max;
    requestAnimationFrame(() => {
      setIsMoving(true);
      setProgress(value);
    });

    if (isEnd) {
      props.onProgressChange(value);
    }
  };

  return (
    <div class={containerStyle}>
      <img
        src={backgroundEffectUrl()}
        class={imageEffectStyle}
      />
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
              playlist={props.playlist}
            >
              <h2 class={playlistTitleStyle}>
                재생목록
              </h2>
            </PlaylistView>
          </div>
        </div>
        <div class={toolbarStyle}>
          <IconButton fill={'currentColor'} icon={SkipBack} onClick={props.onPrevious} />
          <IconButton fill={'currentColor'} icon={props.state === 'playing' ? Pause : Play} onClick={props.onPlayPause} />
          <IconButton fill={'currentColor'} icon={SkipForward} onClick={props.onNext} />
          <Show when={props.nowPlaying?.video}>
            {(video) => (
              <>
                <div class={timeStyle}>
                  {formatTime(
                    video().duration * (progress() ?? props.progress)
                  )}
                </div>
                <div class={timeStyle}>/</div>
                <div class={timeStyle}>{formatTime(video().duration)}</div>
              </>
            )}
          </Show>
          <div
            ref={setSlider}
            class={progressWrapperStyle}
            onPointerDown={onMoveStart}
          >
            <div
              class={progressStyle}
              style={assignInlineVars({
                [progressVar]: `${progress() ?? props.progress}`,
                transition: isMoving() ? 'unset' : undefined,
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
