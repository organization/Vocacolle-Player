import { style } from '@vanilla-extract/css';

export const iconButtonStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',

  fontSize: '16px',

  color: 'oklch(14.5% 0 0 / 1)',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '100px',
  pointerEvents: 'auto',
  flexShrink: 0,
  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',

  selectors: {
    '&:hover': {
      backgroundColor: 'oklch(14.5% 0 0 / 0.2)',
      transform: 'scale(1.2)',
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
