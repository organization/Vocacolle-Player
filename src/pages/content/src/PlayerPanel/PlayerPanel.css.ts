import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { Colors } from '@pages/content/theme';

export const fixedStyle = style({
  position: 'fixed',
  top: 0,
  bottom: '4.2rem',
  left: 0,
  right: 0,

  padding: '0.8rem calc((100vw - 1200px) / 2)',

  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  gap: '0.8rem',

  zIndex: 1000,
  pointerEvents: 'none',
});

const videoShow = keyframes({
  from: {
    opacity: 0,
    scale: 0.2,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
});
const videoHide = keyframes({
  from: {
    opacity: 1,
    scale: 1,
  },
  to: {
    opacity: 0,
    scale: 0.2,
  },
});

export const videoAnimationStyle = styleVariants({
  enter: {
    pointerEvents: 'all',
    animation: `${videoShow} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  exit: {
    opacity: 0,
    pointerEvents: 'none',
    animation: `${videoHide} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});
export const videoStyle = style({
  position: 'relative',

  width: 'calc(100% - 480px - 0.8rem)',
  aspectRatio: '16 / 9',

  backgroundColor: 'rgba(25, 25, 25, 0.85)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
  color: Colors.gray[50],

  borderRadius: '0.8rem',
  pointerEvents: 'all',
  overflow: 'hidden',
  animationFillMode: 'both',

  transformOrigin: '0% 100%',
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

  backgroundColor: 'rgba(25, 25, 25, 0.85)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
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
});

const playlistShow = keyframes({
  from: {
    opacity: 0,
    height: '0',
  },
  to: {
    opacity: 1,
    height: '100%',
  },
});
const playlistHide = keyframes({
  from: {
    opacity: 1,
    height: '100%',
  },
  to: {
    opacity: 0,
    height: '0',
  },
});
export const playlistAnimationStyle = styleVariants({
  enter: {
    pointerEvents: 'all',
    animation: `${playlistShow} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  exit: {
    opacity: 0,
    pointerEvents: 'none',
    animation: `${playlistHide} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

export const itemStyle = style({
  width: '100%',
  padding: '0.4rem',
  borderRadius: '0.4rem',
  cursor: 'pointer',

  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',

  ':hover': {
    boxShadow: '0 0 0 4px rgba(241, 106, 3, 0.25) inset',
  },
  ':active': {
    transform: 'scale(0.98)',
    boxShadow: '0 0 0 30px rgba(241, 106, 3, 0.5) inset',
  },
});

export const selectedItemStyle = style({
  backgroundColor: Colors.gray[900],
});
