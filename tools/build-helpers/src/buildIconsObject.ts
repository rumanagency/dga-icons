import { SvgData } from './readSvg.js';

export interface IconsObject {
  [iconName: string]: SvgData;
}

export function buildIconsObject(svgDataArray: SvgData[]): IconsObject {
  return svgDataArray.reduce<IconsObject>((acc, svgData) => {
    acc[svgData.name] = svgData;
    return acc;
  }, {});
}
