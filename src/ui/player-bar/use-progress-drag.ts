import { createSignal, onCleanup } from 'solid-js';

type ProgressDragOptions = {
  initProgress?: number;
  onProgressChange?: (progress: number) => void;
};
type ProgressDragResult = {
  isMoving: () => boolean;
  isHovering: () => boolean;
  movingProgress: () => number | null;
  hoverProgress: () => number | null;
  props: {
    onPointerDown: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
    ref: (element: HTMLDivElement | null) => void;
  };
};
export const useProgressDrag = (options: ProgressDragOptions): ProgressDragResult => {
  const [isMoving, setIsMoving] = createSignal(false);
  const [progress, setProgress] = createSignal<number | null>(null);
  const [hoverProgress, setHoverProgress] = createSignal<number | null>(null);
  const [slider, setSlider] = createSignal<HTMLDivElement | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  let windowPointerMove: ((event: PointerEvent) => void) | null = null;
  let windowPointerUp: ((event: PointerEvent) => void) | null = null;
  let windowPointerCancel: ((event: PointerEvent) => void) | null = null;

  const maxWidth = () => (rect()?.width ?? 16) - 16;
  const getProgressValue = (event: PointerEvent) => {
    const max = Math.max(1, maxWidth());
    const now = Math.min(Math.max(0, event.pageX - (rect()?.left ?? 0)), max);
    return now / max;
  };

  const onMove = (event: PointerEvent, isEnd = false) => {
    const value = getProgressValue(event);
    if (value == null) return;

    requestAnimationFrame(() => {
      setIsMoving(true);
      setProgress(value);
    });

    if (isEnd) {
      options.onProgressChange?.(value);
    }
  };
  const clearListeners = () => {
    if (windowPointerMove) {
      window.removeEventListener('pointermove', windowPointerMove);
      windowPointerMove = null;
    }
    if (windowPointerUp) {
      window.removeEventListener('pointerup', windowPointerUp);
      windowPointerUp = null;
    }
    if (windowPointerCancel) {
      window.removeEventListener('pointercancel', windowPointerCancel);
      windowPointerCancel = null;
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    const element = slider();
    if (!element) return;

    const last = event.composedPath()[0];
    if (!(last instanceof HTMLElement)) return;
    if (element !== last) return;

    setIsMoving(true);
    setHoverProgress(null);
    setProgress(options?.initProgress ?? null);
    setRect(element.getBoundingClientRect());
    onMove(event);

    windowPointerMove = (moveEvent: PointerEvent) => onMove(moveEvent);
    windowPointerUp = (upEvent: PointerEvent) => {
      onMove(upEvent, true);

      requestAnimationFrame(() => {
        setIsMoving(false);
        setProgress(null);
      });

      clearListeners();
    };
    windowPointerCancel = (cancelEvent: PointerEvent) => {
      onMove(cancelEvent);

      setIsMoving(false);
      setProgress(null);
      clearListeners();
    };

    window.addEventListener('pointermove', windowPointerMove);
    window.addEventListener('pointerup', windowPointerUp);
    window.addEventListener('pointercancel', windowPointerCancel);
  };
  onCleanup(() => {
    clearListeners();
  });

  const onPointerMove = (event: PointerEvent) => {
    if (isMoving()) return;

    const value = getProgressValue(event);
    if (value == null) return;

    setHoverProgress(value);
  };
  const onPointerEnter = (event: PointerEvent) => {
    const element = slider();
    if (!element) return;
    setRect(element.getBoundingClientRect());
    onPointerMove(event);
  };
  const onPointerLeave = (_event: PointerEvent) => {
    setHoverProgress(null);
  };

  return {
    isMoving,
    isHovering: () => hoverProgress() != null,
    hoverProgress,
    movingProgress: () => progress(),
    props: {
      onPointerDown,
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      ref: setSlider,
    },
  };
};
