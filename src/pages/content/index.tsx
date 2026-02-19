import { render } from 'solid-js/web';

import { App } from './app';
import { getOldType } from './api/ranking';

import { initVue } from './inject/vue';
import { initNext } from './inject/next';
import { init2025Summer } from './inject/2025-summer';
import { init2026Winter } from './inject/2026-winter';

const init = () => {
  const type = getOldType();

  if (type) {
    const year = Number(type.split('-')[0]);
    const season = type.split('-')[1];

    if (year === 2026 && season === 'winter') init2026Winter();
    if (year === 2025 && season === 'summer') init2025Summer();
    else {
      initNext();
      initVue();
    }

    if (year < 2024) {
      // Old ranking page, do not inject player
      return;
    }
  } else {
    init2026Winter();
  }

  render(
    App,
    document.body!
  );
};
init();
