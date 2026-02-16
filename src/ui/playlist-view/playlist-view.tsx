import { For, JSX } from 'solid-js';

import { VideoData } from '@/shared/types';

import { PlayInfo } from '../play-info';

import { containerStyle, headerStyle, itemContainerStyle, itemStyle } from './playlist-view.css';

export type PlaylistViewProps = {
  playlist: VideoData[];

  children?: JSX.Element;
};
export const PlaylistView = (props: PlaylistViewProps) => {
  return (
    <div
      class={containerStyle}
    >
      <div class={headerStyle}>
        {props.children}
      </div>
      <div class={itemContainerStyle}>
      <For each={props.playlist}>
        {(video) => (
          <div class={itemStyle}>
            <PlayInfo
              title={video.video.title}
              artist={video.video.owner.name}
              album={video.video.thumbnail.url}
              ranking={video.ranking}
              rankingType={video.type}
            />
          </div>
        )}
      </For>
      </div>
    </div>
  );
};
