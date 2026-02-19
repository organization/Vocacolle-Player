import { runOnPage } from '@/utils';

import { broadcastVideoData } from '../hook/use-video-data';

export const initNext = () => {
  const replaceVideoLink = () => {
    let count = 0;

    const interval = setInterval(() => {
      count += 1;

      const replaceNextLink = () => {
        const items = document.querySelectorAll<HTMLDivElement>(
          '#__next main > :not(nav) div:has(a):has([id^="sm"])'
        );
        if (items.length > 0) clearInterval(interval);
        if (count > 100) clearInterval(interval);

        items.forEach((item) => {
          if (item.getAttribute('data-player')) return;
          item.setAttribute('data-player', 'true');

          const anchors = item.querySelectorAll<HTMLAnchorElement>('a');
          anchors.forEach((anchor) => {
            if (anchor.href.includes('nicovideo.jp')) {
              anchor.addEventListener(
                'click',
                (event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  broadcastVideoData({ url: anchor.href });
                },
                { capture: true }
              );
            }
          });
        });
      };

      replaceNextLink();
    }, 100);
  };
  runOnPage(() => {
    replaceVideoLink();
  });
};
