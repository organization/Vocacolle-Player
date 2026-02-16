import { createReaction, createSignal, Show } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  ExternalLink,
  ListMusic,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-solid';

import { PlayInfo } from '@/ui/play-info';
import { useLiquidSurface } from '@/ui/glass';
import { IconButton } from '@/ui/button';
import { formatTime } from '@/utils';

import { VideoData } from '@/shared/types';

import {
  centerContainerStyle,
  containerStyle,
  glassFilter,
  playerBarInfoStyle,
  progressStyle,
  progressVar,
  timeStyle,
  wrapperStyle,
} from './player-bar.css';

export type PlayerBarProps = {
  nowPlaying: VideoData | null;
  progress: number;
  state: 'playing' | 'paused';
  playlistIndex: number;

  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onOpen: () => void;
  onPlaylist: () => void;
  onClose: () => void;
  onAlbumClick: () => void;
  onProgressChange: (progress: number) => void;
};
export const PlayerBar = (props: PlayerBarProps) => {
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
      props.onProgressChange(value);
    }
  };

  const { filterId, Filter, onRegister } = useLiquidSurface(() => ({
    glassThickness: 80,
    bezelWidth: 20,
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
        class={wrapperStyle}
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
                    onAlbumClick={props.onAlbumClick}
                  />
                </div>
                <IconButton icon={ExternalLink} onClick={props.onOpen} />
              </>
            )}
          </Show>
        </div>
        <div class={containerStyle}>
          <IconButton
            icon={ListMusic}
            onClick={props.onPlaylist}
          />
          <IconButton
            icon={X}
            onClick={props.onClose}
          />
        </div>
      </div>
    </>
  );
};
