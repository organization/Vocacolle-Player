import { createVar, style, styleVariants } from '@vanilla-extract/css';

import { Colors } from '@/theme';

export const toastContainerStyle = style({
  position: 'fixed',
  inset: '0.8rem',

  paddingBottom: 'calc(0.8rem + 3.6rem)',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  gap: '8px',

  zIndex: 1000,
  pointerEvents: 'none',
});

export const glassFilter = createVar();
export const toastStyle = style({
  width: 'fit-content',
  minWidth: '240px',

  backgroundColor: 'oklch(100% 0 0 / 0.8)',
  backdropFilter: `${glassFilter} saturate(5) brightness(0.98)`,
  boxShadow: '0 4px 12px oklch(0% 0 0 / 0.35)',
  color: Colors.gray[900],

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  fontSize: '14px',

  borderRadius: '12px',
  padding: '12px 16px',
  pointerEvents: 'all',
  animationFillMode: 'both',
});

export const toastAnimationStyle = styleVariants({
  enter: {
    opacity: 1,
    transform: 'translateX(0%)',
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    transform: 'translateX(100%)',
  },
});
