import { style, styleVariants } from '@vanilla-extract/css';

export const containerStyle = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '0.4rem',

  userSelect: 'none',
});

export const indexStyle = style({
  fontSize: '12px',
  color: 'oklch(14.5% 0 0 / 0.4)',
});

const baseRankingStyle = style({
  borderRadius: 100,
  textAlign: 'center',
  flexShrink: 0,
  padding: '2px 6px',
  marginLeft: 'auto',
  fontSize: '10px',
});
export const rankingStyle = styleVariants({
  1: [
    baseRankingStyle,
    {
      color: 'oklch(14.5% 0 0 / 1)',
      backgroundColor: '#fcd34d',
      fontWeight: 'bold',
    },
  ],
  2: [
    baseRankingStyle,
    {
      color: 'oklch(14.5% 0 0 / 1)',
      backgroundColor: '#94a3b8',
      fontWeight: 'bold',
    },
  ],
  3: [
    baseRankingStyle,
    {
      color: 'oklch(94% 0 0 / 1)',
      backgroundColor: '#854d0e',
      fontWeight: 'bold',
    },
  ],
  in10: [
    baseRankingStyle,
    {
      mixBlendMode: 'exclusion',
      backgroundColor: 'oklch(94.5% 0 0 / 0.6)',
      color: 'oklch(14.5% 0 0 / 0.6)',
    },
  ],
  in100: [
    baseRankingStyle,
    {
      mixBlendMode: 'exclusion',
      backgroundColor: 'oklch(94.5% 0 0 / 0.4)',
      color: 'oklch(14.5% 0 0 / 0.4)',
    },
  ],
});

export const textContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  overflow: 'hidden',
});

export const imageStyle = style({
  width: '36px',
  height: '36px',
  aspectRatio: '1 / 1',
  objectFit: 'cover',
});

export const clickableAlbumStyle = style({
  position: 'relative',
  cursor: 'pointer',
  pointerEvents: 'auto',
  borderRadius: '8px',
  overflow: 'hidden',

  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',

  selectors: {
    '&:hover': {
      scale: 1.2,
    },
    '&:active': {
      scale: 0.95,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'oklch(14.5% 0 0 / 0.5)',
      opacity: 0,
      transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
    },
    '&:hover::before': {
      opacity: 1,
    },
    '&:active::before': {
      opacity: 1,
    },
  },
});
export const albumIconStyle = style({
  position: 'absolute',
  width: '16px',
  height: '16px',
  color: 'oklch(94.5% 0 0 / 1)',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',

  selectors: {
    [`${clickableAlbumStyle}:hover &`]: {
      opacity: 1,
    },
  },
});

export const titleStyle = style({
  width: '100%',
  fontSize: '16px',
  color: 'oklch(14.5% 0 0 / 1)',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

export const artistStyle = style({
  fontSize: '12px',
  color: 'oklch(14.5% 0 0 / 0.4)',
});
