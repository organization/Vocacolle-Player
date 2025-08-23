import { style } from '@vanilla-extract/css';
import { Colors } from '@pages/content/theme';

export const toastContainerStyle = style({
  position: 'fixed',
  bottom: 0,
  right: 0,

  padding: '32px',

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

  backgroundColor: 'oklch(94% 0 0 / 0.2)',
  backdropFilter: 'blur(8px) saturate(5) brightness(0.98)',
  border: '2px solid oklch(94% 0 0 / 0.2)',
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