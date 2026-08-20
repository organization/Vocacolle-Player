import { Dynamic } from 'solid-js/web';
import type { JSX } from 'solid-js/jsx-runtime';

import { Logo2026Summer } from './logo-2026-summer';
import { Logo2026Winter } from './logo-2026-winter';

import { getOldType } from '../../api/ranking';

const LatestLogo = Logo2026Summer;

export type LogoProps = JSX.SvgSVGAttributes<SVGSVGElement>;
const LogoMapper: Record<string, (props: LogoProps) => JSX.Element> = {
  '2026-summer': Logo2026Summer,
  '2026-winter': Logo2026Winter,
};

export const Logo = (props: LogoProps) => {
  const component = () => {
    const type = getOldType();
    if (!type) return LatestLogo;

    return LogoMapper[type] ?? LatestLogo;
  };

  return <Dynamic component={component()} {...props} />;
};
