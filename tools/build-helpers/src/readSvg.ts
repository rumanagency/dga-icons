import { readFile } from 'fs/promises';
import { load } from 'cheerio';

export interface SvgData {
  name: string;
  content: string;
  viewBox: string;
  paths: Array<{
    d: string;
    fill?: string;
    stroke?: string;
    opacity?: string;
    strokeWidth?: string;
  }>;
}

export async function readSvg(filePath: string): Promise<SvgData> {
  const content = await readFile(filePath, 'utf-8');
  const $ = load(content, { xmlMode: true });
  const svg = $('svg');

  const paths = svg
    .find('path')
    .map((_, el) => {
      const $el = $(el);
      return {
        d: $el.attr('d') || '',
        fill: $el.attr('fill'),
        stroke: $el.attr('stroke'),
        opacity: $el.attr('opacity'),
        strokeWidth: $el.attr('stroke-width'),
      };
    })
    .get();

  const fileName = filePath.split('/').pop()?.replace('.svg', '') || '';

  return {
    name: fileName,
    content,
    viewBox: svg.attr('viewBox') || '0 0 24 24',
    paths,
  };
}
