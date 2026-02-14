import { createVar, fallbackVar, style, styleVariants } from '@vanilla-extract/css';

import { Colors } from '@/theme';

export const iframeStyle = style({
  width: '100%',
  height: '100%',
});

export const videoAnimationStyle = styleVariants({
  enter: {
    pointerEvents: 'all',
    opacity: 1,
    transform: 'scale(1)',
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
  },
  exit: {
    pointerEvents: 'none',
    opacity: 0,
    transform: 'scale(0.2)',
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
  },
});
export const videoStyle = style({
  position: 'relative',

  width: 'calc(100% - 480px - 0.8rem)',
  aspectRatio: '16 / 9',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
  color: Colors.gray[50],

  borderRadius: '0.8rem',
  pointerEvents: 'all',
  overflow: 'hidden',
  animationFillMode: 'both',

  transformOrigin: '0% 100%',
  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
});

export const pipX = createVar();
export const pipY = createVar();
export const pipScale = createVar();
export const pipStyle = style({
  transform: `translate(${fallbackVar(pipX, '0')}, ${fallbackVar(pipY, '0')}) scale(${fallbackVar(pipScale, '100%')})`,
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 10,

      zIndex: 101,
      cursor: 'all-scroll',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,

      zIndex: 100,
      backgroundColor: 'oklch(94% 0 0 / 0.2)',
      backdropFilter: 'blur(2px)',
      opacity: 0,
      cursor: 'ne-resize',

      transition: 'opacity 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
    },
    '&:hover::after': {
      opacity: 1,
    },
  },
});
