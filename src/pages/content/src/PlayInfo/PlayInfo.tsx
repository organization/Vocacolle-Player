import {
  artistStyle,
  containerStyle,
  imageStyle,
  rankingStyle,
  textContainerStyle,
  titleStyle,
} from './PlayInfo.css';

export type PlayInfoProps = {
  ranking: number;
  title: string;
  artist: string;
  album: string;
};
export const PlayInfo = (props: PlayInfoProps) => {
  return (
    <div class={containerStyle}>
      <div
        classList={{
          [rankingStyle['1']]: props.ranking === 1,
          [rankingStyle['2']]: props.ranking === 2,
          [rankingStyle['3']]: props.ranking === 3,
          [rankingStyle['in10']]: props.ranking > 3 && props.ranking <= 10,
          [rankingStyle['in100']]: props.ranking > 10,
        }}
      >
        #{props.ranking}
      </div>
      <img class={imageStyle} src={props.album} alt="album" />
      <div class={textContainerStyle}>
        <div class={titleStyle}>{props.title}</div>
        <div class={artistStyle}>{props.artist}</div>
      </div>
    </div>
  );
};
