import { Colors } from '@/theme';
import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  // borderRadius: '1.2rem',
  pointerEvents: 'auto',

  backgroundColor: 'oklch(100% 0 0 / 0.8)',
  backdropFilter: 'blur(2px) saturate(5) brightness(0.98)',
  boxShadow: '0 4px 12px oklch(0% 0 0 / 0.35)',
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
});
export const itemContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: '0.8rem',

  padding: '0.8rem',
  marginTop: '-3.2rem',
  paddingTop: '4.0rem',
  mask: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5) 3.0rem, black 4.0rem, black calc(100% - 0.8rem), transparent)',
  overflow: 'auto',
});
