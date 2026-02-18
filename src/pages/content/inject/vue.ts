import { runOnPage } from '@/utils';

export const initVue = () => {
  const replaceVideoLink = () => {
    let count = 0;

    const interval = setInterval(() => {
      count += 1;

      const replaceVueLink = () => {
        const items = document.querySelectorAll<HTMLDivElement>(
          'main article > section > ul > li[data-rank] > [role="button"]'
        );
        if (items.length > 0) clearInterval(interval);
        if (count > 100) clearInterval(interval);

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

      replaceVueLink();
    }, 100);
  };

  runOnPage(() => {
    replaceVideoLink();
  });
};
