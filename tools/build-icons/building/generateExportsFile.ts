import { writeFile } from 'fs/promises';
import { join } from 'path';
import { type StyleDirectory } from '@ruman/build-helpers';

export async function generateExportsFile(
  styleDirectories: StyleDirectory[],
  outputDir: string
): Promise<void> {
  const exports = styleDirectories
    .map((style) => `export * from './${style.style}/index.js';`)
    .join('\n');

  const indexPath = join(outputDir, 'index.ts');
  await writeFile(indexPath, exports + '\n', 'utf-8');

  console.log(`✓ Generated barrel export with ${styleDirectories.length} styles`);
}
