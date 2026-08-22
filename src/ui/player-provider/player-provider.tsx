import { createContext, JSX, onCleanup, onMount, useContext } from 'solid-js';

import { Event } from '@/shared/event';

const EMBED_ORIGIN = 'https://embed.nicovideo.jp';
const RETRY_MS = 250;
const TIMEOUT_MS = 30_000;

type PlayerContextType = {
  sendEvent: (event: unknown, signal?: AbortSignal) => void;
};
type PlayerEvent = { type: string; [key: string]: unknown };
type PendingEvent = {
  commandId: string;
  signature: string;
  retryId: ReturnType<typeof setInterval>;
  timeoutId: ReturnType<typeof setTimeout>;
  signal?: AbortSignal;
  onAbort?: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

const getEventGroup = (type: string) => {
  if (type === Event.play || type === Event.pause) return 'playback';
  if (type === Event.enableControl || type === Event.disableControl)
    return 'control';
  return type;
};

export type PlayerProviderProps = {
  children: JSX.Element;
};
export const PlayerProvider = (props: PlayerProviderProps) => {
  const pendingEvents = new Map<string, PendingEvent>();
  let commandSequence = 0;

  const clearPendingEvent = (group: string) => {
    const pending = pendingEvents.get(group);
    if (!pending) return;

    clearInterval(pending.retryId);
    clearTimeout(pending.timeoutId);
    if (pending.signal && pending.onAbort) {
      pending.signal.removeEventListener('abort', pending.onAbort);
    }
    pendingEvents.delete(group);
  };

  const sendEvent = (event: unknown, signal?: AbortSignal) => {
    if (
      signal?.aborted ||
      !event ||
      typeof event !== 'object' ||
      !('type' in event) ||
      typeof event.type !== 'string'
    )
      return;

    const playerEvent = event as PlayerEvent;
    const group = getEventGroup(playerEvent.type);
    const iframe = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
    const videoId = iframe?.src.match(/\/watch\/([^?]+)/)?.[1];
    const signature = JSON.stringify({ ...playerEvent, videoId });
    const previous = pendingEvents.get(group);
    if (previous?.signature === signature) return;
    clearPendingEvent(group);

    const commandId = `vcp-${Date.now().toString(36)}-${++commandSequence}`;
    const message = { ...playerEvent, commandId, videoId };
    const post = () =>
      document
        .querySelector<HTMLIFrameElement>('#vcp-iframe')
        ?.contentWindow?.postMessage(message, EMBED_ORIGIN);
    const onAbort = () => clearPendingEvent(group);
    const retryId = setInterval(post, RETRY_MS);
    const timeoutId = setTimeout(() => clearPendingEvent(group), TIMEOUT_MS);

    pendingEvents.set(group, {
      commandId,
      signature,
      retryId,
      timeoutId,
      signal,
      onAbort,
    });
    signal?.addEventListener('abort', onAbort, { once: true });
    post();
  };

  onMount(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== EMBED_ORIGIN) return;
      const iframe = document.querySelector<HTMLIFrameElement>('#vcp-iframe');
      if (!iframe || event.source !== iframe.contentWindow) return;
      if (event.data?.type !== Event.ack) return;

      for (const [group, pending] of pendingEvents) {
        if (pending.commandId === event.data.commandId) {
          clearPendingEvent(group);
          return;
        }
      }
    };

    window.addEventListener('message', onMessage);
    onCleanup(() => window.removeEventListener('message', onMessage));
  });

  onCleanup(() => {
    for (const group of pendingEvents.keys()) clearPendingEvent(group);
  });

  return (
    <PlayerContext.Provider value={{ sendEvent }}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error('usePlayer must be used within a PlayerProvider');

  return context;
};
