import { createReaction, createSignal, Show } from 'solid-js';

import { PlayInfo } from '../PlayInfo';
import {
  currentVideo,
  playlist,
  setPlaylist,
} from '@pages/content/store/playlist';

import IconPrevious from '../../assets/icon_previous.svg';
import IconPlay from '../../assets/icon_play.svg';
import IconPause from '../../assets/icon_pause.svg';
import IconNext from '../../assets/icon_next.svg';
import IconOpen from '../../assets/icon_open.svg';
import IconFullscreen from '../../assets/icon_fullscreen.svg';
import IconPiP from '../../assets/icon_pip.svg';
import IconExpand from '../../assets/icon_expand.svg';
import IconClose from '../../assets/icon_close.svg';

import {
  centerContainerStyle,
  containerStyle,
  fixedStyle,
  iconButtonStyle,
  iconExpandStyle,
  iconStyle, playerBarInfoStyle,
  progressStyle,
  progressVar, timeStyle,
  wrapperAnimationStyle,
  wrapperStyle,
} from './PlayerBar.css';
import { player, setPlayer } from '@pages/content/store/player';
import { Portal } from 'solid-js/web';
import { PlayerPanel } from '@pages/content/src/PlayerPanel';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { usePlayer } from '@pages/content/src';
import { Event } from '@pages/content/event';
import { formatTime } from '../../utils';

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
    const video = currentVideo();
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

  return (
    <div class={fixedStyle}>
      <Portal>
        <PlayerPanel />
      </Portal>
      <div
        ref={setSlider}
        classList={{
          [wrapperStyle]: true,
          [wrapperAnimationStyle.enter]: currentVideo(),
          [wrapperAnimationStyle.exit]: !currentVideo(),
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
            <IconPrevious class={iconStyle} />
          </button>
          <button class={iconButtonStyle} onClick={onPlayPause}>
            <Show
              when={player.state === 'playing'}
              fallback={<IconPlay class={iconStyle} />}
            >
              <IconPause class={iconStyle} />
            </Show>
          </button>
          <button class={iconButtonStyle} onClick={onNext}>
            <IconNext class={iconStyle} />
          </button>
          <Show when={currentVideo()}>
            {(video) => (
              <>
                <div class={timeStyle}>{formatTime(video().duration * (progress() ?? player.progress))}</div>
                <div class={timeStyle}>/</div>
                <div class={timeStyle}>{formatTime(video().duration)}</div>
              </>
            )}
          </Show>
        </div>
        <div class={centerContainerStyle}>
          <Show when={currentVideo()}>
            {(video) => (
              <>
                <div class={playerBarInfoStyle}>
                  <PlayInfo
                    ranking={playlist.currentIndex + 1}
                    title={video().title}
                    artist={video().owner.name}
                    album={video().thumbnail.url}
                  />
                </div>
                <button class={iconButtonStyle} onClick={onOpen}>
                  <IconOpen class={iconStyle} />
                </button>
              </>
            )}
          </Show>
        </div>
        <div class={containerStyle}>
          <button class={iconButtonStyle} onClick={onFullscreen}>
            <IconFullscreen class={iconStyle} />
          </button>
          <button
            data-active={player.mode === 'pip'}
            class={iconButtonStyle}
            onClick={onTogglePiP}
          >
            <IconPiP class={iconStyle} />
          </button>

          <button class={iconButtonStyle} onClick={onExpand}>
            <IconExpand
              classList={{
                [iconStyle]: true,
                [iconExpandStyle]: playlist.mode === 'full',
              }}
            />
          </button>
          <button class={iconButtonStyle} onClick={onClose}>
            <IconClose class={iconStyle} />
          </button>
        </div>
      </div>
    </div>
  );
};
