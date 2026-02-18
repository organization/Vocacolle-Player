import { Colors } from '@/theme';
import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  pointerEvents: 'auto',

  color: Colors.gray[900],
});

export const headerStyle = style({  
  position: 'sticky',
  top: '0',
  left: '0',
  right: '0',

  height: '3.2rem',

  flexShrink: 0,
  padding: '0.8rem',
  zIndex: 5,
});

export const itemStyle = style({
  flexShrink: 0,

  padding: '0.4rem',
  borderRadius: '0.8rem',
  cursor: 'pointer',

  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',

  selectors: {
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    '&[data-playing="true"]': {
      backgroundColor: 'oklch(14.5% 0 0 / 0.1)',
    },
  },
});
export const itemContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  padding: '0.4rem',
  marginTop: '-3.2rem',
  paddingTop: '3.6rem',
  mask: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5) 3.0rem, black 4.0rem, black calc(100% - 0.8rem), transparent)',

  overflow: 'auto',
  overflowX: 'hidden',
});
