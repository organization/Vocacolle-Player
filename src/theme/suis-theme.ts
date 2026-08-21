import { createTheme } from '@suis-ui/kit';

export const suisPixelTheme = createTheme({
  token: {
    size: {
      '-4': '2px',
      '-3': '4px',
      '-2': '6px',
      '-1': '8px',
      0: '12px',
      1: '16px',
      2: '20px',
      3: '24px',
      4: '32px',
      5: '36px',
      6: '42px',
      7: '48px',
      8: '52px',
      9: '64px',
    },
    textSize: {
      '-3': '8px',
      '-2': '10px',
      '-1': '12px',
      0: '14px',
      1: '16px',
      2: '18px',
      3: '20px',
      4: '24px',
      5: '28px',
      6: '32px',
      7: '36px',
      8: '42px',
      9: '48px',
    },
  },
  vars: {
    font: {
      h1: { fontSize: '48px', letterSpacing: '-0.2px' },
      h2: { fontSize: '36px', letterSpacing: '-0.2px' },
      h3: { fontSize: '24px', letterSpacing: '-0.2px' },
      title: { fontSize: '18px' },
      body: { fontSize: '14px' },
      caption: { fontSize: '12px' },
    },
    size: {
      space: {
        none: '0px',
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        full: '100%',
      },
      round: {
        none: '0px',
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        full: '100%',
      },
    },
    zIndex: {
      tooltip: '1200',
    }
  },
  component: {
    checkbox: {
      indicator: { size: '24px' },
      check: { size: '16px' },
    },
    select: {
      trigger: {
        default: {
          paddingX: '12px',
          paddingY: '8px',
        },
      },
      content: { padding: '4px' },
      check: { size: '16px' },
    },
    item: {
      size: {
        medium: {
          x: '12px',
          y: '8px',
        },
      },
    },
    slider: {
      size: '200px',
    },
  },
});
