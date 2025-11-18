import { readdir } from 'fs/promises';
import { join } from 'path';
import { readSvg, SvgData } from './readSvg.js';

export async function readSvgDirectory(dirPath: string): Promise<SvgData[]> {
  const files = await readdir(dirPath);
  const svgFiles = files.filter((file) => file.endsWith('.svg'));

  const svgPromises = svgFiles.map((file) => readSvg(join(dirPath, file)));

  return Promise.all(svgPromises);
}
