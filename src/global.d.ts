import Chrome from "chrome";

declare namespace chrome {
  export default Chrome;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const content: string;

  export default content;
}
declare module '*.svg' {
  import type { Component, ComponentProps } from 'solid-js'
  const c: Component<ComponentProps<'svg'>>

  export default c;
}
