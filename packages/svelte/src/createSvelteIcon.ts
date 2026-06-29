import type { IconNode } from '@dga-icons/core';

export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  class?: string;
  [key: string]: any;
}

export const createSvelteIcon = (iconName: string, iconNode: IconNode) => {
  // Svelte "headless" component factory — returns a render function
  // that creates an SVG element (works with Svelte's {@html} or action pattern)
  return (node: HTMLElement, props: IconProps = {}) => {
    function render(props: IconProps = {}) {
      const size = props.size || 24;
      const color = props.color || 'currentColor';
      const sw = props.strokeWidth || 2;
      const strokeWidth = props.absoluteStrokeWidth
        ? (Number(sw) * 24) / Number(size)
        : sw;

      const children = iconNode
        .map(([tag, attrs]) => {
          const attrStr = Object.entries(attrs)
            .map(([k, v]) => {
              const kebab = k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
              return `${kebab}="${v}"`;
            })
            .join(' ');
          return `<${tag} ${attrStr}/>`;
        })
        .join('');

      const cls = ['dga-icon', `dga-icon-${iconName}`, props.class]
        .filter(Boolean)
        .join(' ');

      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${cls}">${children}</svg>`;
    }

    node.innerHTML = render(props);

    return {
      update(newProps: IconProps) {
        node.innerHTML = render(newProps);
      },
      destroy() {
        node.innerHTML = '';
      },
    };
  };
};

/**
 * Generate a raw SVG string for a given icon — useful with {@html} in Svelte.
 */
export const createSvelteIconString = (iconName: string, iconNode: IconNode) => {
  return (props: IconProps = {}): string => {
    const size = props.size || 24;
    const color = props.color || 'currentColor';
    const sw = props.strokeWidth || 2;
    const strokeWidth = props.absoluteStrokeWidth
      ? (Number(sw) * 24) / Number(size)
      : sw;

    const children = iconNode
      .map(([tag, attrs]) => {
        const attrStr = Object.entries(attrs)
          .map(([k, v]) => {
            const kebab = k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
            return `${kebab}="${v}"`;
          })
          .join(' ');
        return `<${tag} ${attrStr}/>`;
      })
      .join('');

    const cls = ['dga-icon', `dga-icon-${iconName}`, props.class]
      .filter(Boolean)
      .join(' ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${cls}">${children}</svg>`;
  };
};
