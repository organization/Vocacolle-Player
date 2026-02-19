import { runOnPage } from '@/utils';
import { RankingType } from '@/shared/types';

import { initNext } from './next';
import { broadcastVideoData } from '../hook/use-video-data';

export const init2026Winter = () => {
  initNext();

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

        const playAllContainer = document.querySelector<HTMLDivElement>(
          'main > div > div:has(a[href^="https://www.nicovideo.jp/tag"])'
        );

        if (
          playAllContainer &&
          !playAllContainer.querySelector('.vcp-play-all')
        ) {
          const button = (
            <button
              class="css-17csabp vcp-play-all"
              role="group"
              style="margin-top: 8px;"
            >
              <div>모두 재생</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="32"
                viewBox="-8 -8 40 40"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-play-icon lucide-play chakra-icon css-1c702rv"
              >
                <circle
                  cx="12"
                  cy="12.1912"
                  r="20"
                  fill="#059BA7"
                  stroke="none"
                ></circle>
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
              </svg>
            </button>
          ) as HTMLButtonElement;
          button.addEventListener('click', () => {
            let rankingType: RankingType | null = null;

            if (location.pathname.includes('top100')) rankingType = 'top100';
            else if (location.pathname.includes('rookie'))
              rankingType = 'rookie';
            else if (location.pathname.includes('remix')) rankingType = 'remix';
            else if (location.pathname.includes('exhibition'))
              rankingType = 'exhibition';

            if (!rankingType) return;
            broadcastVideoData({ type: rankingType });
          });

          playAllContainer.append(button);
        }
      };

      replaceNextLink();
    }, 100);
  };
  runOnPage(() => {
    replaceVideoLink();
  });
};