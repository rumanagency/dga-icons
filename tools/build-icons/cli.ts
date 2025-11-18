#!/usr/bin/env node

import { readAllStyles, ICON_STYLES } from '@ruman/build-helpers';
import { generateIconFiles } from './building/generateIconFiles.js';
import { generateExportsFile } from './building/generateExportsFile.js';
import { generateStyleExports } from './building/generateStyleExports.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
DGA Icons Build CLI

Usage:
  build-icons [options]

Options:
  --help, -h          Show this help message
  --icons-dir <path>  Path to icons directory (default: icons/)
  --output <path>     Output directory (default: src/icons/)
  --package <name>    Package name (required for component generation)

Examples:
  build-icons --icons-dir ./icons --output ./src/icons --package react
  build-icons --help
  `);
  process.exit(0);
}

const iconsDir = args.includes('--icons-dir')
  ? args[args.indexOf('--icons-dir') + 1]
  : 'icons';

const outputDir = args.includes('--output')
  ? args[args.indexOf('--output') + 1]
  : 'src/icons';

const packageName = args.includes('--package')
  ? args[args.indexOf('--package') + 1]
  : undefined;

console.log('🚀 DGA Icons Build CLI');
console.log(`📁 Icons directory: ${iconsDir}`);
console.log(`📁 Output directory: ${outputDir}`);
console.log(`📦 Package: ${packageName || 'N/A'}`);
console.log(`🎨 Styles: ${ICON_STYLES.length}`);
console.log('');

async function main() {
  try {
    console.log('📖 Reading icon styles...');
    const styleDirectories = await readAllStyles(iconsDir);

    console.log(`✓ Found ${styleDirectories.length} style directories`);
    styleDirectories.forEach((style) => {
      console.log(`  - ${style.style}: ${style.files.length} icons`);
    });

    if (packageName) {
      console.log('\n🔨 Generating icon components...');
      for (const styleDir of styleDirectories) {
        await generateIconFiles(styleDir, outputDir, packageName);
        await generateStyleExports(styleDir, outputDir);
      }

      console.log('\n📝 Generating barrel exports...');
      await generateExportsFile(styleDirectories, outputDir);
    }

    console.log('\n✅ Build completed successfully!');
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

main();
