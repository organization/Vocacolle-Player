console.log('[Vocacolle Player] Background script loaded.');

const extractType = (url: string): [number, string] | null => {
  const [, year, season] =
    url.match(/vocaloid-collection\.jp\/([0-9]{4})-([^/]+)/) ?? [];

  if (year && season) return [Number(year), season];
  return null;
};

const setIconFromUrl = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  const bitmap = await createImageBitmap(blob);

  const size = bitmap.width;
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(bitmap, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);

  await chrome.action.setIcon({ imageData });
};

let currentIconUrl: string | null = null;
const onUpdate = async (url: string) => {
  if (!url.includes('vocaloid-collection.jp')) return;

  const type = extractType(url);
  const iconURL = type
    ? `https://vocaloid-collection.jp/${type[0]}-${type[1]}/favicon.ico`
    : 'https://vocaloid-collection.jp/favicon.ico';

  if (currentIconUrl === iconURL) return;

  currentIconUrl = iconURL;
  setIconFromUrl(iconURL);
};

(async () => {
  if (!chrome.tabs) return;

  chrome.tabs.onUpdated.addListener(async (_, __, tab) => {
    if (tab.url) onUpdate(tab.url);
  });
  chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url) onUpdate(tab.url);
  });
})();