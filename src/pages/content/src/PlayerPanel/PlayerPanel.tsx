import {
  fixedStyle,
  iframeStyle,
  itemStyle,
  playlistAnimationStyle,
  playlistStyle,
  selectedItemStyle,
  videoStyle,
  videoAnimationStyle,
} from "./PlayerPanel.css";
import { createEffect, For, on, Show } from 'solid-js';
import {
  currentVideo,
  playlist,
  setPlaylist,
} from "@pages/content/store/playlist";
import { PlayInfo } from "@pages/content/src";
import { player } from "@pages/content/store/player";

export const PlayerPanel = () => {
  const elements: HTMLElement[] = [];

  createEffect(on(() => playlist.currentIndex, (index) => {
    elements[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }));

  return (
    <div class={fixedStyle}>
      <Show when={currentVideo()}>
        {(video) => (
          <div
            classList={{
              [videoStyle]: true,
              [videoAnimationStyle.enter]: player.mode === "full",
              [videoAnimationStyle.exit]: player.mode === "bar",
            }}
          >
            <iframe
              id={"vcp-iframe"}
              src={`https://embed.nicovideo.jp/watch/${
                video().id
              }?persistence=1&oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1`}
              class={iframeStyle}
            />
          </div>
        )}
      </Show>
      <div
        classList={{
          [playlistStyle]: true,
          [playlistAnimationStyle.enter]: player.mode === "full",
          [playlistAnimationStyle.exit]: player.mode === "bar",
        }}
      >
        <For each={playlist.playlist}>
          {(video, index) => (
            <div
              ref={(el) => elements[index()] = el}
              classList={{
                [itemStyle]: true,
                [selectedItemStyle]: playlist.currentIndex === index(),
              }}
              onClick={() => setPlaylist("currentIndex", index())}
            >
              <PlayInfo
                ranking={index() + 1}
                title={video.title}
                artist={video.owner.name}
                album={video.thumbnail.url}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
