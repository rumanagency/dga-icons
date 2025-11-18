import { writeFile } from 'fs/promises';
import { join } from 'path';
import { readSvgDirectory, toPascalCase, type StyleDirectory } from '@ruman/build-helpers';

export async function generateStyleExports(
  styleDir: StyleDirectory,
  outputDir: string
): Promise<void> {
  const svgData = await readSvgDirectory(styleDir.path);
  const styleOutputDir = join(outputDir, styleDir.style);

  const exports = svgData
    .map((svg) => {
      const componentName = toPascalCase(svg.name);
      return `export { default as ${componentName} } from './${componentName}.js';`;
    })
    .join('\n');

  const indexPath = join(styleOutputDir, 'index.ts');
  await writeFile(indexPath, exports + '\n', 'utf-8');
}
