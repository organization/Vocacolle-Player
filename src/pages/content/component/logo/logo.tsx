import { Dynamic } from 'solid-js/web';
import type { JSX } from 'solid-js/jsx-runtime';

import { Logo2026Summer } from './logo-2026-summer';
import { Logo2026Winter } from './logo-2026-winter';
import { Logo2025Summer } from './logo-2025-summer';
import { Logo2025Winter } from './logo-2025-winter';
import { Logo2024Winter } from './logo-2024-winter';

import { getOldType } from '../../api/ranking';

const LatestLogo = Logo2026Summer;

export type LogoProps = JSX.SvgSVGAttributes<SVGSVGElement>;
const LogoMapper: Record<string, (props: LogoProps) => JSX.Element> = {
  '2026-summer': Logo2026Summer,
  '2026-winter': Logo2026Winter,
  '2025-summer': Logo2025Summer,
  '2025-winter': Logo2025Winter,
  '2024-winter': Logo2024Winter,
};

export const Logo = (props: LogoProps) => {
  const component = () => {
    const type = getOldType();
    if (!type) return LatestLogo;

    return LogoMapper[type] ?? LatestLogo;
  };

  return <Dynamic component={component()} {...props} />;
};
