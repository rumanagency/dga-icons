import { readdir } from 'fs/promises';
import { join } from 'path';

export const ICON_STYLES = [
  'bulk-rounded',
  'duotone-rounded',
  'solid-rounded',
  'solid-sharp',
  'solid-standard',
  'stroke-rounded',
  'stroke-sharp',
  'stroke-standard',
  'twotone-rounded',
] as const;

export type IconStyle = (typeof ICON_STYLES)[number];

export interface StyleDirectory {
  style: IconStyle;
  path: string;
  files: string[];
}

export async function readAllStyles(iconsDir: string): Promise<StyleDirectory[]> {
  const styleDirectories: StyleDirectory[] = [];

  for (const style of ICON_STYLES) {
    const stylePath = join(iconsDir, style);
    try {
      const files = await readdir(stylePath);
      const svgFiles = files.filter((file) => file.endsWith('.svg'));

      styleDirectories.push({
        style,
        path: stylePath,
        files: svgFiles,
      });
    } catch (error) {
      console.warn(`Style directory not found: ${style}`);
    }
  }

  return styleDirectories;
}
