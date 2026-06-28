import { forwardRef, createElement } from 'react';
import type { IconNode } from '@dga-icons/core';
import type { DgaIconProps } from './types';

/**
 * Factory function to create a DGA Icon React component from icon data.
 *
 * This is the equivalent of Lucide's `createLucideIcon`. Each icon is
 * generated as a call to this function with its specific SVG node data.
 *
 * @param iconName - The kebab-case name of the icon (used for CSS classes)
 * @param iconNode - The IconNode array containing SVG element data
 * @returns A React forwardRef component
 *
 * @example
 * ```tsx
 * import { createDgaIcon } from '@dga-icons/react';
 *
 * const CustomIcon = createDgaIcon('custom-icon', [
 *   ["path", { d: "M12 2L2 22h20L12 2z", fill: "currentColor" }]
 * ]);
 * ```
 */
export function createDgaIcon(iconName: string, iconNode: IconNode) {
  const Component = forwardRef<SVGSVGElement, DgaIconProps>(
    (
      {
        size = 24,
        color = 'currentColor',
        strokeWidth = 1.5,
        absoluteStrokeWidth = false,
        className,
        children,
        ...restProps
      },
      ref,
    ) => {
      // Calculate stroke width
      const computedStrokeWidth = absoluteStrokeWidth
        ? (Number(strokeWidth) * 24) / Number(size)
        : strokeWidth;

      return createElement(
        'svg',
        {
          ref,
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          className: ['dga-icon', `dga-icon-${iconName}`, className]
            .filter(Boolean)
            .join(' '),
          ...restProps,
        },
        ...iconNode.map(([tag, attrs], i) =>
          createElement(tag, {
            key: `dga-${i}`,
            ...attrs,
            // Override color-related attributes if the user specified color
            ...(attrs.stroke && attrs.stroke !== 'none'
              ? { stroke: color }
              : {}),
            ...(attrs.fill && attrs.fill === 'currentColor'
              ? { fill: color }
              : {}),
            // Apply computed stroke width where applicable
            ...(attrs.strokeWidth ? { strokeWidth: computedStrokeWidth } : {}),
          }),
        ),
        ...(children ? [children] : []),
      );
    },
  );

  Component.displayName = iconName;

  return Component;
}
