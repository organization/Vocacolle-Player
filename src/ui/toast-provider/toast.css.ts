import { style, styleVariants } from '@vanilla-extract/css';

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

export const toastStyle = style({
  width: 'fit-content',
  minWidth: '240px',

  border: '2px solid #252525',
  backgroundColor: '#fff',
  boxShadow: '0px 3px 0px 0px #252525',
  color: Colors.gray[900],

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  fontSize: '14px',

  borderRadius: '1.2rem',
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
