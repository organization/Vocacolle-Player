import { render } from 'solid-js/web';

import { PlayerBar, PlayerProvider } from './src';
import { addPlaylist, setRankingPlaylist } from '@pages/content/store/playlist';
import { runOnPage } from '@pages/content/utils';
import { initEmbed } from '@pages/content/embed';
import { getOldType } from '@pages/content/api/ranking';
import { RankingType } from '@pages/content/types';
import { addToast, ToastProvider } from '@pages/content/src/ToastProvider';

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

        const playAllContainer = document.querySelector<HTMLDivElement>(
          'main > div > div:has(a[href^="https://www.nicovideo.jp/tag"])'
        );

        if (
          playAllContainer &&
          !playAllContainer.querySelector('.vcp-play-all')
        ) {
          const button = (
            <button
              class="css-ush7cn vcp-play-all"
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

            setRankingPlaylist(rankingType);
          });

          playAllContainer.append(button);
        }

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

                  addPlaylist(anchor.href).then((result) => {
                    if (result) {
                      addToast({
                        message: `"${result.video.title}"(이)가 재생목록에 추가되었습니다.`,
                      });
                    }
                  });
                },
                { capture: true }
              );
            }
          });
        });
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

  render(
    () => (
      <ToastProvider>
        <PlayerProvider>
          <PlayerBar />
        </PlayerProvider>
      </ToastProvider>
    ),
    document.body!
  );
};
init();
