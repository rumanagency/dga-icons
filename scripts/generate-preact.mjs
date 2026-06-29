import { readdir, mkdir, writeFile, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { toPascalCase, ALL_STYLES, DEFAULT_STYLE } from './utils.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const ICONS_DIR = join(ROOT, 'icons');
const PREACT_SRC = join(ROOT, 'packages', 'preact', 'src');

async function main() {
  console.log('🟣  Generating @dga-icons/preact source files...\n');

  const startTime = Date.now();

  await generateForStyle(DEFAULT_STYLE, true);

  for (const style of ALL_STYLES) {
    if (style !== DEFAULT_STYLE) {
      await generateForStyle(style, false);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ @dga-icons/preact generation complete in ${elapsed}s`);
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
  console.log(`  🟣  ${style}: ${files.length} components`);

  const outDir = isDefault
    ? join(PREACT_SRC, 'icons')
    : join(PREACT_SRC, style, 'icons');

  await mkdir(outDir, { recursive: true });

  const iconNames = [];

  for (const file of files) {
    const iconName = file.replace('.svg', '');
    const componentName = toPascalCase(iconName);

    const coreImportPath = isDefault
      ? `@dga-icons/core`
      : `@dga-icons/core/${style}`;

    const source = generateComponentSource(
      componentName,
      iconName,
      coreImportPath,
      isDefault
    );

    await writeFile(join(outDir, `${componentName}.ts`), source);
    iconNames.push({ iconName, componentName });
  }

  const indexDir = isDefault ? PREACT_SRC : join(PREACT_SRC, style);
  const indexContent = generateBarrelIndex(iconNames, isDefault);
  await writeFile(join(indexDir, 'index.ts'), indexContent);
}

function generateComponentSource(
  componentName,
  iconName,
  coreImportPath,
  isDefault
) {
  const createIconPath = isDefault
    ? '../createPreactIcon'
    : '../../createPreactIcon';

  return `import { createPreactIcon } from '${createIconPath}';
import { ${componentName} as iconData } from '${coreImportPath}';

const ${componentName} = createPreactIcon('${iconName}', iconData);

export default ${componentName};
`;
}

function generateBarrelIndex(iconNames, isDefault) {
  const lines = [];

  if (isDefault) {
    lines.push("export { createPreactIcon } from './createPreactIcon';");
    lines.push("export type { IconNode } from '@dga-icons/core';");
    lines.push("export type { IconProps } from './createPreactIcon';");
    lines.push('');
  }

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
