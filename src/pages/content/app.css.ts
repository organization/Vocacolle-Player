import { style, styleVariants } from '@vanilla-extract/css';

export const fixedStyle = style({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,

  padding: '0.8rem',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  zIndex: 1000,
  pointerEvents: 'none',
});
export const playerBarWrapperStyle = style({
  width: '100%',
  maxWidth: '960px',

  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});
export const playerBarWrapperAnimationStyle = styleVariants({
  enter: {
    pointerEvents: 'all',
    opacity: 1,
    transform: 'translateY(0)',
  },
  exit: {
    pointerEvents: 'none',
    opacity: 0,
    transform: 'translateY(100%)',
  },
});

export const sidebarStyle = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,

  width: '20rem',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',

  zIndex: 1000,
  pointerEvents: 'none',
});
export const sidebarTitleStyle = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
});

export const sidebarAnimationStyle = styleVariants({
  show: {
    transform: 'translateX(0)',
    transition: 'transform 0.3s ease-in-out',
  },
  hide: {
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
  },
});

export const videoContainerStyle = style({
  position: 'absolute',
  bottom: 0,
  left: 0,

  width: '50vw',
  padding: '0.8rem',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  zIndex: 1000,
  pointerEvents: 'none',
});
export const videoWrapperAnimationStyle = styleVariants({
  enter: {
    opacity: 1,
    transform: 'scale(1)',
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
  },
  exit: {
    opacity: 0,
    transform: 'scale(0.2)',
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
  },
});