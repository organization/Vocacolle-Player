import { Event } from "@pages/content/event";

const EventList = Object.values(Event);
export const initEmbed = () => {
  window.addEventListener("message", (event) => {
    if (!event.data) return;
    if (typeof event.data !== "object") return;
    if (!("type" in event.data && EventList.includes(event.data.type))) return;

    switch (event.data.type) {
      case Event.play: {
        let count = 0;
        const interval = setInterval(() => {
          count += 1;
          if (count > 100) clearInterval(interval);

          const button =
            document.querySelector<HTMLButtonElement>("button.f1iasax4");
          const playButton =
            document.querySelector<HTMLButtonElement>("button.f1e4uk3h");

          if (playButton) {
            clearInterval(interval);
            playButton.click();
          }
          if (button) {
            clearInterval(interval);
            if (button.getAttribute("data-title") !== "再生") return;

            button.click();
          }
        }, 100);
        return;
      }
      case Event.pause: {
        const button =
          document.querySelector<HTMLButtonElement>("button.f1iasax4");
        if (!button) return;
        if (button.getAttribute("data-title") !== "一時停止") return;

        button.click();
        return;
      }
      case Event.volume:
        console.log("volume event!");
    }
  });

  const progress = document.querySelector<HTMLDivElement>(".fjpurxp");
  const progressBar = document.querySelector<HTMLDivElement>(".f1k8leow");

  const interval = setInterval(() => {
    if (!progress || !progressBar) return;

    const max = progress.getBoundingClientRect().width;
    const value = progressBar.getBoundingClientRect().width;

    if (max === 0) return;

    const percentage = value / max;

    window.parent.postMessage({ type: Event.progress, percentage }, "*");
  }, 100);
};
