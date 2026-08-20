import { runOnPage } from '@/utils';
import { RankingType } from '@/shared/types';

import { initNext } from './next';
import { broadcastVideoData } from '../hook/use-video-data';
import { broadcastInjectData } from '../hook/use-inject-data';

export const init2026Summer = () => {
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
          'main > div .css-rmh4s:has(a[href^="https://www.nicovideo.jp/tag"])'
        );

        if (
          playAllContainer &&
          !playAllContainer.querySelector('.vcp-play-all')
        ) {
          const playAllButton = (
            <button class="css-1n4iigd group vcp-play-all" role="group">
              <div class={'css-1286qlj'}>
                <div class={'css-1n35dp9'}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-music-icon lucide-music chakra-icon css-dmi4f1"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" fill="currentColor" />
                    <circle cx="18" cy="16" r="3" fill="currentColor" />
                  </svg>
                </div>
                <p class={'css-rtvwyy'}>すべて再生</p>
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
                class="lucide lucide-play-icon lucide-play chakra-icon css-1dcw3tv"
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
          playAllButton.addEventListener('click', () => {
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

          const showHistoryButton = (
            <button class="css-1n4iigd group vcp-play-all" role="group">
              <div class={'css-1286qlj'}>
                <div class={'css-1n35dp9'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-history-icon lucide-history chakra-icon css-dmi4f1"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M12 7v5l4 2" />
                  </svg>
                </div>
                <p class={'css-1sd22w5'}>時間別ランキングを見る</p>
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
                class="lucide lucide-eye-icon lucide-eye chakra-icon css-1dcw3tv"
              >
                <circle
                  cx="12"
                  cy="12.1912"
                  r="20"
                  fill="#F0530F"
                  stroke="none"
                ></circle>
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          ) as HTMLButtonElement;
          showHistoryButton.addEventListener('click', () => {
            let rankingType: RankingType | null = null;

            if (location.pathname.includes('top100')) rankingType = 'top100';
            else if (location.pathname.includes('rookie'))
              rankingType = 'rookie';
            else if (location.pathname.includes('remix')) rankingType = 'remix';
            else if (location.pathname.includes('exhibition'))
              rankingType = 'exhibition';

            if (!rankingType) return;
            broadcastInjectData({
              type: 'showHistory',
              rankingType,
              seasonType: '2026-summer',
            });
          });

          playAllContainer.append(playAllButton);
          playAllContainer.append(showHistoryButton);
        }
      };

      replaceNextLink();
    }, 100);
  };
  runOnPage(() => {
    replaceVideoLink();
  });
};
