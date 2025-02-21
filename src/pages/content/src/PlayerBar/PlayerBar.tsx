import { Show } from "solid-js";

import { PlayInfo } from "../PlayInfo";
import {
  currentVideo,
  playlist,
  setPlaylist,
} from "@pages/content/store/playlist";

import IconPrevious from "../../assets/icon_previous.svg";
import IconPlay from "../../assets/icon_play.svg";
import IconPause from "../../assets/icon_pause.svg";
import IconNext from "../../assets/icon_next.svg";
import IconOpen from "../../assets/icon_open.svg";
import IconExpand from "../../assets/icon_expand.svg";
import IconClose from "../../assets/icon_close.svg";

import {
  centerContainerStyle,
  containerStyle,
  fixedStyle,
  iconButtonStyle,
  iconExpandStyle,
  iconStyle, progressStyle, progressVar,
  wrapperAnimationStyle,
  wrapperStyle,
} from './PlayerBar.css';
import { player, setPlayer } from "@pages/content/store/player";
import { Portal } from "solid-js/web";
import { PlayerPanel } from "@pages/content/src/PlayerPanel";
import { assignInlineVars } from '@vanilla-extract/dynamic';

export const PlayerBar = () => {
  const onPrevious = () => {
    setPlaylist("currentIndex", (prev) => Math.max(0, prev - 1));
  };
  const onPlayPause = () => {
    setPlayer("state", player.state === "playing" ? "paused" : "playing");
  };
  const onNext = () => {
    setPlaylist("currentIndex", (prev) =>
      Math.min(prev + 1, playlist.playlist.length - 1)
    );
  };

  const onOpen = () => {
    const video = currentVideo();
    if (!video) return;

    window.open(`https://www.nicovideo.jp/watch/${video.id}`);
  };
  const onExpand = () => {
    setPlayer("mode", player.mode === "bar" ? "full" : "bar");
  };
  const onClose = () => {
    setPlayer((prev) => ({
      ...prev,
      state: "paused",
      mode: "bar",
      progress: 0,
    }));
    setPlaylist({
      currentIndex: 0,
      playlist: [],
    });
  };

  return (
    <div class={fixedStyle}>
      <Portal>
        <PlayerPanel />
      </Portal>
      <div
        classList={{
          [wrapperStyle]: true,
          [wrapperAnimationStyle.enter]: currentVideo(),
          [wrapperAnimationStyle.exit]: !currentVideo(),
        }}
      >
        <div
          class={progressStyle}
          style={assignInlineVars({
            [progressVar]: `${player.progress}`,
          })}
        />
        <div class={containerStyle}>
          <button class={iconButtonStyle} onClick={onPrevious}>
            <IconPrevious class={iconStyle} />
          </button>
          <button class={iconButtonStyle} onClick={onPlayPause}>
            <Show
              when={player.state === "playing"}
              fallback={<IconPlay class={iconStyle} />}
            >
              <IconPause class={iconStyle} />
            </Show>
          </button>
          <button class={iconButtonStyle} onClick={onNext}>
            <IconNext class={iconStyle} />
          </button>
        </div>
        <div class={centerContainerStyle}>
          <Show when={currentVideo()}>
            {(video) => (
              <PlayInfo
                ranking={playlist.currentIndex + 1}
                title={video().title}
                artist={video().owner.name}
                album={video().thumbnail.url}
              />
            )}
          </Show>
        </div>
        <div class={containerStyle}>
          <button class={iconButtonStyle} onClick={onOpen}>
            <IconOpen class={iconStyle} />
          </button>
          <button class={iconButtonStyle} onClick={onExpand}>
            <IconExpand
              classList={{
                [iconStyle]: true,
                [iconExpandStyle]: player.mode === "full",
              }}
            />
          </button>
          <button class={iconButtonStyle} onClick={onClose}>
            <IconClose class={iconStyle} />
          </button>
        </div>
      </div>
    </div>
  );
};
