import { toastStyle } from './toast.css';

export type ToastProps = {
  message: string;
};
export const Toast = (props: ToastProps) => {
  return (
    <div class={toastStyle}>
      {props.message}
    </div>
  );
};