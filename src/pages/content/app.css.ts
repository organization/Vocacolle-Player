import { style } from '@vanilla-extract/css';

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
