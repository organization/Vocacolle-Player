import { assignInlineVars } from '@vanilla-extract/dynamic';
import { ExternalLink } from 'lucide-solid';
import { JSX } from 'solid-js/jsx-runtime';

import { IconButton } from '@/ui/button';
import {
  PlayerController,
  PlayerControllerProps,
  useProgressDrag,
} from '@/ui/player-bar';
import { PlaylistView, PlaylistViewProps } from '@/ui/playlist-view';

import { getOldType } from '../../api/ranking';
import { FullscreenPanel } from '../fullscreen-panel';

import {
  hoverProgressStyle,
  progressStyle,
  progressVar,
} from '@/ui/player-bar/player-bar.css';
import {
  playlistTitleStyle,
  playlistWrapperStyle,
  progressWrapperStyle,
  sectionStyle,
  toolbarStyle,
} from './video-panel.css';

export type VideoPanelProps = PlayerControllerProps &
  Omit<PlaylistViewProps, 'nowPlayingId'> & {
    children?: JSX.Element;
    playlistIndex: number;
    onOpen: () => void;
    onClose: () => void;
    onProgressChange: (progress: number) => void;
  };
export const VideoPanel = (props: VideoPanelProps) => {
  const {
    movingProgress,
    hoverProgress,
    isMoving,
    props: dragProps,
  } = useProgressDrag({
    initProgress: props.progress,
    onProgressChange: props.onProgressChange,
  });

  const progress = () => movingProgress() ?? props.progress;
  const season = () => getOldType();

  return (
    <FullscreenPanel onClose={props.onClose}>
      <div class={sectionStyle}>
        {props.children}
        <div class={playlistWrapperStyle}>
          <PlaylistView
            nowPlayingId={props.nowPlaying?.video.id}
            playlist={props.playlist}
            onVideo={props.onVideo}
          >
            <h2 class={playlistTitleStyle}>
              재생목록 ({props.playlistIndex + 1} / {props.playlist.length})
            </h2>
          </PlaylistView>
        </div>
      </div>
      <div class={toolbarStyle}>
        <PlayerController
          nowPlaying={props.nowPlaying}
          state={props.state}
          canPrevious={props.canPrevious}
          canNext={props.canNext}
          onPrevious={props.onPrevious}
          onPlayPause={props.onPlayPause}
          onNext={props.onNext}
          progress={progress()}
        />
        <div {...dragProps} class={progressWrapperStyle}>
          <div
            class={hoverProgressStyle}
            style={assignInlineVars({
              [progressVar]: `${hoverProgress() ?? 0}`,
            })}
          />
          <div
            class={progressStyle}
            style={assignInlineVars({
              [progressVar]: `${progress()}`,
              transition: isMoving() ? 'unset' : undefined,
            })}
            data-season={season()}
          />
        </div>
        <IconButton icon={ExternalLink} onClick={props.onOpen} />
      </div>
    </FullscreenPanel>
  );
};
