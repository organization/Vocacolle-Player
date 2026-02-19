import { Show } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  ExternalLink,
  ListMusic,
  X,
} from 'lucide-solid';

import { IconButton } from '@/ui/button';
import { useLiquidSurface } from '@/ui/glass';
import { PlayInfo } from '@/ui/play-info';

import { useProgressDrag } from './use-progress-drag';
import { PlayerController, PlayerControllerProps } from './player-controls';

import {
  centerContainerStyle,
  containerStyle,
  glassFilter,
  playerBarInfoStyle,
  progressStyle,
  progressVar,
  wrapperStyle,
} from './player-bar.css';

export type PlayerBarProps = PlayerControllerProps & {
  playlistIndex: number;

  onOpen: () => void;
  onPlaylist: () => void;
  onClose: () => void;
  onAlbumClick: () => void;
  onProgressChange: (progress: number) => void;
};
export const PlayerBar = (props: PlayerBarProps) => {
  const { movingProgress, isMoving, props: dragProps } = useProgressDrag({
    initProgress: props.progress,
    onProgressChange: props.onProgressChange,
  });
  const { filterId, Filter, onRegister } = useLiquidSurface(() => ({
    glassThickness: 80,
    bezelWidth: 20,
    refractiveIndex: 1.5,
    blur: 2,
    specularOpacity: 0.8,
  }));

  const progress = () => movingProgress() ?? props.progress;

  return (
    <>
      <Filter />
      <div
        ref={(el) => {
          onRegister(el);
          dragProps.ref(el);
        }}
        class={wrapperStyle}
        style={assignInlineVars({
          [glassFilter]: `url(#${filterId})`,
        })}
        onPointerDown={dragProps.onPointerDown}
        onPointerMove={dragProps.onPointerMove}
        onPointerEnter={dragProps.onPointerEnter}
        onPointerLeave={dragProps.onPointerLeave}
      >
        <div
          class={progressStyle}
          style={assignInlineVars({
            [progressVar]: `${progress()}`,
            transition: isMoving() ? 'unset' : undefined,
          })}
        />
        <div class={containerStyle}>
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
        </div>
        <div class={centerContainerStyle}>
          <Show when={props.nowPlaying} keyed>
            {(videoData) => (
              <>
                <div class={playerBarInfoStyle}>
                  <PlayInfo
                    rankingType={videoData.type}
                    ranking={videoData.ranking}
                    index={props.playlistIndex + 1}
                    title={videoData.video.title}
                    artist={videoData.video.owner.name}
                    album={videoData.video.thumbnail.url}
                    onAlbumClick={props.onAlbumClick}
                  />
                </div>
                <IconButton icon={ExternalLink} onClick={props.onOpen} />
              </>
            )}
          </Show>
        </div>
        <div class={containerStyle}>
          <IconButton
            icon={ListMusic}
            onClick={props.onPlaylist}
          />
          <IconButton
            icon={X}
            onClick={props.onClose}
          />
        </div>
      </div>
    </>
  );
};
