import {
  batch,
  createEffect,
  createSignal,
  For,
  type JSX,
  on,
  Show,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import {
  backdropStyle,
  backdropAnimation,
  wrapperStyle,
  wrapperAnimation,
  titleStyle,
  descriptionStyle,
  actionStyle,
  actionContainerStyle,
} from './dialog.css';

type DialogAction = {
  id: string;
  type?: keyof typeof actionStyle;
  label: string;
  autoFocus?: boolean;
};
export type DialogProps = {
  open?: boolean;
  onClose?: () => void;

  title?: string;
  description?: string;
  actions?: DialogAction[];
  onAction?: (id: string) => void;

  children?: JSX.Element;
  closable?: boolean;
  zIndex?: number;
};
export const Dialog = (props: DialogProps) => {
  const [open, setOpen] = createSignal(props.open ?? false);
  const [enter, setEnter] = createSignal(false);
  const [exit, setExit] = createSignal(false);
  const [element, setElement] = createSignal<HTMLElement | null>(null);

  let backdropClickFlag = false;

  const cleanUp = () => {
    const popup = element();

    setExit(false);
    setOpen(false);

    popup?.removeEventListener('animationend', cleanUp);
    popup?.removeEventListener('animationcancel', cleanUp);
  };

  createEffect(
    on(
      () => props.open,
      async (isOpen) => {
        if (isOpen) {
          cleanUp();

          batch(() => {
            setOpen(true);
            setExit(false);
            setEnter(true);
          });
        } else {
          const overlay = element();
          if (!overlay) return;

          batch(() => {
            setEnter(false);
            setExit(true);
          });

          requestAnimationFrame(() => {
            overlay.addEventListener('animationend', cleanUp, { once: true });
            overlay.addEventListener('animationcancel', cleanUp, {
              once: true,
            });
          });
        }
      }
    )
  );

  return (
    <Show when={open()}>
      <Portal>
        <div
          ref={setElement}
          classList={{
            [backdropStyle]: true,
            [backdropAnimation.enter]: enter(),
            [backdropAnimation.exit]: exit(),
          }}
          style={
            props.zIndex === undefined ? undefined : { 'z-index': props.zIndex }
          }
          onPointerDown={(event) => {
            if (event.target === element()) backdropClickFlag = true;
          }}
          onPointerMove={(event) => {
            if (backdropClickFlag && event.target !== element())
              backdropClickFlag = false;
          }}
          onPointerCancel={() => {
            backdropClickFlag = false;
          }}
          onPointerLeave={() => {
            backdropClickFlag = false;
          }}
          onPointerUp={() => {
            if (backdropClickFlag && (props.closable ?? true))
              props.onClose?.();
            backdropClickFlag = false;
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Escape' || !(props.closable ?? true)) return;
            event.preventDefault();
            event.stopPropagation();
            props.onClose?.();
          }}
        >
          <div
            classList={{
              [wrapperStyle]: true,
              [wrapperAnimation.enter]: enter(),
              [wrapperAnimation.exit]: exit(),
            }}
            role="dialog"
            aria-modal="true"
          >
            <Show when={props.title}>
              <h2 class={titleStyle}>{props.title}</h2>
            </Show>
            <Show when={props.description}>
              <p class={descriptionStyle}>{props.description}</p>
            </Show>
            {props.children}
            <Show when={props.actions}>
              <div class={actionContainerStyle}>
                <For each={props.actions}>
                  {(action) => (
                    <button
                      class={actionStyle[action.type ?? 'default']}
                      ref={(element) => {
                        if (action.autoFocus)
                          queueMicrotask(() => element.focus());
                      }}
                      onClick={() => props.onAction?.(action.id)}
                    >
                      {action.label}
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
