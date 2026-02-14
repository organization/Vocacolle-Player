import { createReaction, createSignal, Show } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  ChevronUp,
  ExternalLink,
  Fullscreen,
  Pause,
  PictureInPicture,
  Play,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-solid';

import { PlayInfo } from '@/ui/play-info';
import { usePlayer } from '@/ui/player-provider';
import { useLiquidSurface } from '@/ui/glass';
import { formatTime } from '@/utils';

import { Event } from '@/shared/event';
import { VideoData } from '@/shared/types';

import {
  centerContainerStyle,
  containerStyle,
  glassFilter,
  iconButtonStyle,
  iconExpandStyle,
  iconStyle,
  playerBarInfoStyle,
  progressStyle,
  progressVar,
  timeStyle,
  wrapperAnimationStyle,
  wrapperStyle,
} from './player-bar.css';

export type PlayerBarProps = {
  nowPlaying: VideoData | null;
  progress: number;
  state: 'playing' | 'paused';
  mode: 'full' | 'pip' | 'hidden';
  playlistIndex: number;

  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onOpen: () => void;
  onFullscreen: () => void;
  onTogglePiP: () => void;
  onExpand: () => void;
  onClose: () => void;
  onProgressChange: (progress: number) => void;
};
export const PlayerBar = (props: PlayerBarProps) => {
  const { sendEvent } = usePlayer();

  const [isMoving, setIsMoving] = createSignal(false);
  const [progress, setProgress] = createSignal<number | null>(null);
  const [slider, setSlider] = createSignal<HTMLDivElement | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  // drag
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
      sendEvent({ type: Event.progress, progress: value });
      props.onProgressChange(value);
    }
  };

  const { filterId, Filter, onRegister } = useLiquidSurface(() => ({
    glassThickness: 80,
    bezelWidth: 15,
    refractiveIndex: 1.5,
    blur: 2,
    specularOpacity: 0.8,
  }));

  return (
    <>
      <Filter />
      <div
        ref={(el) => {
          onRegister(el);
          setSlider(el);
        }}
        classList={{
          [wrapperStyle]: true,
          [wrapperAnimationStyle.enter]: !!props.nowPlaying,
          [wrapperAnimationStyle.exit]: !props.nowPlaying,
        }}
        style={assignInlineVars({
          [glassFilter]: `url(#${filterId})`,
        })}
        onPointerDown={onMoveStart}
      >
        <div
          class={progressStyle}
          style={assignInlineVars({
            [progressVar]: `${progress() ?? props.progress}`,
            transition: isMoving() ? 'unset' : undefined,
          })}
        />
        <div class={containerStyle}>
          <button class={iconButtonStyle} onClick={props.onPrevious}>
            <SkipBack fill={'currentColor'} class={iconStyle} />
          </button>
          <button class={iconButtonStyle} onClick={props.onPlayPause}>
            <Show
              when={props.state === 'playing'}
              fallback={<Play fill={'currentColor'} class={iconStyle} />}
            >
              <Pause fill={'currentColor'} class={iconStyle} />
            </Show>
          </button>
          <button class={iconButtonStyle} onClick={props.onNext}>
            <SkipForward fill={'currentColor'} class={iconStyle} />
          </button>
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
        </div>
        <div class={centerContainerStyle}>
          <Show when={props.nowPlaying}>
            {(videoData) => (
              <>
                <div class={playerBarInfoStyle}>
                  <PlayInfo
                    rankingType={videoData().type}
                    ranking={videoData().ranking}
                    index={props.playlistIndex + 1}
                    title={videoData().video.title}
                    artist={videoData().video.owner.name}
                    album={videoData().video.thumbnail.url}
                  />
                </div>
                <button class={iconButtonStyle} onClick={props.onOpen}>
                  <ExternalLink class={iconStyle} />
                </button>
              </>
            )}
          </Show>
        </div>
        <div class={containerStyle}>
          <button class={iconButtonStyle} onClick={props.onFullscreen}>
            <Fullscreen class={iconStyle} />
          </button>
          <button
            data-active={props.mode === 'pip'}
            class={iconButtonStyle}
            onClick={props.onTogglePiP}
          >
            <PictureInPicture class={iconStyle} />
          </button>

          <button class={iconButtonStyle} onClick={props.onExpand}>
            <ChevronUp
              classList={{
                [iconStyle]: true,
                [iconExpandStyle]: props.mode === 'full',
              }}
            />
          </button>
          <button class={iconButtonStyle} onClick={props.onClose}>
            <X class={iconStyle} />
          </button>
        </div>
      </div>
    </>
  );
};
