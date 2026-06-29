import { h, defineComponent } from 'vue';
import type { SVGAttributes, VNode } from 'vue';
import type { IconNode } from '@dga-icons/core';

export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

export const createVueIcon = (iconName: string, iconNode: IconNode) => {
  return defineComponent({
    name: iconName,
    inheritAttrs: true,
    props: {
      size: { type: [Number, String], default: 24 },
      color: { type: String, default: 'currentColor' },
      strokeWidth: { type: [Number, String], default: 2 },
      absoluteStrokeWidth: { type: Boolean, default: false },
    },
    setup(props, { attrs }) {
      return () => {
        return h(
          'svg',
          {
            width: props.size,
            height: props.size,
            stroke: props.color,
            strokeWidth: props.absoluteStrokeWidth 
              ? (Number(props.strokeWidth) * 24) / Number(props.size) 
              : props.strokeWidth,
            viewBox: '0 0 24 24',
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            ...attrs,
          },
          iconNode.map(([tag, nodeAttrs]) => h(tag, nodeAttrs))
        );
      };
    },
  });
};
