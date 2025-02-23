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
