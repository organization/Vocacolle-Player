import { Colors } from '@/theme';
import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: '0.8rem',

  padding: '0.8rem',
  // borderRadius: '1.2rem',
  pointerEvents: 'auto',

  backgroundColor: 'oklch(100% 0 0 / 0.8)',
  backdropFilter: 'blur(2px) saturate(5) brightness(0.98)',
  boxShadow: '0 4px 12px oklch(0% 0 0 / 0.35)',
  color: Colors.gray[900],
});
