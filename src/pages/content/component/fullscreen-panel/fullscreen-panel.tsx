import { X } from 'lucide-solid';
import { createSignal, For, JSX, onCleanup, onMount } from 'solid-js';
import { IconButton } from '@/ui/button';
import { Logo } from '../logo';
import * as styles from './fullscreen-panel.css';

const availableBackgroundList = [
  'images/bg/bg_detail_pc.png',
  '2025-summer/images/bg/bg_detail_pc.png',
  '2025-winter/images/bg/bg_detail_pc.png',
  '2024-winter/images/bg/bg_detail_pc.png',
  '2023-summer/images/bg/bg_detail_pc.png',
  '2023-spring/_nuxt/img/bg_detail_pc.503fade.png',
];

export type FullscreenPanelProps = {
  children: JSX.Element;
  onClose: () => void;
};

export const FullscreenPanel = (props: FullscreenPanelProps) => {
  const [backgrounds, setBackgrounds] = createSignal(availableBackgroundList);
  const [effectIndex, setEffectIndex] = createSignal(0);

  onMount(() => {
    const getShuffled = () => {
      const list = [...availableBackgroundList];

      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }

      return list;
    };

    setBackgrounds(getShuffled());
    const interval = setInterval(() => {
      setEffectIndex((prev) => (prev + 1) % availableBackgroundList.length);
      if (effectIndex() === 0) {
        setBackgrounds(getShuffled());
      }
    }, 5000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return (
    <div class={styles.containerStyle}>
      <For each={backgrounds()}>
        {(url, index) => (
          <img
            src={`https://vocaloid-collection.jp/${url}`}
            classList={{
              [styles.imageEffectStyle]: true,
              [styles.imageEffectAnimationStyle.show]:
                index() === effectIndex(),
              [styles.imageEffectAnimationStyle.hide]:
                index() !== effectIndex(),
            }}
            style={{
              'animation-delay': `${(index() - backgrounds().length) * 5}s`,
            }}
          />
        )}
      </For>
      <div class={styles.contentStyle}>
        <div class={styles.headerStyle}>
          <Logo class={styles.logoStyle} />
          <IconButton icon={X} onClick={props.onClose} />
        </div>
        {props.children}
      </div>
    </div>
  );
};
