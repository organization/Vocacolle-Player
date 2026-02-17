import { createReaction, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-solid';
import { JSX } from 'solid-js/jsx-runtime';
import { Flip, Unflip } from 'solid-flip';

import { IconButton } from '@/ui/button';
import { PlayerBarProps } from '@/ui/player-bar';
import { PlaylistView, PlaylistViewProps } from '@/ui/playlist-view';
import { formatTime } from '@/utils';

import { Logo2026Winter } from '../logo';

import { timeStyle } from '@/ui/player-bar/player-bar.css';
import { containerStyle, contentStyle, count, headerStyle, imageEffectAnimationStyle, imageEffectStyle, logoStyle, playlistTitleStyle, playlistWrapperStyle, progressStyle, progressVar, progressWrapperStyle, sectionStyle, toolbarStyle } from './video-panel.css';

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

  const [effectBackgroundList, setEffectBackgroundList] = createSignal<string[]>(availableBackgroundList);
  const [effectIndex, setEffectIndex] = createSignal(0);

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
