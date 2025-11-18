import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { readSvgDirectory, toPascalCase, type StyleDirectory } from '@ruman/build-helpers';

export async function generateIconFiles(
  styleDir: StyleDirectory,
  outputDir: string,
  packageName: string
): Promise<void> {
  const styleOutputDir = join(outputDir, styleDir.style);
  await mkdir(styleOutputDir, { recursive: true });

  const svgData = await readSvgDirectory(styleDir.path);

  for (const svg of svgData) {
    const componentName = toPascalCase(svg.name);
    const componentCode = generateComponentCode(componentName, svg.content, packageName);
    const outputPath = join(styleOutputDir, `${componentName}.tsx`);

    await writeFile(outputPath, componentCode, 'utf-8');
  }

  console.log(`  ✓ Generated ${svgData.length} icons for ${styleDir.style}`);
}

function generateComponentCode(
  componentName: string,
  svgContent: string,
  packageName: string
): string {
  const svgInner = svgContent
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  if (packageName === 'react') {
    return `import createLucideIcon from '../../createLucideIcon';

const ${componentName} = createLucideIcon('${componentName}', [
  ${JSON.stringify(svgInner)}
]);

export default ${componentName};
`;
  }

  return `export const ${componentName} = ${JSON.stringify(svgInner)};
`;
}
