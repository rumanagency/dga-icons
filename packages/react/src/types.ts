import type { SVGAttributes, RefAttributes } from 'react';

/**
 * Props accepted by all DGA Icon components.
 */
export interface DgaIconProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'ref'>,
    RefAttributes<SVGSVGElement> {
  /**
   * The width and height of the icon in pixels.
   * @default 24
   */
  size?: number | string;

  /**
   * The color of the icon.
   * @default "currentColor"
   */
  color?: string;

  /**
   * The stroke width of the icon (for stroke-based styles).
   * @default 1.5
   */
  strokeWidth?: number | string;

  /**
   * When true, maintains a constant stroke width regardless of icon size.
   * @default false
   */
  absoluteStrokeWidth?: boolean;
}
