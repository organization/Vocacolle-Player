import { createVar, keyframes, style, styleVariants } from '@vanilla-extract/css';

export const containerStyle = style({
  position: 'fixed',
  inset: 0,

  width: '100vw',
  height: '100vh',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',

  padding: '3.2rem',

  background: 'oklch(94.5% 0 0 / 1)',
  zIndex: 10000,
  pointerEvents: 'all',
});

export const count = createVar();
const effectAnimation = keyframes({
  from: {
    transform: `translateX(2.5%) scale(1.1)`,
  },
  to: {
    transform: `translateX(-2.5%) scale(1.1)`,
  },
});
export const imageEffectStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',

  objectFit: 'cover',
  pointerEvents: 'none',
  zIndex: -1,
  animation: `${effectAnimation} 5s linear infinite`,

  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});
export const imageEffectAnimationStyle = styleVariants({
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
    filter: 'blur(4px)',
    transform: `translateX(-2.5%) scale(1.1)`,
  },
});

export const contentStyle = style({
  width: '100%',
  maxWidth: 'calc(1200px + 20rem)',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.2rem',
});

export const sectionStyle = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: '1.2rem',
});

export const playlistWrapperStyle = style({
  width: '20rem',
  maxWidth: '20rem',
  height: '0',
  minHeight: '100%',
});
export const playlistTitleStyle = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  flex: 1,
});

export const headerStyle = style({
  width: '100%',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.8rem',
});

export const logoStyle = style({
  height: '1.6rem',
});

export const toolbarStyle = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '0.4rem',
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
  borderRadius: '1.6rem',

  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      `linear-gradient(
        to right,
        rgba(22, 232, 248, 0.3) 0%,
        rgba(13, 181, 194, 0.3) 20%,
        rgba(5, 155, 167, 0.3) 30.7692%,
        rgba(218, 66, 86, 0.3) 65%,
        rgba(211, 32, 55, 0.6) 100%
      )`,
    /*
      rgba(22, 232, 248, 0.3) calc(100% - 3.2rem),
      rgba(13, 181, 194, 0.3) calc(100% - 2.56rem),
      rgba(5, 155, 167, 0.3) calc(100% - 2.2153856rem),
      rgba(218, 66, 86, 0.3) calc(100% - 1.12rem),
      rgba(211, 32, 55, 0.6) 100%
    */
    transform: `translateX(calc(-100% + ${progressVar} * 100%))`,
    transition: 'inherit',
  },
});

export const progressWrapperStyle = style({
  position: 'relative',

  width: '100%',
  height: '0.4rem',
  borderRadius: '0.2rem',
  margin: '0 0.8rem',

  backgroundColor: 'oklch(100% 0 0 / 0.8)',
  backdropFilter: `saturate(5) brightness(0.98)`,
  boxShadow: '0 2px 6px oklch(0% 0 0 / 0.25)',
});
