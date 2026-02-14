import { JSX } from 'solid-js/jsx-runtime';

export const cx = (...classNames: (string | boolean | undefined)[]) =>
  classNames.filter(Boolean).join(' ');
export const cl = (...classLists: Record<string, boolean>[]) =>
  classLists
    .map((classList) =>
      Object.entries(classList)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(' ')
    )
    .join(' ');

type Maybe<T> = T | undefined | null;
type ClxObject = Record<string, boolean | undefined> | string;
export const clx = (...clxObjects: Maybe<ClxObject>[]) =>
  clxObjects
    .map((clxObject) => {
      if (typeof clxObject === 'string') return clxObject;
      if (typeof clxObject === 'object' && clxObject) {
        return Object.entries(clxObject)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }

      return '';
    })
    .join(' ');

export const sx = <Element extends HTMLElement>(
  ...styles: JSX.HTMLAttributes<Element>['style'][]
): string => {
  let result: string[] = [];

  styles.forEach((style) => {
    if (!style) return;

    if (typeof style === 'string') {
      result.push(style);
    } else if (Array.isArray(style)) {
      result.push(sx(...style));
    } else if (typeof style === 'object') {
      Object.keys(style).forEach((key) => {
        result.push(`${key}: ${style[key as keyof typeof style]}`);
      });
    }
  });

  return result.map((it) => it[it.length - 1] === ';' ? it.trim() : `${it.trim()};`).join('\n');
};