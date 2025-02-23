import { render } from 'solid-js/web';

import { PlayerBar, PlayerProvider } from './src';
import { setRankingPlaylist } from '@pages/content/store/playlist';
import { runOnPage } from '@pages/content/utils';
import { initEmbed } from '@pages/content/embed';

const init = () => {
  if (location.href.includes('nicovideo.jp')) {
    initEmbed();
    return;
  }

  const replaceVideoLink = () => {
    let count = 0;

    const interval = setInterval(() => {
      count += 1;
      const items = document.querySelectorAll<HTMLDivElement>(
        '#__next main > :not(nav) .css-0:has(a)'
      );
      if (items.length > 0) clearInterval(interval);
      if (count > 100) clearInterval(interval);

      items.forEach((item) => {
        if (item.getAttribute('data-player')) return;
        item.setAttribute('data-player', 'true');

        const anchors = item.querySelectorAll<HTMLAnchorElement>('a');
        anchors.forEach((anchor) => {
          if (anchor.href.includes('nicovideo.jp')) {
            anchor.addEventListener('click', (event) => {
              event.preventDefault();
              event.stopPropagation();

              setRankingPlaylist(anchor.href);
            });
          }
        });
      });
    }, 100);
  };
  runOnPage(() => {
    replaceVideoLink();
  });

  render(
    () => (
      <PlayerProvider>
        <PlayerBar />
      </PlayerProvider>
    ),
    document.body!
  );
};
init();
