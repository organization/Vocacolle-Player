import { createEffect, createSignal, on, onCleanup } from 'solid-js';
import { iframeStyle, pipScale, pipStyle, pipX, pipY, videoAnimationStyle, videoStyle } from './player.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

export type PlayerProps = {
  videoId: string;
  mode: 'full' | 'pip' | 'hidden';
};
export const Player = (props: PlayerProps) => {
  const [iframe, setIframe] = createSignal<HTMLIFrameElement | null>(null);
  const [coord, setCoord] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(1);
  const [isMovingMode, setIsMovingMode] = createSignal(false);

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
      () => props.mode === 'pip',
      (isPiP) => {
        if (!isPiP) {
          setCoord({ x: 0, y: 0 });
          setScale(1);
        } else {
          const rect = iframe()?.getBoundingClientRect();
          if (!rect) return;

          const offset = props.mode === 'full' ? 1 : 5;
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

  return (
    <div
      ref={setIframe}
      classList={{
        [videoStyle]: true,
        [pipStyle]: props.mode === 'pip',
        [videoAnimationStyle.enter]: props.mode !== 'hidden',
        [videoAnimationStyle.exit]: props.mode === 'hidden',
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
        src={`https://embed.nicovideo.jp/watch/${props.videoId}?persistence=1&oldScript=1&referer=&from=0`}
        class={iframeStyle}
      />
    </div>
  );
};
