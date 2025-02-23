import {
  fixedStyle,
  iframeStyle,
  itemStyle, pipScale,
  pipStyle,
  pipX,
  pipY,
  playlistAnimationStyle,
  playlistStyle,
  selectedItemStyle,
  videoAnimationStyle,
  videoStyle,
} from './PlayerPanel.css';
import { createEffect, createSignal, For, on, Show } from 'solid-js';
import {
  currentVideo,
  playlist,
  setPlaylist,
} from '@pages/content/store/playlist';
import { PlayInfo } from '@pages/content/src';
import { player } from '@pages/content/store/player';
import { assignInlineVars } from '@vanilla-extract/dynamic';

export const PlayerPanel = () => {
  const [iframe, setIframe] = createSignal<HTMLIFrameElement | null>(null);
  const [coord, setCoord] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(1);

  const elements: HTMLElement[] = [];

  const onDragStart = (event: PointerEvent) => {
    event.preventDefault();

    const rect = iframe()?.getBoundingClientRect();
    if (!rect) return;

    const rectX = rect.x - coord().x;
    const rectY = rect.y - coord().y;
    const offsetX = event.offsetX * scale()
    const offsetY = event.offsetY * scale();

    const edgeX = offsetX < 10 || offsetX > rect.width - 10;
    const edgeY = offsetY < 10 || offsetY > rect.height - 10;

    let onMove: (event: PointerEvent) => void;
    if (edgeX || edgeY) {
      onMove = (event: PointerEvent) => {
        const scaleX = (event.clientX - rect.x) / rect.width;
        const scaleY = (event.offsetY - rect.y) / rect.height;
        const scale = Math.min(Math.max(0.1, scaleX, scaleY), 2);
        requestAnimationFrame(() => {
          setScale(scale);
        });
      };


    } else { // drag mode
      onMove = (event: PointerEvent) => {
        const x = event.clientX - rectX - offsetX;
        const y = event.clientY - rectY - offsetY;

        requestAnimationFrame(() => {
          setCoord({ x, y });
        });
      };
    }

    const cleanUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanUp);
      window.removeEventListener('pointercancel', cleanUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', cleanUp, { once: true });
    window.addEventListener('pointercancel', cleanUp, { once: true });
  };

  createEffect(
    on(
      () => playlist.currentIndex,
      (index) => {
        elements[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    )
  );

  createEffect(
    on(
      () => player.mode !== 'pip',
      (isPiP) => {
        if (!isPiP) {
          setCoord({ x: 0, y: 0 });
          setScale(1)
        }
      }
    )
  );

  return (
    <div class={fixedStyle}>
      <Show when={currentVideo()}>
        {(video) => (
          <div
            ref={setIframe}
            classList={{
              [videoStyle]: true,
              [pipStyle]: player.mode === 'pip',
              [videoAnimationStyle.enter]: player.mode !== 'hidden',
              [videoAnimationStyle.exit]: player.mode === 'hidden',
            }}
            style={assignInlineVars({
              [pipX]: coord().x + 'px',
              [pipY]: coord().y + 'px',
              [pipScale]: `${(scale() * 100).toFixed(5)}%`
            })}
            onPointerDown={onDragStart}
          >
            <iframe
              id={'vcp-iframe'}
              src={`https://embed.nicovideo.jp/watch/${
                video().id
              }?persistence=1&oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1`}
              class={iframeStyle}
            />
          </div>
        )}
      </Show>
      <div
        classList={{
          [playlistStyle]: true,
          [playlistAnimationStyle.enter]: playlist.mode === 'full',
          [playlistAnimationStyle.exit]: playlist.mode === 'hidden',
        }}
      >
        <For each={playlist.playlist}>
          {(video, index) => (
            <div
              ref={(el) => (elements[index()] = el)}
              classList={{
                [itemStyle]: true,
                [selectedItemStyle]: playlist.currentIndex === index(),
              }}
              onClick={() => setPlaylist('currentIndex', index())}
            >
              <PlayInfo
                ranking={index() + 1}
                title={video.title}
                artist={video.owner.name}
                album={video.thumbnail.url}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
