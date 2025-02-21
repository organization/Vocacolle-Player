type Removable = (() => void) | void | Promise<(() => void) | void>;
export const runOnPage = async (fn: () => Removable) => {
  let cleanUp: (() => void) | null = null;

  const cleanUpFn = await fn();
  if (cleanUpFn) cleanUp = cleanUpFn;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.navigation.addEventListener('navigate', async () => {
    cleanUp?.();
    const cleanUpFn = await fn();
    if (cleanUpFn) cleanUp = cleanUpFn;
  });

  return { cleanUp };
};

export const runOnReactPage = (fn: () => Removable) => {
  let cleanUp: (() => void) | null = null;
  let ignore = false;

  const runner = async () => {
    cleanUp?.();
    ignore = true;
    const cleanUpFn = await fn();
    if (cleanUpFn) cleanUp = cleanUpFn;
  };

  const observer = new MutationObserver(() => {
    if (ignore) {
      ignore = false;
      return;
    }

    runner();
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.navigation.addEventListener('navigate', runner);
  observer.observe(document.body, { childList: true, subtree: true });

  return { cleanUp };
};
