import { LiquidGlass } from '../glass';
import { toastStyle } from './Toast.css';

export type ToastProps = {
  message: string;
};
export const Toast = (props: ToastProps) => (
  <LiquidGlass
    width={500}
    height={50}
    borderRadius={12}
    blur={2}
    class={toastStyle}
  >
    {props.message}
  </LiquidGlass>
);
