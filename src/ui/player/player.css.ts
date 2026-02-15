import { createVar, fallbackVar, style } from '@vanilla-extract/css';

import { Colors } from '@/theme';

export const iframeStyle = style({
  width: '100%',
  height: '100%',
});

export const videoStyle = style({
  position: 'relative',

  width: '100%',
  aspectRatio: '16 / 9',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
  color: Colors.gray[50],

  borderRadius: '0.8rem',
  pointerEvents: 'all',
  overflow: 'hidden',
  animationFillMode: 'both',

  transformOrigin: '0% 100%',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
      backgroundColor: 'oklch(14% 0 0 / 0.4)',
      backdropFilter: 'blur(4px)',
      opacity: 0,

      transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    '&[data-edge="ne"]::after': {
      cursor: 'ne-resize',
    },
    '&[data-edge="nw"]::after': {
      cursor: 'nw-resize',
    },
    '&[data-edge="se"]::after': {
      cursor: 'se-resize',
    },
    '&[data-edge="sw"]::after': {
      cursor: 'sw-resize',
    },
    '&:hover::after': {
      opacity: 1,
    },
  },
});

export const iconStyle = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',

  zIndex: 102,
  color: 'oklch(94% 0 0 / 1)',
  opacity: 0,
  transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
});
export const moveIconStyle = style({
  selectors: {
    [`${pipStyle}:hover:not(${pipStyle}[data-edge]) &`]: {
      opacity: 1,
    },
  },
});
export const scalingIconStyle = style({
  selectors: {
    [`${pipStyle}:hover[data-edge] &`]: {
      opacity: 1,
    },
  },
});
