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

const baseRankingStyle = style({
  width: '2rem',
  height: '2rem',
  borderRadius: 100,
  textAlign: 'center',
  lineHeight: '2rem',
  flexShrink: 0,
});
export const rankingStyle = styleVariants({
  1: [
    baseRankingStyle,
    {
      color: 'oklch(14.5% 0 0 / 1)',
      backgroundColor: '#fcd34d',
      fontSize: '1.0rem',
    },
  ],
  2: [
    baseRankingStyle,
    {
      color: 'oklch(14.5% 0 0 / 1)',
      backgroundColor: '#94a3b8',
      fontSize: '1.0rem',
    },
  ],
  3: [
    baseRankingStyle,
    {
      color: 'oklch(94% 0 0 / 1)',
      backgroundColor: '#854d0e',
      fontSize: '1.0rem',
    },
  ],
  in10: [
    baseRankingStyle,
    {
      fontSize: '1.0rem',
      color: 'oklch(14.5% 0 0 / 1)',
    },
  ],
  in100: [
    baseRankingStyle,
    {
      fontSize: '0.8rem',
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
  width: '2.4rem',
  height: '2.4rem',
  borderRadius: '0.4rem',
  aspectRatio: '1',
});

export const titleStyle = style({
  width: '100%',
  fontSize: '1rem',
  color: 'oklch(14.5% 0 0 / 1)',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

export const artistStyle = style({
  fontSize: '0.8rem',
  color: 'oklch(14.5% 0 0 / 0.4)',
});
