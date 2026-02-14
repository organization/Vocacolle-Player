import { LiquidGlass } from '@/ui/glass';

import { toastStyle } from './toast.css';

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
