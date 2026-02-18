import { render } from 'solid-js/web';

import { App } from './app';
import { getOldType } from './api/ranking';

import { init2025Summer } from './inject/2025-summer';
import { initNext } from './inject/next';
import { initVue } from './inject/vue';

const init = () => {
  const type = getOldType();
  if (type) {
    const year = Number(type.split('-')[0]);
    const season = type.split('-')[1];

    if (year === 2025 && season === 'summer') init2025Summer();
    else {
      initNext();
      initVue();
    }

    if (year < 2024) {
      // Old ranking page, do not inject player
      return;
    }
  }  

  render(
    App,
    document.body!
  );
};
init();
