import { runOnPage } from '@/utils';
import { RankingType } from '@/shared/types';

import { initNext } from './next';
import { broadcastVideoData } from '../hook/use-video-data';

export const init2025Summer = () => {
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
          'main > div .css-ocdplg:has(a[href^="https://www.nicovideo.jp/tag"])'
        );

        if (
          playAllContainer &&
          !playAllContainer.querySelector('.vcp-play-all')
        ) {
          const button = (
            <button
              class="css-ush7cn vcp-play-all"
              role="group"
            >
              <div class={'css-wv8svx'}>
                <div class={'css-1usb4w1'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-music-icon lucide-music chakra-icon css-dmi4f1"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" fill="currentColor" />
                    <circle cx="18" cy="16" r="3" fill="currentColor" />
                  </svg>
                </div>
                <p class={'chakra-text css-10u0d8q'}>すべて再生</p>
              </div>
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
                class="lucide lucide-play-icon lucide-play chakra-icon css-8nm8gy"
              >
                <circle
                  cx="12"
                  cy="12.1912"
                  r="20"
                  fill="#F0530F"
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
      const replaceVueLink = () => {
        const items = document.querySelectorAll<HTMLDivElement>(
          'main article > section > ul > li[data-rank] > [role="button"]'
        );

        items.forEach((item) => {
          item.addEventListener(
            'click',
            (event) => {
              event.preventDefault();
              event.stopPropagation();

              const ranking = Number(
                item.parentElement?.getAttribute('data-rank')
              );
              if (ranking < 0 || !Number.isFinite(ranking)) return;

              // addPlaylist({ ranking });
            },
            { capture: true }
          );
        });
      };

      replaceNextLink();
      replaceVueLink();
    }, 100);
  };
  runOnPage(() => {
    replaceVideoLink();
  });
};