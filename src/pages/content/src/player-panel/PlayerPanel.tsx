import {
  fixedStyle,
  headerStyle,
  iconButtonStyle,
  iconStyle,
  iframeStyle,
  infoStyle,
  itemStyle,
  pipScale,
  pipStyle,
  pipX,
  pipY,
  playlistAnimationStyle, playlistContainerStyle,
  playlistStyle,
  selectedItemStyle,
  videoAnimationStyle,
  videoStyle,
} from './PlayerPanel.css';
import {
  batch,
  createEffect,
  createSignal,
  For,
  on,
  onCleanup,
  Show,
} from 'solid-js';
import { playlist, setPlaylist } from '@pages/content/store/playlist';
import { PlayInfo } from '@pages/content/src';
import { player } from '@pages/content/store/player';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { ListX, Trash } from 'lucide-solid';
import { LiquidGlass, useLiquidSurface } from '../glass';

export const PlayerPanel = () => {
  const [iframe, setIframe] = createSignal<HTMLIFrameElement | null>(null);
  const [coord, setCoord] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(1);
  const [isMovingMode, setIsMovingMode] = createSignal(false);

  const elements: HTMLElement[] = [];

  const onDragStart = (event: PointerEvent) => {
    event.preventDefault();

    const rect = iframe()?.getBoundingClientRect();
    if (!rect) return;

    const rectX = rect.x - coord().x;
    const rectY = rect.y - coord().y;
    const offsetX = event.offsetX * scale();
    const offsetY = event.offsetY * scale();

    const edgeX = offsetX < 10 || offsetX > rect.width - 10;
    const edgeY = offsetY < 10 || offsetY > rect.height - 10;

    let onMove: (event: PointerEvent) => void;
    if (edgeX || edgeY) {
      const nowScale = scale();
      onMove = (event: PointerEvent) => {
        const scaleX = ((event.clientX - rect.x) / rect.width) * nowScale;
        const scaleY = ((event.offsetY - rect.y) / rect.height) * nowScale;
        const newScale = Math.min(Math.max(0.1, scaleX, scaleY), 2);
        setIsMovingMode(true);

        requestAnimationFrame(() => {
          setScale(newScale);
        });
      };
    } else {
      // drag mode
      onMove = (event: PointerEvent) => {
        const x = event.clientX - rectX - offsetX;
        const y = event.clientY - rectY - offsetY;
        setIsMovingMode(true);

        requestAnimationFrame(() => {
          setCoord({ x, y });
        });
      };
    }

    const cleanUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanUp);
      window.removeEventListener('pointercancel', cleanUp);

      setIsMovingMode(false);
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
      () => player.mode === 'pip',
      (isPiP) => {
        if (!isPiP) {
          setCoord({ x: 0, y: 0 });
          setScale(1);
        } else {
          const rect = iframe()?.getBoundingClientRect();
          if (!rect) return;

          const offset = playlist.mode === 'full' ? 1 : 5;
          setCoord({
            x: -rect.x + 16,
            y: -rect.y + rect.height * (offset - 1) + 16,
          });

          const timeout = setTimeout(() => {
            const rect = iframe()?.getBoundingClientRect();
            if (!rect) return;
            setScale(0.5);
            setCoord({
              x: coord().x,
              y: coord().y - rect.height / 2,
            });
          }, 300);

          onCleanup(() => {
            clearTimeout(timeout);
          });
        }
      }
    )
  );

  const { filterStyles, Filter, onRegister } = useLiquidSurface(() => ({
    glassThickness: 80,
    bezelWidth: 15,
    refractiveIndex: 1.5,
    blur: 2,
    specularOpacity: 0.8,
  }));

  return (
    <div class={fixedStyle}>
      <Show when={playlist.currentVideo}>
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
              [pipScale]: `${(scale() * 100).toFixed(5)}%`,
              transition: isMovingMode() ? 'unset' : undefined,
            })}
            onPointerDown={onDragStart}
          >
            <iframe
              id={'vcp-iframe'}
              allowfullscreen
              allow={'autoplay; fullscreen'}
              referrerPolicy={'no-referrer'}
              src={`https://embed.nicovideo.jp/watch/${video().id
                }?persistence=1&oldScript=1&referer=&from=0`}
              class={iframeStyle}
            />
          </div>
        )}
      </Show>
      <Filter />
      <div
        ref={onRegister}
        classList={{
          [playlistStyle]: true,
          [playlistAnimationStyle.enter]: playlist.mode === 'full',
          [playlistAnimationStyle.exit]: playlist.mode === 'hidden',
        }}
        style={filterStyles}
      >
        <div class={headerStyle}>
          <div>
            재생목록 ({playlist.currentIndex + 1} / {playlist.playlist.length})
          </div>
          <button
            class={iconButtonStyle}
            onClick={() => {
              setPlaylist({
                playlist: [],
                currentIndex: 0,
                mode: 'hidden',
              });
            }}
          >
            <ListX class={iconStyle} />
          </button>
        </div>
        <div class={playlistContainerStyle}>
          <For each={playlist.playlist}>
            {({ video, type, ranking }, index) => (
              <div
                ref={(el) => (elements[index()] = el)}
                classList={{
                  [itemStyle]: true,
                  [selectedItemStyle]: playlist.currentIndex === index(),
                }}
                onClick={() => setPlaylist('currentIndex', index())}
              >
                <PlayInfo
                  index={index() + 1}
                  ranking={ranking}
                  rankingType={type}
                  title={video.title}
                  artist={video.owner.name}
                  album={video.thumbnail.url}
                  class={infoStyle}
                />
                <button
                  class={iconButtonStyle}
                  onClick={() => {
                    batch(() => {
                      setPlaylist('playlist', (list) =>
                        list.filter((_, i) => i !== index())
                      );
                      if (playlist.currentIndex >= index()) {
                        setPlaylist('currentIndex', (i) => Math.max(0, i - 1));
                      }
                      if (playlist.playlist.length === 0) {
                        setPlaylist('mode', 'hidden');
                      }
                    });
                  }}
                >
                  <Trash class={iconStyle} />
                </button>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
