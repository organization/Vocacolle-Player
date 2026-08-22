(() => {
  const progressWindow = window as Window & {
    __vcpProgressBridgeInstalled?: boolean;
  };
  if (progressWindow.__vcpProgressBridgeInstalled) return;
  progressWindow.__vcpProgressBridgeInstalled = true;

  window.addEventListener('vcp:progress', (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const progress = event.detail;
    if (typeof progress !== 'number') return;

    const seekbar = document.querySelector<HTMLDivElement>('.f26lxvz');
    if (!seekbar) return;
    const property = Object.getOwnPropertyNames(seekbar).find((name) =>
      name.startsWith('__reactInternalInstance')
    );
    if (!property) return;

    const caller = (seekbar as any)[property]?._currentElement?.props
      ?.onTouchStart;
    const end = (seekbar as any)[property]?._currentElement?.props?.onTouchEnd;
    const rect = seekbar.getBoundingClientRect();
    const touch = new Touch({
      identifier: 0,
      target: seekbar,
      clientX: rect.left + progress * rect.width,
      clientY: rect.top + rect.height / 2,
    });
    const options = { bubbles: true, cancelable: true, touches: [touch] };

    caller?.(new TouchEvent('touchstart', options));
    end?.(new TouchEvent('touchend', options));
  });
})();
