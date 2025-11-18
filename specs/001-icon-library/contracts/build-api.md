# Build Tool CLI API Contract

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2025-11-18

## Overview

This document defines the API contract for the `@ruman/build-icons` CLI tool and build pipeline. This tool is responsible for transforming source SVG files into framework-specific icon components across all 9 visual styles.

---

## CLI Tool: `build-icons`

### Command Signature

```bash
build-icons [options]
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--output`, `-o` | `string` | Required | Output directory for generated components |
| `--template` | `string` | Required | Path to framework template file (.mts, .ts) |
| `--icons-dir` | `string` | `./icons` | Source directory containing SVG files |
| `--style` | `string` | Required | Icon style to build (stroke-rounded, solid-rounded, etc.) |
| `--extension` | `string` | `.ts` | File extension for generated files (.ts, .tsx, .js, .vue, .svelte) |
| `--with-aliases` | `boolean` | `false` | Generate alias files for icon name variants |
| `--render-unique-key` | `boolean` | `false` | Add unique keys to child elements (React optimization) |
| `--separate-aliases-file` | `boolean` | `true` | Generate separate aliases file instead of inline |
| `--export-filename` | `string` | `index` | Name of the barrel export file (without extension) |
| `--package-name` | `string` | Auto-detect | Package name for error messages and logging |
| `--optimize` | `boolean` | `true` | Run SVGO optimization before processing |
| `--validate` | `boolean` | `true` | Validate SVG structure and accessibility |
| `--dry-run` | `boolean` | `false` | Show what would be generated without writing files |
| `--verbose`, `-v` | `boolean` | `false` | Enable detailed logging |
| `--quiet`, `-q` | `boolean` | `false` | Suppress all output except errors |
| `--parallel` | `number` | CPU cores | Number of parallel workers for generation |
| `--watch`, `-w` | `boolean` | `false` | Watch source directory for changes and rebuild |

### Examples

**Basic Usage**:
```bash
# Build React stroke-rounded icons
build-icons \
  --output ./packages/react/src/icons/stroke-rounded \
  --template ./packages/react/scripts/exportTemplate.mts \
  --icons-dir ./icons/stroke-rounded \
  --style stroke-rounded \
  --extension .tsx

# Build Vue duotone-rounded icons
build-icons \
  --output ./packages/vue/src/icons/duotone-rounded \
  --template ./packages/vue/scripts/exportTemplate.mts \
  --icons-dir ./icons/duotone-rounded \
  --style duotone-rounded \
  --extension .ts

# Build all styles for React
for style in stroke-rounded stroke-sharp stroke-standard solid-rounded solid-sharp solid-standard duotone-rounded twotone-rounded bulk-rounded; do
  build-icons \
    --output ./packages/react/src/icons/$style \
    --template ./packages/react/scripts/exportTemplate.mts \
    --icons-dir ./icons/$style \
    --style $style \
    --extension .tsx
done
```

**Advanced Usage**:
```bash
# Build with aliases and optimization
build-icons \
  --output ./packages/react/src/icons/stroke-rounded \
  --template ./packages/react/scripts/exportTemplate.mts \
  --style stroke-rounded \
  --with-aliases \
  --optimize \
  --verbose

# Dry run to preview generation
build-icons \
  --output ./packages/react/src/icons/stroke-rounded \
  --template ./packages/react/scripts/exportTemplate.mts \
  --style stroke-rounded \
  --dry-run

# Watch mode for development
build-icons \
  --output ./packages/react/src/icons/stroke-rounded \
  --template ./packages/react/scripts/exportTemplate.mts \
  --style stroke-rounded \
  --watch
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success - all icons generated |
| 1 | Error - missing required options |
| 2 | Error - template file not found |
| 3 | Error - icons directory not found |
| 4 | Error - SVG validation failed |
| 5 | Error - template rendering failed |
| 6 | Error - file write failed |
| 7 | Error - optimization failed |

---

## Template System

### Template File Structure

Templates are TypeScript/JavaScript modules that export a default function:

```typescript
// exportTemplate.mts
export interface TemplateContext {
  componentName: string;      // PascalCase icon name (e.g., "Home")
  iconName: string;            // kebab-case icon name (e.g., "home")
  children: string;            // Serialized SVG children
  svgAttributes: Record<string, string | number>;
  metadata: IconMetadata;
  style: IconStyle;
}

export default function template(context: TemplateContext): string {
  // Return generated component code as string
}
```

### React Template Example

```typescript
// packages/react/scripts/exportTemplate.mts
import type { TemplateContext } from '@ruman/build-icons';

export default function reactTemplate(ctx: TemplateContext): string {
  const { componentName, iconName, children, style } = ctx;

  const isMultiColor = ['duotone-rounded', 'twotone-rounded', 'bulk-rounded'].includes(style);

  return `
import createLucideIcon from '../../createLucideIcon${isMultiColor ? 'MultiColor' : ''}';

/**
 * ${componentName} icon component
 * @component
 * @name ${iconName}
 * @style ${style}
 */
const ${componentName} = createLucideIcon('${componentName}', [
${children}
]);

export default ${componentName};
`.trim();
}
```

### Vue Template Example

```typescript
// packages/vue/scripts/exportTemplate.mts
import type { TemplateContext } from '@ruman/build-icons';

export default function vueTemplate(ctx: TemplateContext): string {
  const { componentName, iconName, children, style } = ctx;

  return `
import createLucideIcon from '../../createLucideIcon';

/**
 * ${componentName} icon component
 * @component
 * @name ${iconName}
 * @style ${style}
 */
const ${componentName} = createLucideIcon('${componentName}', [
${children}
]);

export default ${componentName};
`.trim();
}
```

### Svelte Template Example

```typescript
// packages/svelte/scripts/exportTemplate.mts
import type { TemplateContext } from '@ruman/build-icons';

export default function svelteTemplate(ctx: TemplateContext): string {
  const { componentName, iconName, children, svgAttributes } = ctx;

  return `
<script>
  export let size = 24;
  export let color = 'currentColor';
  export let strokeWidth = 2;
  export let class = '';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-{iconName} {class}"
>
${children}
</svg>
`.trim();
}
```

---

## SVG Processing Pipeline

### Pipeline Stages

```
1. Read SVG Files
   ↓
2. Validate SVG Structure
   ↓
3. Optimize with SVGO
   ↓
4. Transform Multi-Color SVGs
   ↓
5. Parse SVG to AST
   ↓
6. Serialize Children to Framework Format
   ↓
7. Render Template
   ↓
8. Write Output Files
   ↓
9. Generate Barrel Exports
```

### Stage 1: Read SVG Files

**Input**: Directory path (e.g., `./icons/stroke-rounded/`)
**Output**: Array of `{ name: string, content: string, path: string }`

```typescript
interface SVGFile {
  name: string;        // Icon name (kebab-case)
  content: string;     // Raw SVG content
  path: string;        // Absolute file path
  metadata?: IconMetadata;
}

async function readSvgDirectory(dir: string): Promise<SVGFile[]> {
  const files = await fs.readdir(dir);
  const svgFiles = files.filter(f => f.endsWith('.svg'));

  return Promise.all(
    svgFiles.map(async file => {
      const name = file.replace('.svg', '');
      const path = join(dir, file);
      const content = await fs.readFile(path, 'utf-8');
      const metadata = await loadIconMetadata(name, dir);

      return { name, content, path, metadata };
    })
  );
}
```

### Stage 2: Validate SVG Structure

**Input**: SVG content string
**Output**: Validation result with errors/warnings

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  code: string;
  message: string;
  line?: number;
  column?: number;
}

function validateSvg(content: string, name: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check: Must be valid XML
  try {
    parseXML(content);
  } catch (e) {
    errors.push({ code: 'INVALID_XML', message: e.message });
  }

  // Check: Must have viewBox
  if (!content.includes('viewBox')) {
    errors.push({ code: 'MISSING_VIEWBOX', message: 'SVG must have viewBox attribute' });
  }

  // Check: No inline scripts
  if (content.includes('<script')) {
    errors.push({ code: 'SCRIPT_FOUND', message: 'SVG must not contain <script> tags' });
  }

  // Check: No external resources
  if (content.includes('xlink:href') && content.includes('http')) {
    warnings.push({ code: 'EXTERNAL_RESOURCE', message: 'SVG contains external resource reference' });
  }

  // Check: Proper fill/stroke usage
  const hasFill = content.includes('fill=');
  const hasStroke = content.includes('stroke=');
  if (!hasFill && !hasStroke) {
    warnings.push({ code: 'NO_COLOR', message: 'SVG has no fill or stroke attributes' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

**Validation Rules**:
- MUST be valid XML
- MUST have `viewBox="0 0 24 24"`
- MUST NOT contain `<script>` tags
- MUST NOT contain `<style>` tags with JavaScript
- MUST NOT reference external resources (except data URIs)
- SHOULD use `currentColor` or `fill`/`stroke` attributes
- SHOULD have proper path data (no NaN, Infinity)

### Stage 3: Optimize with SVGO

**Input**: Raw SVG content
**Output**: Optimized SVG content

```typescript
import { optimize, type Config } from 'svgo';

const svgoConfig: Config = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,  // Keep viewBox
          cleanupIds: false,     // Keep IDs for multi-color
        },
      },
    },
    {
      name: 'removeDimensions',  // Remove width/height (use viewBox)
    },
    {
      name: 'convertColors',
      params: {
        currentColor: true,      // Convert colors to currentColor
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name', 'class'],  // Remove Figma metadata
      },
    },
  ],
};

function optimizeSvg(content: string): string {
  const result = optimize(content, svgoConfig);
  return result.data;
}
```

### Stage 4: Transform Multi-Color SVGs

**Input**: Optimized SVG content + style name
**Output**: SVG with CSS custom properties

```typescript
function transformMultiColorSvg(content: string, style: IconStyle): string {
  const isMultiColor = ['duotone-rounded', 'twotone-rounded', 'bulk-rounded'].includes(style);

  if (!isMultiColor) return content;

  // Replace fill attributes based on opacity
  let transformed = content;

  // Paths with opacity -> secondary color
  transformed = transformed.replace(
    /(<path[^>]*opacity=["']0\.\d+["'][^>]*fill=["'])currentColor(["'])/gi,
    '$1var(--ruman-icon-secondary, currentColor)$2'
  );

  // Paths without opacity -> primary color
  transformed = transformed.replace(
    /(<path[^>]*fill=["'])currentColor(["'](?![^<]*opacity))/gi,
    '$1var(--ruman-icon-primary, currentColor)$2'
  );

  return transformed;
}
```

### Stage 5: Parse SVG to AST

**Input**: SVG string
**Output**: Abstract Syntax Tree

```typescript
import { parse } from 'svg-parser';

interface SVGNode {
  type: 'element' | 'text';
  tagName?: string;
  properties?: Record<string, string | number>;
  children?: SVGNode[];
  value?: string;
}

function parseSvgToAst(content: string): SVGNode {
  const parsed = parse(content);
  return parsed.children[0]; // Extract <svg> root
}
```

### Stage 6: Serialize Children to Framework Format

**Input**: SVG AST
**Output**: Framework-specific serialized string

**React/Vue Format** (Array of tuples):
```typescript
function serializeToReact(node: SVGNode): string {
  const children = node.children || [];

  const serialized = children.map(child => {
    if (child.type === 'text') return null;

    const tagName = child.tagName;
    const props = Object.entries(child.properties || {})
      .map(([key, value]) => {
        const formattedKey = key.replace(/[:-]/g, match => {
          return match === ':' ? '' : match.toUpperCase();
        });
        return `${formattedKey}: '${value}'`;
      })
      .join(', ');

    return `  ['${tagName}', { ${props} }]`;
  }).filter(Boolean);

  return serialized.join(',\n');
}

// Output example:
// ['path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }],
// ['polyline', { points: '9 22 9 12 15 12 15 22' }]
```

**Svelte/Vue SFC Format** (Inline SVG):
```typescript
function serializeToSvelte(node: SVGNode): string {
  const children = node.children || [];

  return children.map(child => {
    if (child.type === 'text') return child.value;

    const tagName = child.tagName;
    const attrs = Object.entries(child.properties || {})
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `  <${tagName} ${attrs} />`;
  }).join('\n');
}

// Output example:
// <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
// <polyline points="9 22 9 12 15 12 15 22" />
```

### Stage 7: Render Template

**Input**: Template function + context
**Output**: Generated component code

```typescript
interface TemplateContext {
  componentName: string;
  iconName: string;
  children: string;
  svgAttributes: Record<string, string | number>;
  metadata: IconMetadata;
  style: IconStyle;
}

async function renderTemplate(
  templatePath: string,
  context: TemplateContext
): Promise<string> {
  const template = await import(templatePath);
  const renderFn = template.default;

  if (typeof renderFn !== 'function') {
    throw new Error(`Template at ${templatePath} must export a default function`);
  }

  return renderFn(context);
}
```

### Stage 8: Write Output Files

**Input**: Generated code + output path
**Output**: Written files

```typescript
async function writeIconFile(
  outputDir: string,
  iconName: string,
  content: string,
  extension: string
): Promise<void> {
  const fileName = toPascalCase(iconName) + extension;
  const filePath = join(outputDir, fileName);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}
```

### Stage 9: Generate Barrel Exports

**Input**: List of generated icon names
**Output**: Index file with re-exports

```typescript
async function generateBarrelExport(
  outputDir: string,
  iconNames: string[],
  exportFileName: string,
  extension: string
): Promise<void> {
  const exports = iconNames.map(name => {
    const componentName = toPascalCase(name);
    return `export { default as ${componentName} } from './${componentName}${extension}';`;
  }).join('\n');

  const content = `
// Auto-generated barrel export file
// Do not edit manually

${exports}
`.trim();

  const filePath = join(outputDir, exportFileName + extension);
  await fs.writeFile(filePath, content, 'utf-8');
}
```

---

## Icon Metadata Schema

See `metadata-schema.json` for full JSON Schema definition.

### TypeScript Interface

```typescript
interface IconMetadata {
  name: string;
  displayName?: string;
  categories: string[];
  tags: string[];
  aliases?: string[];
  styles: {
    'stroke-rounded'?: boolean;
    'stroke-sharp'?: boolean;
    'stroke-standard'?: boolean;
    'solid-rounded'?: boolean;
    'solid-sharp'?: boolean;
    'solid-standard'?: boolean;
    'duotone-rounded'?: boolean;
    'twotone-rounded'?: boolean;
    'bulk-rounded'?: boolean;
  };
  multiColor: boolean;
  deprecated?: boolean;
  deprecationMessage?: string;
  version: string;
}
```

### Metadata Loading

```typescript
async function loadIconMetadata(
  iconName: string,
  iconsDir: string
): Promise<IconMetadata | undefined> {
  const metadataPath = join(iconsDir, `${iconName}.json`);

  try {
    const content = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return undefined; // Metadata is optional
  }
}
```

---

## Programmatic API

In addition to the CLI, the build tool can be used programmatically:

```typescript
import { buildIcons, type BuildIconsOptions } from '@ruman/build-icons';

const options: BuildIconsOptions = {
  output: './packages/react/src/icons/stroke-rounded',
  template: './packages/react/scripts/exportTemplate.mts',
  iconsDir: './icons/stroke-rounded',
  style: 'stroke-rounded',
  extension: '.tsx',
  withAliases: false,
  optimize: true,
  validate: true,
};

const result = await buildIcons(options);

console.log(`Generated ${result.iconCount} icons`);
console.log(`Errors: ${result.errors.length}`);
console.log(`Warnings: ${result.warnings.length}`);
```

### Return Type

```typescript
interface BuildIconsResult {
  iconCount: number;
  errors: BuildError[];
  warnings: BuildWarning[];
  skipped: string[];
  duration: number;
}

interface BuildError {
  icon: string;
  code: string;
  message: string;
  phase: 'read' | 'validate' | 'optimize' | 'transform' | 'render' | 'write';
}

interface BuildWarning {
  icon: string;
  code: string;
  message: string;
}
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Single icon generation | <10ms |
| 100 icons generation | <1s |
| 4,300 icons generation (single style) | <30s |
| 39,000 icons generation (all 9 styles) | <5 minutes |
| Memory usage | <500MB peak |

### Optimization Strategies

1. **Parallel Processing**: Use worker threads for CPU-intensive tasks
2. **Incremental Builds**: Only regenerate changed icons
3. **Caching**: Cache parsed AST and optimized SVGs
4. **Streaming**: Process icons in batches to avoid memory spikes

---

## Error Handling

### Error Codes

| Code | Description | Severity |
|------|-------------|----------|
| `MISSING_OPTION` | Required CLI option not provided | Error |
| `TEMPLATE_NOT_FOUND` | Template file does not exist | Error |
| `ICONS_DIR_NOT_FOUND` | Icons directory does not exist | Error |
| `INVALID_SVG` | SVG file is malformed | Error |
| `VALIDATION_FAILED` | SVG validation failed | Error |
| `OPTIMIZATION_FAILED` | SVGO optimization failed | Warning |
| `TEMPLATE_RENDER_FAILED` | Template function threw error | Error |
| `WRITE_FAILED` | File write operation failed | Error |
| `METADATA_PARSE_FAILED` | Icon metadata JSON is invalid | Warning |

### Error Output Format

```json
{
  "success": false,
  "errors": [
    {
      "icon": "home",
      "code": "INVALID_SVG",
      "message": "SVG file contains <script> tag",
      "phase": "validate",
      "file": "/path/to/icons/stroke-rounded/home.svg",
      "line": 12,
      "column": 4
    }
  ],
  "warnings": [
    {
      "icon": "settings",
      "code": "METADATA_PARSE_FAILED",
      "message": "Could not parse metadata JSON"
    }
  ]
}
```

---

## Testing

### Unit Tests

```typescript
// Test SVG validation
describe('validateSvg', () => {
  it('should pass valid SVG', () => {
    const svg = '<svg viewBox="0 0 24 24"><path d="M..." /></svg>';
    const result = validateSvg(svg, 'home');
    expect(result.valid).toBe(true);
  });

  it('should fail SVG with script tag', () => {
    const svg = '<svg><script>alert("xss")</script></svg>';
    const result = validateSvg(svg, 'home');
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe('SCRIPT_FOUND');
  });
});

// Test template rendering
describe('renderTemplate', () => {
  it('should render React component', async () => {
    const context = {
      componentName: 'Home',
      iconName: 'home',
      children: "['path', { d: 'M...' }]",
      style: 'stroke-rounded',
    };

    const code = await renderTemplate('./react-template.mts', context);
    expect(code).toContain('createLucideIcon');
    expect(code).toContain('Home');
  });
});
```

### Integration Tests

```typescript
// Test full build pipeline
describe('buildIcons', () => {
  it('should generate all icons for a style', async () => {
    const result = await buildIcons({
      output: './test-output',
      template: './test-template.mts',
      iconsDir: './test-icons',
      style: 'stroke-rounded',
      extension: '.tsx',
    });

    expect(result.iconCount).toBeGreaterThan(0);
    expect(result.errors).toHaveLength(0);

    // Check output files exist
    const files = await fs.readdir('./test-output');
    expect(files).toContain('Home.tsx');
    expect(files).toContain('index.tsx');
  });
});
```

---

## Contract Compliance Checklist

The build tool must:

- [ ] Accept all documented CLI options
- [ ] Support all 9 icon styles
- [ ] Validate SVG structure and security
- [ ] Optimize SVGs with SVGO
- [ ] Transform multi-color SVGs with CSS variables
- [ ] Support custom templates for each framework
- [ ] Generate barrel exports (index files)
- [ ] Handle errors gracefully with clear messages
- [ ] Support dry-run mode
- [ ] Support watch mode for development
- [ ] Generate TypeScript definitions
- [ ] Complete within performance targets
- [ ] Support parallel processing
- [ ] Provide programmatic API
- [ ] Include comprehensive error codes
- [ ] Support incremental builds

---

**Document Status**: Draft
**Next Review**: After Phase 1 implementation
**Maintainer**: Ruman Agency Development Team
