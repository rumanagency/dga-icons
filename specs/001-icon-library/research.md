# Research: DGA Icons Technical Decisions

**Date**: 2025-11-18
**Status**: Phase 0 Research Complete
**Branch**: 001-icon-library

This document resolves all "NEEDS CLARIFICATION" items from the specification by analyzing the Lucide Icons reference implementation and making concrete technical decisions for DGA Icons.

---

## 1. Monorepo Build System

### Decision: Turborepo with pnpm Workspaces

**Rationale**:
Lucide uses pnpm workspaces WITHOUT Turborepo (they only use pnpm scripts), but given our larger scale (11 packages Week 1, 14+ total) and the constitution's recommendation, Turborepo provides better caching and parallel build orchestration.

**Implementation**:

**pnpm-workspace.yaml**:
```yaml
packages:
  - 'packages/*'
  - 'tools/*'
  - 'scripts'
```

**turbo.json**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "cache": true
    },
    "build:icons": {
      "dependsOn": [],
      "outputs": ["src/icons/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "lint": {
      "outputs": [],
      "cache": true
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": [],
      "cache": true
    }
  }
}
```

**Root package.json scripts**:
```json
{
  "scripts": {
    "build": "turbo run build",
    "build:all": "pnpm build:icons && turbo run build",
    "build:icons": "node ./scripts/buildIcons.mts",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "optimize": "node ./scripts/optimizeSvgs.mts",
    "validate": "node ./scripts/validateIcons.mts"
  }
}
```

**Alternatives Considered**:
- **Nx**: More features but heavier, overkill for our needs
- **Lerna**: Deprecated, no longer recommended
- **pnpm only**: Works (Lucide uses this) but Turborepo adds intelligent caching for faster rebuilds

---

## 2. Component Generation Strategy

### Decision: Custom CLI-based Generator (@ruman/build-icons)

**Rationale**:
Lucide uses `@lucide/build-icons` CLI tool that reads SVG files and generates framework-specific components using templates. This approach is perfect for our 9 styles × 4,300+ icons = 39,000+ files.

**Implementation Architecture**:

**Build Pipeline Flow**:
```
1. SVG Files (icons/{style}/{name}.svg)
   ↓
2. build-icons CLI (tools/build-icons)
   ↓
3. Template Processing (per framework)
   ↓
4. Generated Components (packages/{framework}/src/icons/)
   ↓
5. Rollup/Vite Bundle (ES, CJS, UMD)
```

**Tool Structure** (`tools/build-icons/`):
```typescript
// cli.ts - Main entry point
interface BuildIconsOptions {
  output: string;              // Output directory
  templateSrc: string;         // Framework template path
  iconFileExtension: string;   // .ts, .tsx, .js
  withAliases: boolean;        // Generate aliases
  renderUniqueKey: boolean;    // Add unique keys (React)
  separateAliasesFile: boolean;
  exportFileName: string;      // index.ts
}

// Core functions
async function buildIcons(options: BuildIconsOptions) {
  const svgFiles = await readSvgDirectory(ICONS_DIR);
  const icons = await renderIconsObject(svgFiles, ICONS_DIR);
  const iconMetaData = await getIconMetaData(ICONS_DIR);

  await generateIconFiles({ icons, template, metadata });
  await generateExportsFile(icons);
  if (withAliases) await generateAliasesFiles(icons, metadata);
}
```

**Template Example** (React):
```typescript
// packages/react/scripts/exportTemplate.mts
export default ({ componentName, children, iconName }) => `
import createLucideIcon from '../createLucideIcon';

const ${componentName} = createLucideIcon('${iconName}', [
  ${children}
]);

export default ${componentName};
`;
```

**9-Style Handling Strategy**:
```typescript
// Build script modification for DGA Icons
const STYLES = [
  'stroke-rounded', 'stroke-sharp', 'stroke-standard',
  'solid-rounded', 'solid-sharp', 'solid-standard',
  'duotone-rounded', 'twotone-rounded', 'bulk-rounded'
];

for (const style of STYLES) {
  await buildIcons({
    output: `./packages/react/src/icons/${style}`,
    templateSrc: './packages/react/scripts/exportTemplate.mts',
    iconsDir: `./icons/${style}`,
    exportFileName: 'index.ts'
  });
}
```

**Alternatives Considered**:
- **SVGR**: Great for React but not framework-agnostic
- **Manual generation**: Not scalable for 39,000+ icons
- **Runtime parsing**: Performance overhead, larger bundles

---

## 3. Multi-Color Icon Implementation

### Decision: CSS Custom Properties with Fallback

**Rationale**:
After analyzing DGA's duotone/twotone/bulk SVGs, they use `opacity` attributes and multiple `<path>` elements. CSS custom properties allow runtime color customization without SVG manipulation.

**Multi-Color Pattern Analysis**:

**Duotone Pattern** (fuel-01.svg):
```svg
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <!-- Background/secondary with opacity -->
  <path fill="currentColor" opacity="0.4" d="..."/>
  <!-- Foreground/primary solid -->
  <path fill="currentColor" d="..."/>
</svg>
```

**Twotone Pattern**: Similar to duotone but opacity values differ
**Bulk Pattern**: Main shape with accent overlays

**Implementation Strategy**:

**SVG Transformation** (during build):
```typescript
// Transform multi-color SVGs to use CSS variables
function transformMultiColorSVG(svgContent: string, style: string): string {
  if (!isMultiColorStyle(style)) return svgContent;

  // Replace fill="currentColor" based on opacity
  return svgContent
    .replace(
      /(<path[^>]*opacity="0\.\d+"[^>]*fill=")currentColor(")/g,
      '$1var(--ruman-icon-secondary, currentColor)$2'
    )
    .replace(
      /(<path[^>]*fill=")currentColor("(?![^<]*opacity))/g,
      '$1var(--ruman-icon-primary, currentColor)$2'
    );
}

const MULTI_COLOR_STYLES = ['duotone-rounded', 'twotone-rounded', 'bulk-rounded'];
```

**React Component API**:
```typescript
interface IconProps {
  size?: number | string;
  color?: string;           // Single-color icons
  primaryColor?: string;    // Multi-color primary
  secondaryColor?: string;  // Multi-color secondary
  strokeWidth?: number;     // For stroke styles
  className?: string;
  style?: React.CSSProperties;
}

// Implementation in createLucideIcon
const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ primaryColor, secondaryColor, color, style, ...props }, ref) => {
    const computedStyle = {
      ...style,
      '--ruman-icon-primary': primaryColor || color || 'currentColor',
      '--ruman-icon-secondary': secondaryColor || color || 'currentColor',
    } as React.CSSProperties;

    return <svg ref={ref} style={computedStyle} {...props}>{children}</svg>;
  }
);
```

**Vue Component API**:
```vue
<script setup lang="ts">
const props = defineProps<{
  size?: number | string;
  primaryColor?: string;
  secondaryColor?: string;
  color?: string;
}>();

const style = computed(() => ({
  '--ruman-icon-primary': props.primaryColor || props.color || 'currentColor',
  '--ruman-icon-secondary': props.secondaryColor || props.color || 'currentColor',
}));
</script>

<template>
  <svg :style="style">
    <!-- SVG content -->
  </svg>
</template>
```

**Alternatives Considered**:
- **Inline style attributes**: Not runtime customizable
- **Multiple SVG variants**: 3x file size increase
- **JavaScript path manipulation**: Complex, performance overhead

---

## 4. TypeScript & Type Generation

### Decision: Auto-generated String Literal Union Types

**Rationale**:
Lucide generates TypeScript definition files with icon name unions for autocomplete. With 4,300+ icons per style, manual types are impossible.

**Implementation**:

**Type Generation Script** (`scripts/generateTypes.mts`):
```typescript
import { readAllStyles } from './build-helpers/readAllStyles';
import fs from 'fs/promises';

async function generateIconTypes() {
  const styles = await readAllStyles('./icons');

  for (const [styleName, icons] of Object.entries(styles)) {
    const iconNames = icons.map(icon => icon.name);

    // Generate icon names union type
    const typeContent = `
export type IconName =
${iconNames.map(name => `  | '${name}'`).join('\n')};

export const iconNames: readonly IconName[] = [
${iconNames.map(name => `  '${name}',`).join('\n')}
] as const;
`;

    await fs.writeFile(
      `./packages/icons/src/types/${styleName}.ts`,
      typeContent
    );
  }
}
```

**Generated Type Files**:
```typescript
// packages/icons/src/types/stroke-rounded.ts
export type IconName =
  | 'home'
  | 'settings'
  | 'user'
  // ... 4,300+ more
  ;

export const iconNames: readonly IconName[] = [
  'home',
  'settings',
  // ...
] as const;
```

**Package Types Structure**:
```typescript
// packages/react/src/types.ts
import type { IconName as StrokeRoundedName } from '@ruman/icons/types/stroke-rounded';
import type { IconName as SolidRoundedName } from '@ruman/icons/types/solid-rounded';
// ... other styles

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: number | string;
  color?: string;
  primaryColor?: string;
  secondaryColor?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}

export type StrokeRoundedIcons = Record<StrokeRoundedName, React.FC<IconProps>>;
export type SolidRoundedIcons = Record<SolidRoundedName, React.FC<IconProps>>;
```

**Auto-import Support** (for IDEs):
```typescript
// packages/react/src/icons/stroke-rounded/index.ts
export { default as Home } from './Home';
export { default as Settings } from './Settings';
// ... auto-generated from build-icons

// Type-safe imports
import type { Home } from '@ruman/react/icons/stroke-rounded';
```

**Alternatives Considered**:
- **Manual types**: Impossible to maintain 39,000+ icons
- **Generic type parameter**: Poor DX, no autocomplete
- **String types only**: Works but loses compile-time validation

---

## 5. Testing Strategy

### Decision: Vitest + Testing Library + Bundle Analysis

**Rationale**:
Lucide uses Vitest (fast, ESM-native, Vite integration) with Testing Library for component tests. This stack is modern and supports all our frameworks.

**Testing Stack**:
```json
{
  "devDependencies": {
    "vitest": "^3.1.3",
    "@testing-library/react": "^14.1.2",
    "@testing-library/vue": "^8.0.0",
    "@testing-library/svelte": "^4.0.0",
    "@testing-library/jest-dom": "^6.1.6",
    "@vitest/coverage-v8": "^3.1.3",
    "jest-serializer-html": "^7.1.0"
  }
}
```

**Test Structure Per Package**:
```
packages/react/
├── src/
│   ├── icons/
│   ├── createLucideIcon.ts
│   └── Icon.ts
├── tests/
│   ├── Icon.test.tsx           # Core component tests
│   ├── multiColor.test.tsx     # Multi-color prop tests
│   ├── treeShaking.test.ts     # Import size tests
│   ├── accessibility.test.tsx  # A11y tests
│   └── snapshots/              # Visual snapshots
└── vitest.config.ts
```

**Core Test Examples**:

**Component Rendering** (Icon.test.tsx):
```typescript
import { render } from '@testing-library/react';
import { Home } from '../src/icons/stroke-rounded';

describe('Icon Component', () => {
  it('renders with default props', () => {
    const { container } = render(<Home />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('applies size prop correctly', () => {
    const { container } = render(<Home size={32} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('supports string size values', () => {
    const { container } = render(<Home size="2rem" />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '2rem');
  });
});
```

**Multi-Color Tests** (multiColor.test.tsx):
```typescript
import { render } from '@testing-library/react';
import { Home } from '../src/icons/duotone-rounded';

describe('Multi-Color Icons', () => {
  it('applies primaryColor via CSS variable', () => {
    const { container } = render(<Home primaryColor="#3B82F6" />);
    const svg = container.querySelector('svg');

    expect(svg?.style.getPropertyValue('--ruman-icon-primary')).toBe('#3B82F6');
  });

  it('applies secondaryColor via CSS variable', () => {
    const { container } = render(<Home secondaryColor="#93C5FD" />);
    const svg = container.querySelector('svg');

    expect(svg?.style.getPropertyValue('--ruman-icon-secondary')).toBe('#93C5FD');
  });

  it('falls back to currentColor when colors not specified', () => {
    const { container } = render(<Home />);
    const svg = container.querySelector('svg');

    expect(svg?.style.getPropertyValue('--ruman-icon-primary')).toBe('currentColor');
  });
});
```

**Tree-Shaking Tests** (treeShaking.test.ts):
```typescript
import { test, expect } from 'vitest';
import { rollup } from 'rollup';

test('tree-shaking removes unused icons', async () => {
  const bundle = await rollup({
    input: 'test-fixtures/single-icon.ts',
    plugins: [/* rollup plugins */]
  });

  const { output } = await bundle.generate({ format: 'esm' });
  const code = output[0].code;

  // Should only contain Home, not Settings
  expect(code).toContain('Home');
  expect(code).not.toContain('Settings');
});
```

**Bundle Size Tests** (`vitest.config.ts`):
```typescript
export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      threshold: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

**CI Test Matrix** (`.github/workflows/test.yml`):
```yaml
strategy:
  matrix:
    framework: [react, vue, svelte, solid, angular]
    node-version: [18, 20, 22]

steps:
  - name: Run tests
    run: |
      pnpm --filter @ruman/${{ matrix.framework }} test

  - name: Check bundle size
    run: |
      pnpm --filter @ruman/${{ matrix.framework }} build
      pnpm run analyze:bundle ${{ matrix.framework }}
```

**Coverage Goals**:
- Unit tests: >80% coverage
- Component tests: All props tested
- Integration tests: Framework-specific rendering
- Bundle size tests: Automated on PR
- Visual regression: Phase 2 (Chromatic/Percy)

**Alternatives Considered**:
- **Jest**: Slower, ESM issues, outdated
- **Cypress Component Testing**: Heavier, slower
- **Playwright**: Better for E2E, overkill for components

---

## 6. Package Publishing & Versioning

### Decision: Manual Versioning + GitHub Actions Workflow

**Rationale**:
Lucide uses a custom versioning script (`.github/workflows/version-up.sh`) triggered by conventional commits. This is simpler than Changesets for our atomic release strategy.

**Versioning Strategy**:

**Version Synchronization**:
```json
{
  "name": "@ruman/react",
  "version": "0.1.0"
}
```
All packages share same MAJOR.MINOR version (0.1.0), different PATCH allowed.

**Publishing Workflow** (`.github/workflows/publish.yml`):
```yaml
name: Publish Packages

on:
  push:
    branches:
      - main
    paths:
      - 'packages/**'

jobs:
  version-and-publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build all packages
        run: pnpm build:all

      - name: Run tests
        run: pnpm test

      - name: Bump version
        id: version
        run: |
          VERSION=$(node ./scripts/bumpVersion.mts)
          echo "VERSION=$VERSION" >> $GITHUB_OUTPUT

      - name: Publish to npm
        run: |
          pnpm --filter "./packages/**" publish --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v${{ steps.version.outputs.VERSION }}
          generate_release_notes: true
```

**Version Bump Script** (`scripts/bumpVersion.mts`):
```typescript
import { readFileSync, writeFileSync } from 'fs';
import { globby } from 'globby';
import semver from 'semver';

async function bumpVersion() {
  const packageJsonFiles = await globby('packages/*/package.json');
  const rootPkg = JSON.parse(readFileSync('package.json', 'utf-8'));

  const currentVersion = rootPkg.version;
  const newVersion = semver.inc(currentVersion, 'minor'); // or 'patch'

  // Update root package.json
  rootPkg.version = newVersion;
  writeFileSync('package.json', JSON.stringify(rootPkg, null, 2));

  // Update all packages
  for (const pkgFile of packageJsonFiles) {
    const pkg = JSON.parse(readFileSync(pkgFile, 'utf-8'));
    pkg.version = newVersion;
    writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
  }

  console.log(newVersion);
}

bumpVersion();
```

**CHANGELOG Generation** (`scripts/generateChangelog.mts`):
```typescript
import simpleGit from 'simple-git';

async function generateChangelog(oldTag: string) {
  const git = simpleGit();
  const log = await git.log({ from: oldTag, to: 'HEAD' });

  const features = log.all.filter(c => c.message.startsWith('feat:'));
  const fixes = log.all.filter(c => c.message.startsWith('fix:'));

  let changelog = '## Changes\n\n';

  if (features.length) {
    changelog += '### Features\n';
    features.forEach(f => changelog += `- ${f.message}\n`);
  }

  if (fixes.length) {
    changelog += '\n### Bug Fixes\n';
    fixes.forEach(f => changelog += `- ${f.message}\n`);
  }

  return changelog;
}
```

**Manual Release Process**:
1. Merge feature branch to `main`
2. CI detects package changes
3. Automatic version bump (MINOR for features, PATCH for fixes)
4. All packages published atomically
5. GitHub release created with changelog
6. Git tag created (`v0.1.0`)

**Alternatives Considered**:
- **Changesets**: More complex, requires changeset files per PR
- **Semantic Release**: Good but opinionated, harder to customize
- **Lerna**: Deprecated, no longer maintained

---

## 7. gitignore Best Practices

### Decision: Comprehensive Monorepo .gitignore

**Rationale**:
Based on Lucide's .gitignore, we need to ignore generated files (icons, types, dist) while keeping source templates.

**Recommended .gitignore**:
```gitignore
# System files
.DS_Store
.idea
.vscode
*.log

# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
build
*.tsbuildinfo

# Coverage
coverage
.nyc_output

# Generated icon files (regenerated on build)
packages/*/src/icons/**/*.ts
packages/*/src/icons/**/*.tsx
packages/*/src/icons/**/*.js
!packages/*/src/icons/index.ts

# Generated alias files
packages/*/src/aliases.ts
packages/*/src/aliases/**
!packages/*/src/aliases/index.ts

# Generated dynamic imports
packages/*/src/dynamicIconImports.ts
packages/**/dynamic.d.ts
packages/**/dynamic.mjs
packages/**/dynamicIconImports.*

# Generated types (auto-generated from SVGs)
packages/*/types/**
!packages/*/types/index.d.ts

# License files (copied during build)
packages/*/LICENSE

# Environment files
.env
.env.local
.env*.local

# Documentation builds
docs/.vitepress/cache
docs/.vitepress/dist
docs/.vitepress/.temp
docs/.vitepress/data/iconNodes
docs/.vitepress/data/iconMetaData.ts

# Testing
*.snap

# Turborepo
.turbo

# Misc
.vercel
.nitro
sandbox
stash
outlined
```

**Why These Patterns**:
- **Generated icons**: Rebuilt from SVG sources, no need to commit
- **Types**: Auto-generated, would cause 4,300+ file commits per change
- **Aliases**: Generated based on icon metadata
- **dist**: Build artifacts, published to npm not git
- **Dynamic imports**: Generated for code-splitting support

**Keep in Git**:
- Source SVG files (`icons/**/*.svg`)
- Icon metadata JSON (`icons/**/*.json`)
- Package source code templates
- Build scripts and configuration
- Tests

---

## Summary of Key Technologies

### Build & Tooling
- **Build Tool**: Turborepo v2.x (parallel builds, intelligent caching)
- **Package Manager**: pnpm v10.11.0 (efficient, fast)
- **Bundler**: Rollup v4.x (tree-shaking, multiple formats)
- **TypeScript**: v5.8.3 (strict mode, ES2022 target)
- **Component Generator**: Custom @ruman/build-icons CLI

### Testing & Quality
- **Testing**: Vitest v3.1.3 (fast, ESM-native)
- **Component Testing**: Testing Library (React/Vue/Svelte adapters)
- **Coverage**: v8 coverage provider (>80% target)
- **Bundle Analysis**: Rollup plugin visualizer
- **Linting**: ESLint v8 + Prettier v3

### Multi-Color Implementation
- **Approach**: CSS Custom Properties (`--ruman-icon-primary/secondary`)
- **Fallback**: `currentColor` inheritance
- **Transform**: Build-time SVG transformation
- **Props**: `primaryColor`, `secondaryColor` (all frameworks)

### Type Safety
- **Icon Names**: Auto-generated string literal unions
- **Props**: Framework-specific interfaces with strict typing
- **Exports**: Barrel exports with individual file fallbacks
- **Validation**: TypeScript strict mode + ESLint

### Publishing & Versioning
- **Strategy**: Synchronized versions across packages
- **Automation**: GitHub Actions on merge to main
- **Changelog**: Auto-generated from conventional commits
- **Registry**: npm (@ruman scope), Packagist (PHP), pub.dev (Dart)

### CI/CD Pipeline
- **Provider**: GitHub Actions
- **Triggers**: PR, push to main, tag creation
- **Jobs**: Lint → Test → Build → Publish
- **Matrix**: Multiple Node versions, all frameworks
- **Caching**: pnpm store, Turborepo cache

---

## Implementation Roadmap

### Week 1 - Foundation
1. **Day 1-2**: Set up monorepo structure with Turborepo + pnpm
2. **Day 2-3**: Build @ruman/build-icons CLI tool
3. **Day 3-4**: Implement multi-color CSS variable transformation
4. **Day 4-5**: Generate TypeScript types for all 9 styles
5. **Day 5-6**: Create package templates (React, Vue, Svelte)
6. **Day 6-7**: Set up testing infrastructure and CI/CD

### Week 2 - Package Development
1. Core package (@ruman/icons)
2. React package (@ruman/react)
3. Vue package (@ruman/vue)
4. Svelte package (@ruman/svelte)
5. Angular, Solid, Preact, Astro, Nuxt, Laravel, Static

### Week 3 - Testing & Polish
1. Comprehensive test coverage (>80%)
2. Bundle size optimization
3. Documentation generation
4. GitHub repository setup
5. First beta release (v0.1.0)

---

## Open Questions Resolved

✅ **Turborepo vs plain pnpm?** → Turborepo for better caching
✅ **How to generate 39,000+ components?** → Custom CLI like Lucide
✅ **Multi-color implementation?** → CSS custom properties
✅ **Type generation?** → Auto-generated string unions
✅ **Testing framework?** → Vitest + Testing Library
✅ **Versioning approach?** → Synchronized versions + GitHub Actions
✅ **What to gitignore?** → All generated files except source SVGs

---

**Next Steps**: Proceed to implementation plan (plan.md) using these technical decisions.

**References**:
- Lucide Monorepo: `.claude/lucide-main-full-for-example/`
- DGA SVG Analysis: `icons/duotone-rounded/`, `icons/twotone-rounded/`, `icons/bulk-rounded/`
- Constitution: `.specify/memory/constitution.md`
- Spec: `specs/001-icon-library/spec.md`
