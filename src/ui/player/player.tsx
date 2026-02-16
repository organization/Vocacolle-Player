import { createSignal, Show } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Move, Scaling } from 'lucide-solid';

import { iconStyle, iframeStyle, moveIconStyle, pipScale, pipStyle, pipX, pipY, scalingIconStyle, videoStyle } from './player.css';
import { cx } from '@/utils';

const BEZEL_WIDTH = 16;

export type PlayerProps = {
  videoId?: string;
  pip?: boolean;
};
export const Player = (props: PlayerProps) => {
  const [iframe, setIframe] = createSignal<HTMLIFrameElement | null>(null);
  const [coord, setCoord] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(300 / document.body.clientWidth * 2);
  const [isMovingMode, setIsMovingMode] = createSignal(false);
  const [edge, setEdge] = createSignal<'ne' | 'nw' | 'se' | 'sw' | null>(null);

  const onEdgeCheck = (event: PointerEvent) => {
    if (!props.pip) return;
    if (!iframe()) return;
    const rect = iframe()!.getBoundingClientRect();
    const offsetX = event.clientX - rect.x;
    const offsetY = event.clientY - rect.y;

    const edgeX = offsetX < BEZEL_WIDTH || offsetX > rect.width - BEZEL_WIDTH;
    const edgeY = offsetY < BEZEL_WIDTH || offsetY > rect.height - BEZEL_WIDTH;
    if (!edgeX && !edgeY) {
      setEdge(null);
      return;
    }

    if (offsetX < rect.width / 2 && offsetY < rect.height / 2) setEdge('nw');
    if (offsetX >= rect.width / 2 && offsetY < rect.height / 2) setEdge('ne');
    if (offsetX < rect.width / 2 && offsetY >= rect.height / 2) setEdge('sw');
    if (offsetX >= rect.width / 2 && offsetY >= rect.height / 2) setEdge('se');
  };

  const onDragStart = (event: PointerEvent) => {
    event.preventDefault();
    if (!props.pip) return;

    const rect = iframe()?.getBoundingClientRect();
    if (!rect) return;
    const startCoord = coord();

    const rectX = rect.x - startCoord.x;
    const rectY = rect.y - startCoord.y;
    const offsetX = event.offsetX * scale();
    const offsetY = event.offsetY * scale();

    const edgeX = offsetX < BEZEL_WIDTH || offsetX > rect.width - BEZEL_WIDTH;
    const edgeY = offsetY < BEZEL_WIDTH || offsetY > rect.height - BEZEL_WIDTH;

    let onMove: (event: PointerEvent) => void;
    if (edgeX || edgeY) {
      const nowScale = scale();
      const isTop = offsetY < BEZEL_WIDTH;
      const isLeft = offsetX < BEZEL_WIDTH;

      onMove = (event: PointerEvent) => {
        const width = isLeft ? rect.right - event.clientX : event.clientX - rect.left;
        const height = isTop ? rect.bottom - event.clientY : event.clientY - rect.top;
        const scaleX = (width / rect.width) * nowScale;
        const scaleY = (height / rect.height) * nowScale;
        const newScale = Math.min(Math.max(0.1, scaleX, scaleY), 2);
        setIsMovingMode(true);

        const scaleRatio = newScale / nowScale;
        const newXOffset = isLeft ? rect.width * (scaleRatio - 1) : 0;
        const newYOffset = isTop ? 0 : rect.height * (1 - scaleRatio);

        requestAnimationFrame(() => {
          setScale(newScale);
          setCoord({
            x: startCoord.x - newXOffset,
            y: startCoord.y - newYOffset,
          });
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

  return (
    <div
      ref={setIframe}
      data-edge={edge()}
      classList={{
        [videoStyle]: true,
        [pipStyle]: props.pip,
      }}
      style={assignInlineVars({
        [pipX]: coord().x + 'px',
        [pipY]: coord().y + 'px',
        [pipScale]: `${(scale() * 100).toFixed(5)}%`,
        transition: isMovingMode() ? 'unset' : undefined,
      })}
      onPointerMove={onEdgeCheck}
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
      <Show when={props.pip}>
        <Move class={cx(iconStyle, moveIconStyle)} width={'25%'} height={'25%'} />
        <Scaling class={cx(iconStyle, scalingIconStyle)} width={'25%'} height={'25%'} />
      </Show>
    </div>
  );
};
