import { createEffect, createSignal, For, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { Toast, ToastProps } from './Toast';
import { toastContainerStyle } from './Toast.css';

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
      // setList((prev) => prev.filter((it) => it.id !== last.id));
      timeoutSet.delete(last.id);
    }, 3000);
    timeoutSet.set(last.id, timeout);
  });

  return (
    <>
      {props.children}
      <Portal>
        <div class={toastContainerStyle}>
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
