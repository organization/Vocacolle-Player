import { Colors } from '@/theme';
import { keyframes, style, styleVariants } from '@vanilla-extract/css';

export const backdropStyle = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'oklch(14.5% 0 0 / 0.4)',
  zIndex: 5000,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1.6rem',
});

const backdropEnterAnimation = keyframes({
  from: {
    opacity: '0',
  },
});
const backdropExitAnimation = keyframes({
  to: {
    opacity: '0',
  },
});
export const backdropAnimation = styleVariants({
  enter: {
    animation: `${backdropEnterAnimation} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
    pointerEvents: 'auto',
  },
  exit: {
    animation: `${backdropExitAnimation} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
    pointerEvents: 'none',
  },
});

export const wrapperStyle = style({
  width: '30rem',

  border: '2px solid #252525',
  backgroundColor: '#fff',
  boxShadow: '0px 3px 0px 0px #252525',

  padding: '1.2rem',
  borderRadius: '2.0rem',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: '0.8rem',
});

const wrapperEnterAnimation = keyframes({
  from: {
    transform: 'translateY(0.8rem)',
  },
});
const wrapperExitAnimation = keyframes({
  to: {
    opacity: '0',
    transform: 'scale(0.9)',
  },
});
export const wrapperAnimation = styleVariants({
  enter: {
    animation: `${wrapperEnterAnimation} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
    pointerEvents: 'auto',
  },
  exit: {
    animation: `${wrapperExitAnimation} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
    pointerEvents: 'none',
  },
});

export const titleStyle = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: Colors.gray[900],
});

export const descriptionStyle = style({
  fontSize: '1rem',
  color: Colors.gray[700],
});

export const actionContainerStyle = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.8rem',
});

const baseActionStyle = style({
  padding: '0.6rem 1.2rem',
  borderRadius: '1.6rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  flex: 1,
});
export const actionStyle = styleVariants({
  default: [
    baseActionStyle,
    {
      backgroundColor: 'oklch(14.5% 0 0 / 0.1)',
      color: Colors.gray[900],
    },
  ],
  primary: [
    baseActionStyle,
    {
      backgroundColor: 'oklch(50% 0.4 0.5 / 0.7)',
      color: Colors.gray[50],
    },
  ],
});
