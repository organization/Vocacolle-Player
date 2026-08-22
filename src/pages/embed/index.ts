import { Event } from '@/shared/event';
import { injectStyle } from './style';

const PROGRESS_REPORT_MS = 100;
const SEEK_TOLERANCE = 0.005;
const CommandEventList: string[] = Object.values(Event).filter(
  (type) => type !== Event.ack
);

type PlayerCommand = {
  type: string;
  commandId: string;
  videoId?: string;
  progress?: unknown;
  volume?: unknown;
};

const isParentOrigin = (origin: string) => {
  try {
    const url = new URL(origin);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      url.hostname === 'vocaloid-collection.jp'
    );
  } catch {
    return false;
  }
};

const isPlayerCommand = (data: unknown): data is PlayerCommand => {
  if (!data || typeof data !== 'object') return false;
  const command = data as Partial<PlayerCommand>;
  return (
    typeof command.type === 'string' &&
    CommandEventList.includes(command.type) &&
    typeof command.commandId === 'string'
  );
};

const getVideoId = () =>
  location.pathname.match(/^\/watch\/([^/]+)/)?.[1] ?? null;

const getProgress = () => {
  const video = document.querySelector<HTMLVideoElement>('video');
  if (
    video &&
    Number.isFinite(video.currentTime) &&
    Number.isFinite(video.duration) &&
    video.duration > 0
  ) {
    return Math.min(Math.max(video.currentTime / video.duration, 0), 1);
  }

  const progress = document.querySelector<HTMLDivElement>('.fjpurxp');
  const progressBar = document.querySelector<HTMLDivElement>('.f1k8leow');
  if (!progress || !progressBar) return null;

  const max = progress.getBoundingClientRect().width;
  const value = progressBar.getBoundingClientRect().width;
  if (max <= 0) return null;

  const percentage = value / max;
  return Number.isFinite(percentage)
    ? Math.min(Math.max(percentage, 0), 1)
    : null;
};

const isProgressApplied = (target: number) => {
  const video = document.querySelector<HTMLVideoElement>('video');
  if (video && Number.isFinite(video.duration) && video.duration > 0) {
    return Math.abs(video.currentTime - target * video.duration) <= 1;
  }

  const current = getProgress();
  return current !== null && Math.abs(current - target) <= SEEK_TOLERANCE;
};

const getPlaybackState = (): 'playing' | 'paused' | null => {
  const video = document.querySelector<HTMLVideoElement>('video');
  if (video && video.readyState > 0) {
    return !video.paused && !video.ended ? 'playing' : 'paused';
  }

  const button = document.querySelector<HTMLButtonElement>('button.f1iasax4');
  if (button?.getAttribute('data-title') === '一時停止') return 'playing';
  if (button?.getAttribute('data-title') === '再生') return 'paused';
  return null;
};

const applyPlaybackState = (target: 'playing' | 'paused') => {
  if (getPlaybackState() === target) return true;

  const button = document.querySelector<HTMLButtonElement>('button.f1iasax4');
  const actionTitle = target === 'playing' ? '再生' : '一時停止';
  if (button?.getAttribute('data-title') === actionTitle) button.click();
  else if (target === 'playing')
    document.querySelector<HTMLButtonElement>('button.f1e4uk3h')?.click();
  return false;
};

let progressBridgeReady = false;
let progressBridgeLoading = false;
const loadProgressBridge = () => {
  if (progressBridgeReady || progressBridgeLoading) return;
  progressBridgeLoading = true;

  const script = document.createElement('script');
  const finish = (loaded: boolean) => {
    clearTimeout(timeout);
    progressBridgeReady = loaded;
    progressBridgeLoading = false;
    script.remove();
  };
  const timeout = setTimeout(() => finish(false), 1_000);
  script.addEventListener('load', () => finish(true), { once: true });
  script.addEventListener('error', () => finish(false), { once: true });
  script.src = chrome.runtime.getURL('/src/progress/index.js');
  document.body.appendChild(script);
};

const applyProgress = (target: number) => {
  if (isProgressApplied(target)) return true;
  if (!progressBridgeReady) {
    loadProgressBridge();
    return false;
  }

  window.dispatchEvent(new CustomEvent(Event.progress, { detail: target }));
  return false;
};

const applyCommand = (command: PlayerCommand): boolean | Promise<boolean> => {
  switch (command.type) {
    case Event.play:
      return applyPlaybackState('playing');
    case Event.pause:
      return applyPlaybackState('paused');
    case Event.progress:
      return typeof command.progress === 'number' &&
        Number.isFinite(command.progress)
        ? applyProgress(Math.min(Math.max(command.progress, 0), 1))
        : false;
    case Event.volume: {
      const video = document.querySelector<HTMLVideoElement>('video');
      if (
        !video ||
        typeof command.volume !== 'number' ||
        !Number.isFinite(command.volume)
      )
        return false;
      const target = Math.min(Math.max(command.volume, 0), 1);
      if (Math.abs(video.volume - target) > 0.001) video.volume = target;
      return Math.abs(video.volume - target) <= 0.001;
    }
    case Event.fullscreen: {
      const video = document.querySelector<HTMLVideoElement>('video');
      if (!video) return false;
      if (document.fullscreenElement === video) return true;
      const request = video.requestFullscreen
        ? video.requestFullscreen()
        : 'webkitRequestFullscreen' in video
          ? (video.webkitRequestFullscreen as typeof video.requestFullscreen)()
          : Promise.reject();
      return request
        .then(() => document.fullscreenElement === video)
        .catch(() => false);
    }
    case Event.enableControl:
      document.body.classList.add('enable-control');
      return true;
    case Event.disableControl:
      document.body.classList.remove('enable-control');
      return true;
    default:
      return false;
  }
};

export const initEmbed = () => {
  const embedWindow = window as Window & { __vcpEmbedInitialized?: boolean };
  if (embedWindow.__vcpEmbedInitialized) return;
  embedWindow.__vcpEmbedInitialized = true;

  console.log('[Vocacolle Player] Embed script loaded.');
  injectStyle();

  const processingCommands = new Set<string>();
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || !isParentOrigin(event.origin)) return;
    if (!isPlayerCommand(event.data)) return;
    if (event.data.videoId && event.data.videoId !== getVideoId()) return;
    if (processingCommands.has(event.data.commandId)) return;

    processingCommands.add(event.data.commandId);
    void Promise.resolve(applyCommand(event.data))
      .then((applied) => {
        if (applied)
          window.parent.postMessage(
            { type: Event.ack, commandId: event.data.commandId },
            event.origin
          );
      })
      .finally(() => processingCommands.delete(event.data.commandId));
  });

  let lastReportedPercentage: number | null = null;
  setInterval(() => {
    const percentage = getProgress();
    if (percentage === null || percentage === lastReportedPercentage) return;
    lastReportedPercentage = percentage;
    window.parent.postMessage(
      { type: Event.progress, videoId: getVideoId(), percentage },
      '*'
    );
  }, PROGRESS_REPORT_MS);
};

if (location.href.includes('embed.nicovideo.jp')) initEmbed();
