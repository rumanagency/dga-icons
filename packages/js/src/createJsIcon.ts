import type { IconNode } from '@dga-icons/core';

export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export const createJsIcon = (iconName: string, iconNode: IconNode) => {
  return (props: IconProps = {}) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const size = props.size || 24;
    
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    
    if (props.color) {
      svg.setAttribute('stroke', props.color);
    }
    
    const strokeWidth = props.absoluteStrokeWidth 
      ? (Number(props.strokeWidth || 2) * 24) / Number(size)
      : (props.strokeWidth || 2);
      
    svg.setAttribute('stroke-width', String(strokeWidth));
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    
    // Add any extra props
    Object.keys(props).forEach(key => {
      if (!['size', 'color', 'strokeWidth', 'absoluteStrokeWidth'].includes(key)) {
        svg.setAttribute(key, String(props[key]));
      }
    });

    iconNode.forEach(([tag, attrs]) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.keys(attrs).forEach(attr => {
        // Handle camelCase attributes mapping back to kebab-case for DOM
        const kebabAttr = attr.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        el.setAttribute(kebabAttr, attrs[attr]);
      });
      svg.appendChild(el);
    });

    return svg;
  };
};
