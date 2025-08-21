import { createVar, fallbackVar, style, styleVariants } from '@vanilla-extract/css';
import { Colors } from '@pages/content/theme';

export const fixedStyle = style({
  position: 'fixed',
  top: 0,
  bottom: '4.2rem',
  left: '0.8rem',
  right: '0.8rem',

  padding: '0.8rem calc((100vw - 1200px - 1.6rem) / 2)',

  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  gap: '0.8rem',

  zIndex: 1000,
  pointerEvents: 'none',
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
    }
  }
});
export const iframeStyle = style({
  width: '100%',
  height: '100%',
});

export const playlistStyle = style({
  position: 'relative',

  width: '100%',
  maxWidth: '480px',
  height: '100%',

  backgroundColor: 'oklch(94% 0 0 / 0.2)',
  backdropFilter: 'blur(8px) saturate(3)',
  border: '2px solid oklch(94% 0 0 / 0.2)',
  boxShadow: '0 4px 12px oklch(0 0 0 / 0.35)',
  color: Colors.gray[50],

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.4rem',
  gap: '0',

  borderRadius: '0.8rem',
  pointerEvents: 'all',
  overflowY: 'auto',
  overflowX: 'hidden',
  animationFillMode: 'both',

  transformOrigin: 'bottom',

  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const playlistAnimationStyle = styleVariants({
  enter: {
    pointerEvents: 'all',
    height: '100%',
    opacity: 1,
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
  },
  exit: {
    pointerEvents: 'none',
    height: '0',
    opacity: 0,
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
  },
});

export const itemStyle = style({
  width: '100%',
  minHeight: 'fit-content',
  padding: '0.4rem',
  borderRadius: '0.4rem',
  cursor: 'pointer',

  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',

  ':hover': {
    boxShadow: '0 0 0 2px rgba(241, 106, 3, 0.25) inset',
  },
  ':active': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 30px rgba(241, 106, 3, 0.5) inset',
  },
});

export const selectedItemStyle = style({
  backgroundColor: 'oklch(14.5% 0 0 / 0.2)',
});
