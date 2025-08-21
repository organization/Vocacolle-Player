import { render } from 'solid-js/web';

import { PlayerBar, PlayerProvider } from './src';
import { setRankingPlaylist } from '@pages/content/store/playlist';
import { runOnPage } from '@pages/content/utils';
import { initEmbed } from '@pages/content/embed';
import { getOldType } from '@pages/content/api/ranking';

const init = () => {
  if (location.href.includes('embed.nicovideo.jp')) {
    initEmbed();
    return;
  }

  const type = getOldType();
  if (type) {
    const year = Number(type.split('-')[0]);

    if (year < 2024) {
      // Old ranking page, do not inject player
      return;
    }
  }

  const replaceVideoLink = () => {
    let count = 0;

    const interval = setInterval(() => {
      count += 1;

      const replaceNextLink = () => {
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

                setRankingPlaylist({ videoUrl: anchor.href });
              }, { capture: true });
            }
          });
        });
      };
      const replaceVueLink = () => {
        const items = document.querySelectorAll<HTMLDivElement>(
          'main article > section > ul > li[data-rank] > [role="button"]'
        );

        items.forEach((item) => {
          item.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const ranking = Number(item.parentElement?.getAttribute('data-rank'));
            if (ranking < 0 || !Number.isFinite(ranking)) return;

            setRankingPlaylist({ ranking });
          }, { capture: true });
        });
      };

      replaceNextLink();
      replaceVueLink();
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
