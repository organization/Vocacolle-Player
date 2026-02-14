import { createEffect, createSignal, For, JSX } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Portal } from 'solid-js/web';

import { Toast, ToastProps } from './toast';
import { useLiquidSurface } from '../glass';

import { glassFilter, toastContainerStyle } from './toast.css';

type ToastData = ToastProps & { id: number };

const [list, setList] = createSignal<ToastData[]>([]);

type ToastProviderProps = {
  children: JSX.Element;
};
export const ToastProvider = (props: ToastProviderProps) => {
  const timeoutSet = new Map<number, number>();

  createEffect(() => {
    const last = list().at(-1);
    if (!last) return;

    if (timeoutSet.has(last.id)) return;
    const timeout = window.setTimeout(() => {
      setList((prev) => prev.filter((it) => it.id !== last.id));
      timeoutSet.delete(last.id);
    }, 3000);
    timeoutSet.set(last.id, timeout);
  });

  const { filterId, Filter } = useLiquidSurface(() => ({
    width: 500,
    height: 50,
    borderRadius: 12,
    blur: 2,
  }));

  return (
    <>
      {props.children}
      <Filter />
      <Portal>
        <div
          class={toastContainerStyle}
          style={assignInlineVars({
            [glassFilter]: `url(#${filterId})`,
          })}
        >
          <For each={list()}>{(item) => <Toast {...item} />}</For>
        </div>
      </Portal>
    </>
  );
};

export const addToast = (toast: ToastProps) => {
  setList((prev) => [
    ...prev,
    {
      ...toast,
      id: Date.now(),
    },
  ]);
};
