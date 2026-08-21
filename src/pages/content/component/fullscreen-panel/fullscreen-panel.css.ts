import { keyframes, style, styleVariants } from '@vanilla-extract/css';

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
