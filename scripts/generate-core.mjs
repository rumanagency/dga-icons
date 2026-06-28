/**
 * Generate @dga-icons/core source files.
 *
 * Reads SVG files from icons/<style>/ directories and generates:
 * - packages/core/src/icons/<iconName>.ts  (one per icon, per style)
 * - packages/core/src/index.ts             (barrel export for default style)
 * - packages/core/src/<style>/index.ts     (barrel export per style)
 */

import { readdir, mkdir, writeFile, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { parseSvg } from './svg-parser.mjs';
import { toPascalCase, ALL_STYLES, DEFAULT_STYLE } from './utils.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const ICONS_DIR = join(ROOT, 'icons');
const CORE_SRC = join(ROOT, 'packages', 'core', 'src');

async function main() {
  console.log('🔧 Generating @dga-icons/core source files...\n');

  const startTime = Date.now();

  // Generate for default style first (stroke-rounded)
  await generateForStyle(DEFAULT_STYLE, true);

  // Generate for all other styles
  for (const style of ALL_STYLES) {
    if (style !== DEFAULT_STYLE) {
      await generateForStyle(style, false);
    }
  }

  // Generate the types file
  await generateTypes();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ @dga-icons/core generation complete in ${elapsed}s`);
}

async function generateForStyle(style, isDefault) {
  const styleDir = join(ICONS_DIR, style);

  // Check if style directory exists
  try {
    await stat(styleDir);
  } catch {
    console.log(`  ⚠️  Skipping ${style} — directory not found`);
    return;
  }

  // Read all SVG files
  const files = (await readdir(styleDir)).filter((f) => f.endsWith('.svg'));
  console.log(`  📦 ${style}: ${files.length} icons`);

  // Output directory
  const outDir = isDefault
    ? join(CORE_SRC, 'icons')
    : join(CORE_SRC, style, 'icons');

  await mkdir(outDir, { recursive: true });

  const iconNames = [];

  for (const file of files) {
    const iconName = file.replace('.svg', '');
    const componentName = toPascalCase(iconName);
    const svgPath = join(styleDir, file);

    // Parse SVG
    const iconNode = await parseSvg(svgPath);

    // Generate TypeScript source
    const source = generateIconSource(componentName, iconName, iconNode, isDefault);

    // Write file
    await writeFile(join(outDir, `${componentName}.ts`), source);
    iconNames.push({ iconName, componentName });
  }

  // Generate barrel index
  const indexDir = isDefault ? CORE_SRC : join(CORE_SRC, style);
  const indexContent = generateBarrelIndex(iconNames, isDefault);
  await writeFile(join(indexDir, 'index.ts'), indexContent);
}

function generateIconSource(componentName, iconName, iconNode, isDefault) {
  const nodeJson = JSON.stringify(iconNode, null, 2)
    // Fix indentation for readability
    .replace(/\n/g, '\n  ')
    .replace(/\n  $/g, '\n');

  const typesImport = isDefault ? '../types' : '../../types';

  return `import type { IconNode } from '${typesImport}';

const ${componentName}: IconNode = ${nodeJson};

export default ${componentName};
`;
}

function generateBarrelIndex(iconNames, isDefault) {
  const lines = [];

  // Re-export types
  if (isDefault) {
    lines.push("export type { IconNode } from './types';");
    lines.push('');
  }

  // Export all icons
  for (const { componentName } of iconNames) {
    lines.push(
      `export { default as ${componentName} } from './icons/${componentName}';`
    );
  }

  lines.push('');
  return lines.join('\n');
}

async function generateTypes() {
  const typesContent = `/**
 * An IconNode represents the SVG child elements of an icon.
 * Each entry is a tuple of [tagName, attributes].
 *
 * Example:
 * \`\`\`ts
 * const HomeIcon: IconNode = [
 *   ["path", { d: "M1 2...", fill: "currentColor", fillRule: "evenodd" }]
 * ];
 * \`\`\`
 */
export type IconNode = [tag: string, attrs: Record<string, string>][];
`;

  await writeFile(join(CORE_SRC, 'types.ts'), typesContent);
  console.log('  📝 Generated types.ts');
}

main().catch((err) => {
  console.error('❌ Generation failed:', err);
  process.exit(1);
});
