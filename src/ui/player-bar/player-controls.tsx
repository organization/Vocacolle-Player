import { Show } from 'solid-js';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-solid';

import { IconButton } from '@/ui/button';
import { formatTime } from '@/utils';
import { VideoData } from '@/shared/types';

import { timeStyle } from './player-bar.css';

export type PlayerControllerProps = {
  nowPlaying: VideoData | null;
  progress: number;
  state: 'playing' | 'paused';
  canPrevious: boolean;
  canNext: boolean;

  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
};
export const PlayerController = (props: PlayerControllerProps) => (
  <>
    <IconButton disabled={!props.canPrevious} fill={'currentColor'} icon={SkipBack} onClick={props.onPrevious} />
    <IconButton fill={'currentColor'} icon={props.state === 'playing' ? Pause : Play} onClick={props.onPlayPause} />
    <IconButton disabled={!props.canNext} fill={'currentColor'} icon={SkipForward} onClick={props.onNext} />
    <Show when={props.nowPlaying?.video}>
      {(video) => (
        <>
          <div class={timeStyle}>
            {formatTime(video().duration * props.progress)}
          </div>
          <div class={timeStyle}>/</div>
          <div class={timeStyle}>{formatTime(video().duration)}</div>
        </>
      )}
    </Show>
  </>
);
