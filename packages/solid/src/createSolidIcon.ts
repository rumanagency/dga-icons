import type { IconNode } from '@dga-icons/core';

export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  class?: string;
  [key: string]: any;
}

// Solid uses JSX but with a different runtime than React.
// We create a simple function component pattern.
export const createSolidIcon = (iconName: string, iconNode: IconNode) => {
  return (props: IconProps = {}) => {
    const size = props.size || 24;
    const color = props.color || 'currentColor';
    const sw = props.strokeWidth || 2;
    const strokeWidth = props.absoluteStrokeWidth
      ? (Number(sw) * 24) / Number(size)
      : sw;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', String(strokeWidth));
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    const cls = ['dga-icon', `dga-icon-${iconName}`, props.class]
      .filter(Boolean)
      .join(' ');
    svg.setAttribute('class', cls);

    // Apply extra props
    Object.keys(props).forEach((key) => {
      if (
        !['size', 'color', 'strokeWidth', 'absoluteStrokeWidth', 'class'].includes(
          key
        )
      ) {
        svg.setAttribute(key, String(props[key]));
      }
    });

    iconNode.forEach(([tag, attrs]) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([attr, val]) => {
        const kebabAttr = attr
          .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .toLowerCase();
        el.setAttribute(kebabAttr, val);
      });
      svg.appendChild(el);
    });

    return svg;
  };
};
