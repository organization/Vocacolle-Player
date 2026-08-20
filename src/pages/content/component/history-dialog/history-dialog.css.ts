import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: '0.8rem',

  overflow: 'auto',
});
