import { style } from '@vanilla-extract/css';

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

  backgroundColor: 'oklch(94% 0 0 / 0.4)',
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