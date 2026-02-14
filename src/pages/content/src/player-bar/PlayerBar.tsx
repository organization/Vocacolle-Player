import { createReaction, createSignal, Show } from 'solid-js';

import { PlayInfo } from '../play-info';
import { playlist, setPlaylist } from '@pages/content/store/playlist';

import {
  centerContainerStyle,
  containerStyle,
  fixedStyle,
  iconButtonStyle,
  iconExpandStyle,
  iconStyle,
  playerBarInfoStyle,
  progressStyle,
  progressVar,
  timeStyle,
  wrapperAnimationStyle,
  wrapperStyle,
} from './PlayerBar.css';
import { player, setPlayer } from '@pages/content/store/player';
import { Portal } from 'solid-js/web';
import { PlayerPanel } from '@src/pages/content/src/player-panel';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { usePlayer } from '@pages/content/src';
import { Event } from '@pages/content/event';
import { formatTime } from '../../utils';
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
import { LiquidGlass, useLiquidSurface } from '../glass';

export const PlayerBar = () => {
  const { sendEvent } = usePlayer();

  const [isMoving, setIsMoving] = createSignal(false);
  const [progress, setProgress] = createSignal<number | null>(null);
  const [slider, setSlider] = createSignal<HTMLDivElement | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  const onPrevious = () => {
    setPlaylist('currentIndex', (prev) => Math.max(0, prev - 1));
  };
  const onPlayPause = () => {
    setPlayer('state', player.state === 'playing' ? 'paused' : 'playing');
  };
  const onNext = () => {
    setPlaylist('currentIndex', (prev) =>
      Math.min(prev + 1, playlist.playlist.length - 1)
    );
  };

  const onOpen = () => {
    const video = playlist.currentVideo;
    if (!video) return;

    window.open(`https://www.nicovideo.jp/watch/${video.id}`);
  };

  const onFullscreen = () => {
    const iframe = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
    iframe?.requestFullscreen();
  };
  const onTogglePiP = () => {
    const isPiP = player.mode === 'pip';
    if (!isPiP) {
      setPlayer('mode', 'pip');
    } else {
      if (playlist.mode === 'full') setPlayer('mode', 'full');
      else setPlayer('mode', 'hidden');
    }
  };
  const onExpand = () => {
    const isHidden = playlist.mode === 'hidden';

    if (isHidden) {
      setPlaylist('mode', 'full');
      if (player.mode !== 'pip') setPlayer('mode', 'full');
    } else {
      setPlaylist('mode', 'hidden');
      if (player.mode !== 'pip') setPlayer('mode', 'hidden');
    }
  };
  const onClose = () => {
    setPlayer('mode', 'hidden');
    setPlaylist('mode', 'hidden');

    setTimeout(() => {
      setPlayer((prev) => ({
        ...prev,
        state: 'paused',
        mode: 'hidden',
        progress: 0,
      }));
      setPlaylist({
        currentIndex: 0,
        playlist: [],
        mode: 'hidden',
      });
    }, 300);
  };

  // drag
  const maxWidth = () => (rect()?.width ?? 16) - 16;

  const onMoveStart = (event: PointerEvent) => {
    const element = slider();
    if (!element) return;

    const last = event.composedPath()[0];
    if (!(last instanceof HTMLElement)) return;
    if (element !== last) return;

    setIsMoving(true);
    setProgress(player.progress);
    setRect(element.getBoundingClientRect());
    onMove(event);

    const onEnd = (event: PointerEvent) => {
      onMove(event, true);

      const track = createReaction(() => player.progress);
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
      setPlayer('progress', value);
    }
  };

  const { filterStyles, Filter, onRegister } = useLiquidSurface(() => ({
    glassThickness: 80,
    bezelWidth: 15,
    refractiveIndex: 1.5,
    blur: 2,
    specularOpacity: 0.8,
  }));

  return (
    <div class={fixedStyle}>
      <Portal>
        <PlayerPanel />
      </Portal>
      <Filter />
      <div
        style={filterStyles}
        ref={(el) => {
          onRegister(el);
          setSlider(el);
        }}
        classList={{
          [wrapperStyle]: true,
          [wrapperAnimationStyle.enter]: !!playlist.currentVideo,
          [wrapperAnimationStyle.exit]: !playlist.currentVideo,
        }}
        onPointerDown={onMoveStart}
      >
        <div
          class={progressStyle}
          style={assignInlineVars({
            [progressVar]: `${progress() ?? player.progress}`,
            transition: isMoving() ? 'unset' : undefined,
          })}
        />
        <div class={containerStyle}>
          <button class={iconButtonStyle} onClick={onPrevious}>
            <SkipBack fill={'currentColor'} class={iconStyle} />
          </button>
          <button class={iconButtonStyle} onClick={onPlayPause}>
            <Show
              when={player.state === 'playing'}
              fallback={<Play fill={'currentColor'} class={iconStyle} />}
            >
              <Pause fill={'currentColor'} class={iconStyle} />
            </Show>
          </button>
          <button class={iconButtonStyle} onClick={onNext}>
            <SkipForward fill={'currentColor'} class={iconStyle} />
          </button>
          <Show when={playlist.currentVideo}>
            {(video) => (
              <>
                <div class={timeStyle}>
                  {formatTime(
                    video().duration * (progress() ?? player.progress)
                  )}
                </div>
                <div class={timeStyle}>/</div>
                <div class={timeStyle}>{formatTime(video().duration)}</div>
              </>
            )}
          </Show>
        </div>
        <div class={centerContainerStyle}>
          <Show when={playlist.current}>
            {(videoData) => (
              <>
                <div class={playerBarInfoStyle}>
                  <PlayInfo
                    rankingType={videoData().type}
                    ranking={videoData().ranking}
                    index={playlist.currentIndex + 1}
                    title={videoData().video.title}
                    artist={videoData().video.owner.name}
                    album={videoData().video.thumbnail.url}
                  />
                </div>
                <button class={iconButtonStyle} onClick={onOpen}>
                  <ExternalLink class={iconStyle} />
                </button>
              </>
            )}
          </Show>
        </div>
        <div class={containerStyle}>
          <button class={iconButtonStyle} onClick={onFullscreen}>
            <Fullscreen class={iconStyle} />
          </button>
          <button
            data-active={player.mode === 'pip'}
            class={iconButtonStyle}
            onClick={onTogglePiP}
          >
            <PictureInPicture class={iconStyle} />
          </button>

          <button class={iconButtonStyle} onClick={onExpand}>
            <ChevronUp
              classList={{
                [iconStyle]: true,
                [iconExpandStyle]: playlist.mode === 'full',
              }}
            />
          </button>
          <button class={iconButtonStyle} onClick={onClose}>
            <X class={iconStyle} />
          </button>
        </div>
      </div>
    </div>
  );
};
