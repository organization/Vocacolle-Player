import { createVar, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { Colors } from '@pages/content/theme';

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
export const wrapperStyle = style({
  position: 'relative',

  width: '100%',
  maxWidth: '1200px',
  height: '3.6rem',

  backgroundColor: 'rgba(25, 25, 25, 0.85)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
  color: Colors.gray[50],

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  borderRadius: '0.8rem',
  padding: '0 0.4rem',
  pointerEvents: 'all',
  animationFillMode: 'both',
});

const showAnimation = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(1rem)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  }
});
const hideAnimation = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(100%)',
  }
});
export const wrapperAnimationStyle = styleVariants({
  enter: {
    pointerEvents: 'all',
    animation: `${showAnimation} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  exit: {
    opacity: 0,
    pointerEvents: 'none',
    animation: `${hideAnimation} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

export const progressVar = createVar();
export const progressStyle = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  zIndex: '-1',

  width: '100%',
  height: '100%',

  transformOrigin: '0% 50%',
  pointerEvents: 'none',
  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  overflow: 'hidden',
  borderRadius: '0.8rem',

  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(241, 106, 3, 0.2) calc(100% - 3.2rem), rgba(241, 106, 3, 0.5) 100%)',
    transform: `translateX(calc(-100% + ${progressVar} * 100%))`,
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  }
});

export const containerStyle = style({
  display: 'flex',
  gap: '0.4rem',
});

export const centerContainerStyle = style([containerStyle, {
  position: 'absolute',
  left: '50%',
  top: '50%',

  transform: 'translate(-50%, -50%)',
}]);

export const iconButtonStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.4rem',

  fontSize: '0.8rem',

  color: Colors.gray[50],
  cursor: 'pointer',
  padding: '0.4rem',
  borderRadius: '0.4rem',
  transition: 'background-color 0.2s',

  ':hover': {
    backgroundColor: Colors.gray[800],
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'default',
    backgroundColor: 'transparent !important',
  }
});

export const iconStyle = style({
  width: '1.6rem',
  height: '1.6rem',
  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});

export const iconExpandStyle = style({
  transform: 'rotate(180deg)',
});
