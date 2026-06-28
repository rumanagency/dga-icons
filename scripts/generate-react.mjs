/**
 * Generate @dga-icons/react source files.
 *
 * Reads the generated @dga-icons/core icon data and creates:
 * - packages/react/src/icons/<ComponentName>.tsx   (one per icon)
 * - packages/react/src/index.ts                    (barrel export for default)
 * - packages/react/src/<style>/icons/...           (per-style components)
 * - packages/react/src/<style>/index.ts            (per-style barrel)
 */

import { readdir, mkdir, writeFile, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { toPascalCase, ALL_STYLES, DEFAULT_STYLE } from './utils.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const ICONS_DIR = join(ROOT, 'icons');
const REACT_SRC = join(ROOT, 'packages', 'react', 'src');

async function main() {
  console.log('⚛️  Generating @dga-icons/react source files...\n');

  const startTime = Date.now();

  // Generate for default style first
  await generateForStyle(DEFAULT_STYLE, true);

  // Generate for all other styles
  for (const style of ALL_STYLES) {
    if (style !== DEFAULT_STYLE) {
      await generateForStyle(style, false);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ @dga-icons/react generation complete in ${elapsed}s`);
}

async function generateForStyle(style, isDefault) {
  const styleDir = join(ICONS_DIR, style);

  try {
    await stat(styleDir);
  } catch {
    console.log(`  ⚠️  Skipping ${style} — directory not found`);
    return;
  }

  const files = (await readdir(styleDir)).filter((f) => f.endsWith('.svg'));
  console.log(`  ⚛️  ${style}: ${files.length} components`);

  // Output directory
  const outDir = isDefault
    ? join(REACT_SRC, 'icons')
    : join(REACT_SRC, style, 'icons');

  await mkdir(outDir, { recursive: true });

  const iconNames = [];

  for (const file of files) {
    const iconName = file.replace('.svg', '');
    const componentName = toPascalCase(iconName);

    // Determine the import path to core
    const coreImportPath = isDefault
      ? `@dga-icons/core`
      : `@dga-icons/core/${style}`;

    // Generate React component source
    const source = generateComponentSource(
      componentName,
      iconName,
      coreImportPath,
      isDefault
    );

    await writeFile(join(outDir, `${componentName}.tsx`), source);
    iconNames.push({ iconName, componentName });
  }

  // Generate barrel index
  const indexDir = isDefault ? REACT_SRC : join(REACT_SRC, style);
  const indexContent = generateBarrelIndex(iconNames, isDefault);
  await writeFile(join(indexDir, 'index.ts'), indexContent);
}

function generateComponentSource(
  componentName,
  iconName,
  coreImportPath,
  isDefault
) {
  const createDgaIconPath = isDefault
    ? '../createDgaIcon'
    : '../../createDgaIcon';

  return `import { createDgaIcon } from '${createDgaIconPath}';
import { ${componentName} as iconData } from '${coreImportPath}';

const ${componentName} = createDgaIcon('${iconName}', iconData);
${componentName}.displayName = '${componentName}';

export default ${componentName};
`;
}

function generateBarrelIndex(iconNames, isDefault) {
  const lines = [];

  if (isDefault) {
    // Re-export core types and the factory
    lines.push("export { createDgaIcon } from './createDgaIcon';");
    lines.push("export type { DgaIconProps } from './types';");
    lines.push("export type { IconNode } from '@dga-icons/core';");
    lines.push('');
  }

  // Export all icon components
  for (const { componentName } of iconNames) {
    lines.push(
      `export { default as ${componentName} } from './icons/${componentName}';`
    );
  }

  lines.push('');
  return lines.join('\n');
}

main().catch((err) => {
  console.error('❌ Generation failed:', err);
  process.exit(1);
});
