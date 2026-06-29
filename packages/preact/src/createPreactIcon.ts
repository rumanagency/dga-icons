import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import type { IconNode } from '@dga-icons/core';

export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  class?: string;
  [key: string]: any;
}

export const createPreactIcon = (iconName: string, iconNode: IconNode) => {
  const Component = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        size = 24,
        color = 'currentColor',
        strokeWidth = 2,
        absoluteStrokeWidth = false,
        class: className,
        children,
        ...restProps
      },
      ref,
    ) => {
      const computedStrokeWidth = absoluteStrokeWidth
        ? (Number(strokeWidth) * 24) / Number(size)
        : strokeWidth;

      return h(
        'svg',
        {
          ref,
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: color,
          'stroke-width': computedStrokeWidth,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          class: ['dga-icon', `dga-icon-${iconName}`, className]
            .filter(Boolean)
            .join(' '),
          ...restProps,
        },
        ...iconNode.map(([tag, attrs]) => h(tag, attrs)),
        ...(children ? [children] : []),
      );
    },
  );

  Component.displayName = iconName;

  return Component;
};
