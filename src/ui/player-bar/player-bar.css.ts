import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { Colors } from '@/theme';

export const wrapperStyle = style({
  position: 'relative',

  width: '100%',
  height: '3.6rem',

  border: '2px solid #252525',
  backgroundColor: '#fff',
  boxShadow: '0px 3px 0px 0px #252525',
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
    transition:
      'all 0.3s cubic-bezier(0.65, 0, 0.35, 1), scale 0.3s cubic-bezier(0.37, 0, 0.63, 1)',
    // animation: `${showAnimation} 0.3s cubic-bezier(0.65, 0, 0.35, 1)`,
  },
  exit: {
    pointerEvents: 'none',
    opacity: 0,
    transform: 'translateY(100%)',
    // scale: 0.75,
    transition:
      'all 0.3s cubic-bezier(0.65, 0, 0.35, 1), scale 0.3s cubic-bezier(0.37, 0, 0.63, 1)',
    // animation: `${hideAnimation} 0.3s cubic-bezier(0.65, 0, 0.35, 1)`,
  },
});

export const progressVar = createVar();
const baseProgressStyle = style({
  position: 'absolute',
  bottom: 0,
  left: 0,

  width: '100%',
  height: '100%',

  transformOrigin: '0% 50%',
  pointerEvents: 'none',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  overflow: 'hidden',
  borderRadius: '1.6rem',

  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,

    transform: `translateX(calc(-100% + ${progressVar} * 100%))`,
    transition: 'inherit',
  },
});

export const hoverProgressStyle = style([
  baseProgressStyle,
  {
    zIndex: '-2',

    '::before': {
      background: 'oklch(14.5% 0 0 / 0.2)',
    },
  },
]);
export const progressStyle = style([
  baseProgressStyle,
  {
    zIndex: 0,

    selectors: {
      '&::before': {
        background: `linear-gradient(
          135deg,
          rgba(140, 46, 255, 0.3) 0%,
          rgba(107, 58, 255, 0.3) 35%,
          rgba(99, 155, 173, 0.3) 60%,
          rgba(164, 231, 54, 0.3) 85%,
          rgba(189, 243, 35, 0.3) 100%
          )`,
      },
      '&[data-season="2026-winter"]::before': {
        background: `linear-gradient(
          135deg,
          rgba(22, 232, 248, 0.3) 0%,
          rgba(13, 181, 194, 0.3) 20%,
          rgba(5, 155, 167, 0.3) 30.7692%,
          rgba(218, 66, 86, 0.3) 65%,
          rgba(211, 32, 55, 0.6) 100%
          )`,
      },
      '&[data-season="2025-summer"]::before': {
        background: `linear-gradient(
          135deg,
          rgba(251, 119, 90, 0.3) 0%,
          rgba(241, 173, 41, 0.3) 33.5%,
          rgba(104, 183, 239, 0.3) 60.5%,
          rgba(0, 129, 223, 0.3) 87.5%
          )`,
      },
      '&[data-season="2025-winter"]::before': {
        background: `linear-gradient(
          180deg,
          rgba(241, 106, 3, 0.3) 0%,
          rgba(255, 181, 125, 0.3) 100%
          )`,
      },
      '&[data-season="2024-winter"]::before': {
        background: `linear-gradient(
          180deg,
          rgba(55, 79, 255, 0.3) 0%,
          rgba(126, 149, 255, 0.3) 40.1042%,
          rgba(255, 184, 179, 0.3) 100%
          )`,
      },
    },
  },
]);

export const containerStyle = style({
  display: 'flex',
  gap: '0.4rem',
  flexShrink: 0,
  zIndex: 1,
});

export const centerContainerStyle = style([
  containerStyle,
  {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'calc(100% - 400px - 32px)',
    transform: 'translate(-50%, -50%)',
    overflow: 'visible',
    pointerEvents: 'none',
    padding: '0 0.8rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
]);
export const playerBarInfoStyle = style({
  maxWidth: 'calc(100% - 40px)',
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
