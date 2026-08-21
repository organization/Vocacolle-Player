import { style } from '@vanilla-extract/css';

export const sectionStyle = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: '1.2rem',
});

export const playlistWrapperStyle = style({
  width: '20rem',
  maxWidth: '20rem',
  height: '0',
  minHeight: '100%',
});
export const playlistTitleStyle = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  flex: 1,
});

export const toolbarStyle = style({
  width: '100%',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '0.4rem',
});

export const progressWrapperStyle = style({
  position: 'relative',

  width: '100%',
  height: '0.8rem',
  borderRadius: '0.4rem',
  margin: '0 0.8rem',
  cursor: 'pointer',

  backgroundColor: 'oklch(100% 0 0 / 0.8)',
  backdropFilter: `saturate(5) brightness(0.98)`,
  boxShadow: '0 2px 6px oklch(0% 0 0 / 0.25)',
});
