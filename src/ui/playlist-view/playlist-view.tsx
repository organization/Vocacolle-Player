import { For, JSX } from 'solid-js';

import { VideoData } from '@/shared/types';

import { PlayInfo } from '../play-info';

import { containerStyle } from './playlist-view.css';

export type PlaylistViewProps = {
  playlist: VideoData[];

  children?: JSX.Element;
};
export const PlaylistView = (props: PlaylistViewProps) => {
  return (
    <div
      class={containerStyle}
    >
      {props.children}
      <For each={props.playlist}>
        {(video) => (
          <PlayInfo
            title={video.video.title}
            artist={video.video.owner.name}
            album={video.video.thumbnail.url}
            ranking={video.ranking}
            rankingType={video.type}
          />
        )}
      </For>
    </div>
  );
};
