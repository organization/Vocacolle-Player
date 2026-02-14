import { Event } from '@/shared/event';

const EventList = Object.values(Event);
export const initEmbed = () => {
  window.addEventListener('message', (event) => {
    if (!event.data) return;
    if (typeof event.data !== 'object') return;
    if (!('type' in event.data && EventList.includes(event.data.type))) return;

    switch (event.data.type) {
      case Event.play: {
        let count = 0;
        const interval = setInterval(() => {
          count += 1;
          if (count > 500) clearInterval(interval);

          const button =
            document.querySelector<HTMLButtonElement>('button.f1iasax4');
          const playButton =
            document.querySelector<HTMLButtonElement>('button.f1e4uk3h');

          if (button) {
            clearInterval(interval);
            if (button.getAttribute('data-title') !== '再生') return;

            button.click();
          } else if (playButton) {
            clearInterval(interval);
            playButton.click();
          }
        }, 100);
        return;
      }
      case Event.pause: {
        const button =
          document.querySelector<HTMLButtonElement>('button.f1iasax4');
        if (!button) return;
        if (button.getAttribute('data-title') !== '一時停止') return;

        button.click();
        return;
      }
      case Event.volume: {
        const video = document.querySelector<HTMLVideoElement>('video');
        if (!video) return;

        video.volume = event.data.volume;
        return;
      }
      case Event.progress: {
        const seekbar = document.querySelector<HTMLDivElement>('.f26lxvz');
        if (!seekbar) return;

        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('/src/pages/progress/index.js');
        document.body.appendChild(script);
        window.dispatchEvent(
          new CustomEvent(Event.progress, { detail: event.data.progress })
        );
        script.remove();

        return;
      }
      case Event.fullscreen: {
        const video = document.querySelector<HTMLVideoElement>('video');
        if (!video) return;

        video.requestFullscreen();
        if ('webkitRequestFullscreen' in video) {
          (video.webkitRequestFullscreen as typeof video.requestFullscreen)();
        }
        return;
      }
    }
  });

  const progress = document.querySelector<HTMLDivElement>('.fjpurxp');
  const progressBar = document.querySelector<HTMLDivElement>('.f1k8leow');

  setInterval(() => {
    if (!progress || !progressBar) return;

    const max = progress.getBoundingClientRect().width;
    const value = progressBar.getBoundingClientRect().width;

    if (max === 0) return;

    const percentage = value / max;

    window.parent.postMessage({ type: Event.progress, percentage }, '*');
  }, 100);
};

if (location.href.includes('embed.nicovideo.jp')) initEmbed();
