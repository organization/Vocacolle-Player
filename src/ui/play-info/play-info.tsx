import { Show } from 'solid-js';

import { rankingTypeToText } from '@/utils/convert';
import { cx } from '@/utils';

import {
  albumIconStyle,
  artistStyle,
  clickableAlbumStyle,
  containerStyle,
  imageStyle,
  indexStyle,
  rankingStyle,
  textContainerStyle,
  titleStyle,
} from './play-info.css';
import { MoveDiagonal } from 'lucide-solid';

export type PlayInfoProps = {
  ranking?: number;
  rankingType?: string | null;
  index?: number;
  title: string;
  artist: string;
  album: string;
  class?: string;

  onAlbumClick?: () => void;
};
export const PlayInfo = (props: PlayInfoProps) => {
  return (
    <div class={cx(containerStyle, props.class)}>
      <Show when={props.index}>
        <div class={indexStyle}>{props.index}</div>
      </Show>
      <div
        classList={{
          [clickableAlbumStyle]: !!props.onAlbumClick,
        }}
      >
        <Show when={!!props.onAlbumClick}>
          <MoveDiagonal class={albumIconStyle} />
        </Show>
        <img
          class={imageStyle}
          src={props.album}
          alt="album"
          onClick={props.onAlbumClick}
        />
      </div>
      <div class={textContainerStyle}>
        <div class={titleStyle}>{props.title}</div>
        <div class={artistStyle}>{props.artist}</div>
      </div>
      <Show when={props.ranking}>
        {(ranking) => (
          <div
            classList={{
              [rankingStyle['1']]: ranking() === 1,
              [rankingStyle['2']]: ranking() === 2,
              [rankingStyle['3']]: ranking() === 3,
              [rankingStyle['in10']]: ranking() > 3 && ranking() <= 10,
              [rankingStyle['in100']]: ranking() > 10,
            }}
          >
            {rankingTypeToText(props.rankingType ?? null)} #{props.ranking}
          </div>
        )}
      </Show>
    </div>
  );
};
