import { icons, LucideProps } from 'lucide-solid';
import { Dynamic } from 'solid-js/web';

import { clx } from '@/utils';

import { iconButtonStyle, iconStyle } from './icon-button.css';
import { splitProps } from 'solid-js';

type IconButtonProps = LucideProps & {
  icon: typeof icons[keyof typeof icons];
  onClick?: () => void;
};
export const IconButton = (props: IconButtonProps) => {
  const [local, rest] = splitProps(props, ['icon', 'onClick', 'class', 'classList']);
  
  return (
    <button class={iconButtonStyle} onClick={local.onClick}>
      <Dynamic
        {...rest}
        component={local.icon}
        class={clx(iconStyle, local.class, local.classList)}
      />
    </button>
  );
};
