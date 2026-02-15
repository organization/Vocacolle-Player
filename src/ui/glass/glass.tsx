// This effect is based on https://kube.io/blog/liquid-glass-css-svg/
// This component is based on https://creatorem.com/docs/ui/motion/liquid-glass

import { Accessor, batch, createEffect, createMemo, createRenderEffect, createSignal, createUniqueId, JSX, mergeProps, on } from 'solid-js';
import { LiquidFilter, LiquidFilterProps } from './filter';
import { clx, cx, sx } from '../../utils';

/**
 * Safely parse border radius from computed styles, handling edge cases like
 * scientific notation (from rounded-full), percentages, and invalid values.
 * For very large values or scientific notation, returns half of the smallest dimension.
 */
const getBorderRadius = (element: HTMLElement, rect: DOMRect): number => {
  const computedStyle = getComputedStyle(element);
  const rawRadius = computedStyle.borderRadius;

  if (!rawRadius || rawRadius === '0px') {
    return 0;
  }

  const parsedRadius = parseFloat(rawRadius);

  if (isNaN(parsedRadius)) {
    return 0;
  }

  // Handle scientific notation (e.g., '1.67772e+07px' from rounded-full) or very large values
  if (parsedRadius > 9999 || rawRadius.includes('e+') || rawRadius.includes('E+')) {
    // For very large values (like rounded-full), return half of smallest dimension
    return Math.min(rect.width, rect.height) / 2;
  }

  return parsedRadius;
};

const useMotionSizeObservers = <T extends HTMLElement = HTMLDivElement>(
  containerRef: Accessor<T | null>,
  disabled: Accessor<boolean> = () => false
) => {
  // Use motion values with built-in spring animations and safe initial values
  // Lower stiffness and higher damping to prevent oscillations
  const [width, setWidth] = createSignal(1);
  const [height, setHeight] = createSignal(1);
  const [borderRadius, setBorderRadius] = createSignal(0);

  // Ref to prevent infinite update loops
  let isUpdating = false;

  // Update dimensions and border radius
  const updateDimensions = () => {
    const container = containerRef();
    if (!container || disabled() || isUpdating) return;

    isUpdating = true;

    const rect = container.getBoundingClientRect();
    const borderRadiusValue = getBorderRadius(container, rect);

    // Only update if values have actually changed to prevent infinite loops
    const newWidth = Math.max(rect.width, 1);
    const newHeight = Math.max(rect.height, 1);
    const newRadius = Math.max(borderRadiusValue, 0);

    batch(() => {
      if (Math.abs(width() - newWidth) > 0.5) {
        setWidth(~~newWidth);
      }
      if (Math.abs(height() - newHeight) > 0.5) {
        setHeight(~~newHeight);
      }
      if (Math.abs(borderRadius() - newRadius) > 0.5) {
        setBorderRadius(~~newRadius);
      }
    });

    // Reset the updating flag after a short delay
    setTimeout(() => {
      isUpdating = false;
    }, 16);
  };

  // Observe size changes
  createRenderEffect(on(
    () => [disabled(), containerRef()] as const,
    ([disabled, container]) => {
      if (!container || disabled) return;

      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateDimensions);
      });

      resizeObserver.observe(container);

      // Initial measurement
      updateDimensions();

      return () => {
        resizeObserver.disconnect();
      };
    },
  ));

  // Watch for border radius changes through MutationObserver
  createEffect(on(
    () => [disabled(), containerRef()] as const,
    ([disabled, container]) => {
      if (!container || disabled) return;

      let timeoutId: NodeJS.Timeout;
      const mutationObserver = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateDimensions, 100); // Debounce mutations
      });

      mutationObserver.observe(container, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      return () => {
        clearTimeout(timeoutId);
        mutationObserver.disconnect();
      };
    },
  ));

  return {
    width,
    height,
    borderRadius,
  };
};

export interface LiquidGlassProps<T extends HTMLElement = HTMLDivElement>
  extends Pick<
    LiquidFilterProps,
    | 'glassThickness'
    | 'bezelWidth'
    | 'blur'
    | 'bezelHeightFn'
    | 'refractiveIndex'
    | 'specularOpacity'
    | 'specularSaturation'
    | 'dpr'
  > {
  targetRef?: T;
  width?: number;
  height?: number;
  borderRadius?: number;
}
export const useLiquidSurface = <T extends HTMLElement = HTMLDivElement>(options: Accessor<LiquidGlassProps<T>>) => {
  const filterId = `glass-${createUniqueId()}`;
  const [rawRef, setRawRef] = createSignal<HTMLElement | null>(null);
  const ref = () => options().targetRef ?? rawRef();

  // Use motion value props if provided, otherwise fall back to size observers
  const usePropValues = () => !!(options().width && options().height && options().borderRadius);
  const {
    width: observedWidth,
    height: observedHeight,
    borderRadius: observedRadius,
  } = useMotionSizeObservers(ref, usePropValues);

  // Use the provided motion values or the observed ones
  const finalWidth = () => usePropValues() ? options().width! : observedWidth();
  const finalHeight = () => usePropValues() ? options().height! : observedHeight();
  const finalRadius = () => usePropValues() ? options().borderRadius! : observedRadius();

  const Filter = () => (
    <LiquidFilter id={filterId} width={finalWidth()} height={finalHeight()} radius={finalRadius()} {...options()} />
  );

  const filterStyles = () => ({
    'backdrop-filter': `url(#${filterId})`,
    '-webkit-backdrop-filter': `url(#${filterId})`,
  });

  return {
    filterId,
    filterStyles,
    onRegister: (el: T) => setRawRef(el as HTMLElement),
    Filter,
  };
};

export const LiquidGlass = (props: LiquidGlassProps & JSX.HTMLAttributes<HTMLDivElement>) => {
  const local = mergeProps(
    {
      dpr: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    },
    props,
  );

  const { filterStyles, filterId, Filter, onRegister } = useLiquidSurface(() => ({
    glassThickness: local.glassThickness,
    bezelWidth: local.bezelWidth,
    blur: local.blur,
    bezelHeightFn: local.bezelHeightFn,
    refractiveIndex: local.refractiveIndex,
    specularOpacity: local.specularOpacity,
    specularSaturation: local.specularSaturation,
    dpr: local.dpr,
    targetRef: local.targetRef,
    width: local.width,
    height: local.height,
    borderRadius: local.borderRadius,
  }));

  createEffect(() => {
    if (local.targetRef) local.targetRef.style.backdropFilter = `url(#${filterId})`;
  });

  return (
    <>
      <Filter />
      {!local.targetRef && (
        <LiquidDiv
          {...local}
          style={sx(filterStyles(), local.style)}
          filterId={filterId}
          ref={onRegister}
        >
          {local.children}
        </LiquidDiv>
      )}
    </>
  );
};

type LiquidDivProps = { filterId: string } & JSX.HTMLAttributes<HTMLDivElement>;
const LiquidDiv = (props: LiquidDivProps) => {
  const isLiquidSupported = createMemo(on(() => navigator.userAgent, () => {
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {
      return false;
    }

    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${props.filterId})`;
    return div.style.backdropFilter !== '';
  }));

  return (
    <div
      {...props}
      class={clx(isLiquidSupported() ? '' : 'border', props.class, props.classList)}
      style={sx(
        isLiquidSupported()
          ? {}
          : {
            'backdrop-filter': 'blur(4px)',
            '-webkit-backdrop-filter': 'blur(4px)',
          },
        props.style,
      )}
    >
      {props.children}
    </div>
  );
};
