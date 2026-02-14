import { createMemo, mergeProps } from 'solid-js';
import { calculateRefractionSpecular, CONVEX, getDisplacementData } from './liquid-lib';

// function getBezier (bezelType: "convex_circle" | "convex_squircle" | "concave" | "lip") {
//   let surfaceFn;
//   switch (bezelType) {
//     case "convex_circle":
//       surfaceFn = CONVEX_CIRCLE.fn;
//       break;
//     case "convex_squircle":
//       surfaceFn = CONVEX.fn;
//       break;
//     case "concave":
//       surfaceFn = CONCAVE.fn;
//       break;
//     case "lip":
//       surfaceFn = LIP.fn;
//       break;
//     default:
//       surfaceFn = CONVEX.fn;
//   }
//   return surfaceFn;
// }

function imageDataToUrl(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export type LiquidFilterProps = {
  id: string;
  filterOnly?: boolean;
  scaleRatio?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  width: number;
  height: number;
  radius: number;
  /**
   * SVG Gauss gradient applied
   * @default 0.2
   */
  blur?: number;
  /**
   * Glass tickess.
   * Bigger this value is, longer will be the translations.
   * @default 40
   */
  glassThickness?: number;
  /**
   * Width of the non-flat glass surface at the boundaries.
   * @default 20
   */
  bezelWidth?: number;
  /**
   * Value used in the snell law: n1 sin(θ1) = n2 sin(θ2)
   * Water is 1.33
   *
   * @default 1.5
   */
  refractiveIndex?: number;
  /**
   * Opacity of the border
   * @default 0.4
   */
  specularOpacity?: number;
  /**
   * @default 4
   */
  specularSaturation?: number;
  dpr?: number;
  /**
   * Set the profile of the edges.
   * @default CONVEX.fn
   */
  bezelHeightFn?: (x: number) => number;
  // bezelType?: 'convex_circle' | 'convex_squircle' | 'concave' | 'lip';
};

export const LiquidFilter = (props: LiquidFilterProps) => {
  const local = mergeProps(
    {
      filterOnly: false,
      blur: 0.2,
      glassThickness: 40,
      bezelWidth: 20,
      refractiveIndex: 1.5,
      specularOpacity: 1,
      specularSaturation: 4,
      bezelHeightFn: CONVEX.fn,
    },
    props,
  );

  const canvasWidth = () => ~~(local.canvasWidth ? local.canvasWidth : local.width);
  const canvasHeight = () => ~~(local.canvasHeight ? local.canvasHeight : local.height);

  const displacementData = createMemo(() => {
    const devicePixelRatio = local.dpr ?? 1;
    const clampedBezelWidth = Math.max(
      Math.min(local.bezelWidth, 2 * local.radius - 1),
      0,
    );

    return getDisplacementData({
      glassThickness: local.glassThickness,
      bezelWidth: clampedBezelWidth,
      bezelHeightFn: local.bezelHeightFn,
      refractiveIndex: local.refractiveIndex,
      canvasWidth: canvasWidth(),
      canvasHeight: canvasHeight(),
      objectWidth: ~~local.width,
      objectHeight: ~~local.height,
      radius: local.radius,
      dpr: devicePixelRatio,
    });
  });

  const specularLayer = createMemo(() => {
    const devicePixelRatio = local.dpr ?? 1;

    return calculateRefractionSpecular(
      local.width,
      local.height,
      local.radius,
      50,
      undefined,
      devicePixelRatio,
    );
  });

  const displacementMapDataUrl = createMemo(() => imageDataToUrl(displacementData().displacementMap));
  const specularLayerDataUrl = createMemo(() => imageDataToUrl(specularLayer()));
  const scale = () => displacementData().maximumDisplacement * (props.scaleRatio ?? 1);

  const content = (
    <filter id={local.id}>
      <feGaussianBlur
        in={'SourceGraphic'}
        stdDeviation={local.blur}
        result="blurred_source"
      />

      <feImage
        href={displacementMapDataUrl()}
        x={0}
        y={0}
        width={canvasWidth()}
        height={canvasHeight()}
        result="displacement_map"
      />

      <feDisplacementMap
        in="blurred_source"
        in2="displacement_map"
        scale={scale()}
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />

      <feColorMatrix
        in="displaced"
        type="saturate"
        values={local.specularSaturation.toString()}
        result="displaced_saturated"
      />

      <feImage
        href={specularLayerDataUrl()}
        x={0}
        y={0}
        width={canvasWidth()}
        height={canvasHeight()}
        result="specular_layer"
      />

      <feComposite
        in="displaced_saturated"
        in2="specular_layer"
        operator="in"
        result="specular_saturated"
      />

      <feComponentTransfer in="specular_layer" result="specular_faded">
        <feFuncA type="linear" slope={local.specularOpacity} />
      </feComponentTransfer>

      <feBlend in="specular_saturated" in2="displaced" mode="normal" result="withSaturation" />
      <feBlend in="specular_faded" in2="withSaturation" mode="normal" />
    </filter>
  );

  if (local.filterOnly) return content;

  return (
    <svg color-interpolation-filters="sRGB" style={{ display: 'none' }}>
      <defs>{content}</defs>
    </svg>
  );
};
