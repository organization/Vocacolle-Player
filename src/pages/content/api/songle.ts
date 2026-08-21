export interface SongleChorusInterval {
  startMs: number;
  endMs: number;
}

interface SongleChorusSegment {
  isChorus?: unknown;
  repeats?: unknown;
}

interface SongleChorusResponse {
  chorusSegments?: unknown;
}

const intervalCache = new Map<string, SongleChorusInterval | null>();

export const selectSongleChorusInterval = (
  value: unknown
): SongleChorusInterval | null => {
  if (!value || typeof value !== 'object') return null;

  const { chorusSegments } = value as SongleChorusResponse;
  if (!Array.isArray(chorusSegments)) return null;

  let earliest: SongleChorusInterval | null = null;

  for (const segmentValue of chorusSegments) {
    if (!segmentValue || typeof segmentValue !== 'object') continue;

    const segment = segmentValue as SongleChorusSegment;
    if (segment.isChorus !== true || !Array.isArray(segment.repeats)) continue;

    for (const repeatValue of segment.repeats) {
      if (!repeatValue || typeof repeatValue !== 'object') continue;

      const { start, duration } = repeatValue as {
        start?: unknown;
        duration?: unknown;
      };
      if (
        typeof start !== 'number' ||
        !Number.isFinite(start) ||
        start < 0 ||
        typeof duration !== 'number' ||
        !Number.isFinite(duration) ||
        duration <= 0
      ) {
        continue;
      }

      const endMs = start + duration;
      if (!Number.isFinite(endMs) || endMs <= start) continue;
      if (!earliest || start < earliest.startMs) {
        earliest = { startMs: start, endMs };
      }
    }
  }

  return earliest;
};

export const fetchSongleChorusInterval = async (
  videoId: string,
  signal?: AbortSignal
): Promise<SongleChorusInterval | null> => {
  if (intervalCache.has(videoId)) return intervalCache.get(videoId) ?? null;

  const watchUrl = `https://www.nicovideo.jp/watch/${videoId}`;
  const url = `https://widget.songle.jp/api/v1/song/chorus.json?url=${encodeURIComponent(watchUrl)}`;

  try {
    const response = await fetch(url, { signal });
    const interval = response.ok
      ? selectSongleChorusInterval(await response.json())
      : null;

    intervalCache.set(videoId, interval);
    return interval;
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === 'AbortError')
    ) {
      throw error;
    }

    intervalCache.set(videoId, null);
    return null;
  }
};
