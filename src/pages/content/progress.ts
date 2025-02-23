(() => {
  const seekbar = document.querySelector<HTMLDivElement>(".f26lxvz");
  if (!seekbar) return;

  const names = Object.getOwnPropertyNames(seekbar);
  const property = names.find((name) =>
    name.startsWith("__reactInternalInstance")
  );
  if (!property) return;

  window.addEventListener(
    "vcp:progress",
    (event: CustomEvent) => {
      const progress = event.detail;

      const caller = (seekbar as any)[property]?._currentElement?.props
        ?.onTouchStart;
      const end = (seekbar as any)[property]?._currentElement?.props
        ?.onTouchEnd;
      const startEvent = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [
          new Touch({
            identifier: 0,
            target: seekbar,
            clientX: progress * seekbar.getBoundingClientRect().width,
            clientY: 0,
          }),
        ],
      });
      const endEvent = new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        touches: [
          new Touch({
            identifier: 0,
            target: seekbar,
            clientX: progress * seekbar.getBoundingClientRect().width,
            clientY: 0,
          }),
        ],
      });

      caller(startEvent);
      end(endEvent);
    },
    { once: true }
  );
})();
