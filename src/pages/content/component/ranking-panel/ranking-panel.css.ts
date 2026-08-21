import { style } from '@vanilla-extract/css';
import { vars } from '@suis-ui/kit/css';

export const panelStyle = style({
  width: '100%',
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.size.space.sm,
  color: vars.color.text.main,
  borderRadius: vars.size.round.lg,
  overflow: 'hidden',
});

export const titleStyle = style({
  margin: 0,
  fontSize: vars.font.h3.fontSize,
  lineHeight: vars.font.h3.lineHeight,
  fontWeight: vars.font.h3.fontWeight,
  letterSpacing: vars.font.h3.letterSpacing,
});

export const headerStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: vars.size.space.lg,
  flexWrap: 'wrap',
});

export const limitControlStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.size.space.sm,
  flex: '0 0 auto',
});

export const limitLabelStyle = style({
  color: vars.color.text.caption,
  fontSize: vars.font.caption.fontSize,
  lineHeight: vars.font.caption.lineHeight,
  fontWeight: vars.font.caption.fontWeight,
});

export const stateStyle = style({
  flex: 1,
  minHeight: '12rem',
  display: 'grid',
  placeItems: 'center',
  color: vars.color.text.caption,
  background: vars.color.surface.main,
  borderRadius: vars.size.round.md,
});

export const warningStyle = style({
  margin: 0,
  padding: `${vars.size.space.xs} ${vars.size.space.sm}`,
  color: vars.color.warn.containerContrast,
  background: vars.color.warn.container,
  borderRadius: vars.size.round.sm,
  fontSize: vars.font.caption.fontSize,
  lineHeight: vars.font.caption.lineHeight,
  flex: '0 0 auto',
});

export const viewportStyle = style({
  width: '100%',
  minHeight: 0,
  flex: 1,
  overflow: 'scroll',
  overscrollBehavior: 'contain',
  background: vars.color.surface.main,
  border: `${vars.size.line.thin} solid ${vars.color.surface.higher}`,
  borderRadius: vars.size.round.md,
});

export const plotStyle = style({
  position: 'relative',
  isolation: 'isolate',
  flex: 'none',
  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 31px, ${vars.color.surface.higher} 32px)`,
});

export const axisTextStyle = style({
  fill: vars.color.text.caption,
  fontSize: vars.font.caption.fontSize,
  textAnchor: 'end',
  dominantBaseline: 'middle',
  userSelect: 'none',
});

export const timeTextStyle = style({
  fill: vars.color.text.caption,
  fontSize: vars.font.caption.fontSize,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
  userSelect: 'none',
  cursor: 'pointer',
  outline: 'none',
  transition: vars.motion.transition.fast,
  selectors: {
    '&:hover': {
      fill: vars.color.primary.main,
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      fill: vars.color.primary.main,
      fontWeight: vars.font.title.fontWeight,
      textDecoration: 'underline',
    },
  },
});

export const seriesGroupStyle = style({
  strokeWidth: 12,
  opacity: 0.58,
  outline: 'none',
  cursor: 'pointer',
  transition: vars.motion.transition.fast,
});

export const seriesPathStyle = style({
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  pointerEvents: 'stroke',
  vectorEffect: 'non-scaling-stroke',
});

export const activeSeriesStyle = style({
  opacity: 1,
  strokeWidth: 16,
});

export const dimmedSeriesStyle = style({
  opacity: 0.12,
});

export const popupAnchorStyle = style({
  position: 'absolute',
  zIndex: 2,
  width: vars.size.space.sm,
  height: vars.size.space.sm,
  border: `${vars.size.line.thin} solid ${vars.color.primary.contrast}`,
  borderRadius: vars.size.round.full,
  background: vars.color.primary.main,
  boxShadow: vars.shadow.sm,
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
});

export const popupContentStyle = style({
  width: '320px',
  maxWidth: 'min(320px, calc(100vw - 32px))',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.size.space.sm,
});

export const popupTimeStyle = style({
  paddingTop: vars.size.space.xs,
  borderTop: `${vars.size.line.thin} solid ${vars.color.surface.higher}`,
  color: vars.color.text.caption,
  fontSize: vars.font.caption.fontSize,
  lineHeight: vars.font.caption.lineHeight,
  textAlign: 'right',
});
