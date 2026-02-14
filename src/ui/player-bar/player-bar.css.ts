import {
  createVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { Colors } from '@/theme';

export const glassFilter = createVar();
export const wrapperStyle = style({
  position: 'relative',

  width: '100%',
  maxWidth: '1200px',
  height: '3.6rem',

  backgroundColor: 'oklch(94% 0 0 / 0.6)',
  backdropFilter: `${glassFilter} saturate(5) brightness(0.98)`,
  boxShadow: '0 4px 12px oklch(0% 0 0 / 0.35)',
  color: Colors.gray[900],

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  borderRadius: '1.8rem',
  padding: '0 12px',
  pointerEvents: 'all',
  animationFillMode: 'both',
});

export const wrapperAnimationStyle = styleVariants({
  enter: {
    pointerEvents: 'all',
    opacity: 1,
    transform: 'translateY(0)',
    scale: 1,
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1), scale 0.3s cubic-bezier(0.37, 0, 0.63, 1)',
    // animation: `${showAnimation} 0.3s cubic-bezier(0.65, 0, 0.35, 1)`,
  },
  exit: {
    pointerEvents: 'none',
    opacity: 0,
    transform: 'translateY(100%)',
    // scale: 0.75,
    transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1), scale 0.3s cubic-bezier(0.37, 0, 0.63, 1)',
    // animation: `${hideAnimation} 0.3s cubic-bezier(0.65, 0, 0.35, 1)`,
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
  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
  overflow: 'hidden',
  borderRadius: '11px',

  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(to right, rgba(241, 106, 3, 0.3) calc(100% - 3.2rem), rgba(241, 106, 3, 0.6) 100%)',
    transform: `translateX(calc(-100% + ${progressVar} * 100%))`,
    transition: 'inherit',
  },
});

export const containerStyle = style({
  display: 'flex',
  gap: '0.4rem',
  flexShrink: 0,
});

export const centerContainerStyle = style([
  containerStyle,
  {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'calc(100% - 400px - 32px)',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    pointerEvents: 'none',
    padding: '0 0.8rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
]);
export const playerBarInfoStyle = style({
  maxWidth: 'calc(100% - 40px)',
});

export const iconButtonStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',

  fontSize: '16px',

  color: 'oklch(14.5% 0 0 / 1)',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '6px',
  pointerEvents: 'auto',
  flexShrink: 0,
  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',

  selectors: {
    '&:hover': {
      backgroundColor: 'oklch(14.5% 0 0 / 0.2)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'default',
      backgroundColor: 'transparent !important',
    },
    '&:active': {
      transform: 'scale(0.9)',
    },
    '&[data-active="true"]': {
      backgroundColor: 'rgba(241, 106, 3, 0.1)',
      color: 'rgba(241, 106, 3, 1)'
    },
    '&[data-active="true"]:hover': {
      backgroundColor: 'rgba(241, 106, 3, 0.2)',
    }
  }
});

export const iconStyle = style({
  width: '16px',
  height: '16px',
  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
});

export const iconExpandStyle = style({
  transform: 'rotate(180deg)',
});

export const timeStyle = style({
  fontSize: '0.8rem',
  fontWeight: 'normal',
  color: 'oklch(14.5% 0 0 / 0.4)',
  userSelect: 'none',

  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
});
