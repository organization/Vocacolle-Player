import { createEffect, createSignal, For, JSX, on } from 'solid-js';

import { VideoData } from '@/shared/types';

import { PlayInfo } from '../play-info';

import { containerStyle, headerStyle, itemContainerStyle, itemStyle } from './playlist-view.css';

export type PlaylistViewProps = {
  nowPlayingId?: string;
  playlist: VideoData[];
  onVideo: (video: VideoData, index: number) => void;

  children?: JSX.Element;
};
export const PlaylistView = (props: PlaylistViewProps) => {
  const [parent, setParent] = createSignal<HTMLDivElement | null>(null);

  createEffect(on(() => props.nowPlayingId, (nowPlayingId) => {
    if (!nowPlayingId) return;

    const element = parent()?.querySelector(`[data-playing="true"]`);
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }));

  return (
    <div
      class={containerStyle}
    >
      <div class={headerStyle}>
        {props.children}
      </div>
      <div ref={setParent} class={itemContainerStyle}>
        <For each={props.playlist}>
          {(video, index) => (
            <button
              data-playing={video.video.id === props.nowPlayingId}
              class={itemStyle}
              onClick={() => props.onVideo(video, index())}
            >
              <PlayInfo
                index={index() + 1}
                title={video.video.title}
                artist={video.video.owner.name}
                album={video.video.thumbnail.url}
                ranking={video.ranking}
                rankingType={video.type}
              />
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
