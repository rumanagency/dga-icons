import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { readAllStyles } from '../tools/build-helpers/src/readAllStyles.js';

interface IconMetadata {
  name: string;
  styles: string[];
  categories: string[];
  tags: string[];
  multiColor: boolean;
  colorCount: number;
}

interface MetadataIndex {
  icons: Record<string, IconMetadata>;
  totalIcons: number;
  styles: string[];
  lastUpdated: string;
}

async function generateIconMetadata(): Promise<void> {
  console.log('Generating icon metadata...');

  const iconsDir = join(process.cwd(), 'icons');
  const styleDirectories = await readAllStyles(iconsDir);

  const iconMap = new Map<string, IconMetadata>();

  for (const styleDir of styleDirectories) {
    const files = await readdir(styleDir.path);
    const svgFiles = files.filter((file) => file.endsWith('.svg'));

    for (const svgFile of svgFiles) {
      const iconName = svgFile.replace('.svg', '');
      const existingIcon = iconMap.get(iconName);

      const isMultiColor = ['bulk-rounded', 'duotone-rounded', 'twotone-rounded'].includes(
        styleDir.style
      );

      if (existingIcon) {
        existingIcon.styles.push(styleDir.style);
      } else {
        iconMap.set(iconName, {
          name: iconName,
          styles: [styleDir.style],
          categories: ['other'],
          tags: [iconName],
          multiColor: isMultiColor,
          colorCount: isMultiColor ? 2 : 1,
        });
      }
    }
  }

  const metadata: MetadataIndex = {
    icons: Object.fromEntries(iconMap),
    totalIcons: iconMap.size,
    styles: styleDirectories.map((dir) => dir.style),
    lastUpdated: new Date().toISOString(),
  };

  const metadataPath = join(iconsDir, 'metadata.json');
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log(`✓ Generated metadata for ${metadata.totalIcons} icons`);
  console.log(`✓ Styles: ${metadata.styles.join(', ')}`);
  console.log(`✓ Output: ${metadataPath}`);
}

generateIconMetadata().catch((error) => {
  console.error('Error generating metadata:', error);
  process.exit(1);
});
