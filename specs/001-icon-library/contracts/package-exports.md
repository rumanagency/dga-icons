# Package Export Structure Contract

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2025-11-18

## Overview

This document defines the standard export structure for all DGA Icons framework packages. It specifies entry points, import paths, module formats, and TypeScript definitions to ensure consistency across all framework-specific packages.

---

## Package Structure

### Standard Package Layout

```
@ruman/{framework}/
├── dist/
│   ├── esm/                     # ES Modules
│   │   ├── icons/               # Generated icon components
│   │   │   ├── stroke-rounded/
│   │   │   │   ├── Home.js
│   │   │   │   ├── Settings.js
│   │   │   │   └── index.js     # Barrel export
│   │   │   ├── solid-rounded/
│   │   │   ├── duotone-rounded/
│   │   │   └── ... (all 9 styles)
│   │   ├── createLucideIcon.js  # Core component factory
│   │   ├── Icon.js              # Generic icon component
│   │   └── index.js             # Main entry
│   ├── cjs/                     # CommonJS
│   │   └── (same structure as esm)
│   ├── umd/                     # UMD bundle
│   │   └── ruman-{framework}.min.js
│   └── types/                   # TypeScript definitions
│       ├── icons/
│       │   ├── stroke-rounded/
│       │   │   ├── Home.d.ts
│       │   │   └── index.d.ts
│       │   └── ...
│       ├── createLucideIcon.d.ts
│       └── index.d.ts
├── src/                         # Source (for debugging)
│   └── (TypeScript source files)
├── package.json
├── README.md
└── LICENSE
```

---

## Package.json Configuration

### Essential Fields

```json
{
  "name": "@ruman/react",
  "version": "0.1.0",
  "description": "DGA Icons library for React - 39,000+ icons across 9 styles",
  "author": "Ruman Agency <hello@ruman.sa>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/rumanagency/dga-icons.git",
    "directory": "packages/react"
  },
  "homepage": "https://github.com/rumanagency/dga-icons#readme",
  "bugs": "https://github.com/rumanagency/dga-icons/issues",
  "keywords": [
    "react",
    "icons",
    "svg",
    "dga",
    "ruman",
    "hugeicons",
    "components",
    "typescript"
  ],
  "sideEffects": false,
  "type": "module"
}
```

### Entry Points (Package Exports)

```json
{
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    },
    "./icons/stroke-rounded": {
      "types": "./dist/types/icons/stroke-rounded/index.d.ts",
      "import": "./dist/esm/icons/stroke-rounded/index.js",
      "require": "./dist/cjs/icons/stroke-rounded/index.js"
    },
    "./icons/stroke-sharp": {
      "types": "./dist/types/icons/stroke-sharp/index.d.ts",
      "import": "./dist/esm/icons/stroke-sharp/index.js",
      "require": "./dist/cjs/icons/stroke-sharp/index.js"
    },
    "./icons/stroke-standard": {
      "types": "./dist/types/icons/stroke-standard/index.d.ts",
      "import": "./dist/esm/icons/stroke-standard/index.js",
      "require": "./dist/cjs/icons/stroke-standard/index.js"
    },
    "./icons/solid-rounded": {
      "types": "./dist/types/icons/solid-rounded/index.d.ts",
      "import": "./dist/esm/icons/solid-rounded/index.js",
      "require": "./dist/cjs/icons/solid-rounded/index.js"
    },
    "./icons/solid-sharp": {
      "types": "./dist/types/icons/solid-sharp/index.d.ts",
      "import": "./dist/esm/icons/solid-sharp/index.js",
      "require": "./dist/cjs/icons/solid-sharp/index.js"
    },
    "./icons/solid-standard": {
      "types": "./dist/types/icons/solid-standard/index.d.ts",
      "import": "./dist/esm/icons/solid-standard/index.js",
      "require": "./dist/cjs/icons/solid-standard/index.js"
    },
    "./icons/duotone-rounded": {
      "types": "./dist/types/icons/duotone-rounded/index.d.ts",
      "import": "./dist/esm/icons/duotone-rounded/index.js",
      "require": "./dist/cjs/icons/duotone-rounded/index.js"
    },
    "./icons/twotone-rounded": {
      "types": "./dist/types/icons/twotone-rounded/index.d.ts",
      "import": "./dist/esm/icons/twotone-rounded/index.js",
      "require": "./dist/cjs/icons/twotone-rounded/index.js"
    },
    "./icons/bulk-rounded": {
      "types": "./dist/types/icons/bulk-rounded/index.d.ts",
      "import": "./dist/esm/icons/bulk-rounded/index.js",
      "require": "./dist/cjs/icons/bulk-rounded/index.js"
    },
    "./icons/*": {
      "types": "./dist/types/icons/*/index.d.ts",
      "import": "./dist/esm/icons/*/index.js",
      "require": "./dist/cjs/icons/*/index.js"
    },
    "./package.json": "./package.json"
  }
}
```

### Peer Dependencies

**React Package**:
```json
{
  "peerDependencies": {
    "react": "^16.8.0 || ^17.0.0 || ^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": false
    }
  }
}
```

**Vue Package**:
```json
{
  "peerDependencies": {
    "vue": "^3.0.0"
  }
}
```

**Svelte Package**:
```json
{
  "peerDependencies": {
    "svelte": "^3.0.0 || ^4.0.0"
  }
}
```

**Angular Package**:
```json
{
  "peerDependencies": {
    "@angular/core": "^12.0.0 || ^13.0.0 || ^14.0.0 || ^15.0.0 || ^16.0.0",
    "@angular/common": "^12.0.0 || ^13.0.0 || ^14.0.0 || ^15.0.0 || ^16.0.0"
  }
}
```

---

## Import Paths & Usage

### Style-Specific Imports (Recommended)

**ES Module Syntax**:
```typescript
// Import specific icons from a style
import { Home, Settings, User } from '@ruman/react/icons/stroke-rounded';

// Import from multiple styles with aliases
import { Home as HomeStroke } from '@ruman/react/icons/stroke-rounded';
import { Home as HomeSolid } from '@ruman/react/icons/solid-rounded';
import { Home as HomeDuotone } from '@ruman/react/icons/duotone-rounded';

// Import single icon (better for tree-shaking)
import Home from '@ruman/react/icons/stroke-rounded/Home';
```

**CommonJS Syntax** (Node.js):
```javascript
// Named imports
const { Home, Settings } = require('@ruman/react/icons/stroke-rounded');

// Default import
const Home = require('@ruman/react/icons/stroke-rounded/Home').default;
```

**TypeScript Imports**:
```typescript
// Import components
import { Home, Settings } from '@ruman/react/icons/stroke-rounded';

// Import types
import type { ReactIconProps, ReactIconComponent } from '@ruman/react';
import type { IconName } from '@ruman/react/icons/stroke-rounded';
```

### Dynamic Imports

**React Lazy Loading**:
```typescript
import { lazy, Suspense } from 'react';

// Lazy load individual icon
const Home = lazy(() => import('@ruman/react/icons/stroke-rounded/Home'));

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <Home size={24} />
</Suspense>
```

**Vue Async Components**:
```typescript
import { defineAsyncComponent } from 'vue';

// Async load icon
const Home = defineAsyncComponent(() =>
  import('@ruman/vue/icons/stroke-rounded/Home')
);
```

**Webpack Code Splitting**:
```typescript
// Dynamic import with webpack magic comments
const iconModule = await import(
  /* webpackChunkName: "icons-stroke-rounded" */
  '@ruman/react/icons/stroke-rounded'
);
const { Home } = iconModule;
```

---

## Module Formats

### ES Modules (ESM)

**Target**: Modern bundlers (Webpack, Vite, Rollup, Parcel), Node.js 14+

**Format**:
```javascript
// dist/esm/icons/stroke-rounded/Home.js
import createLucideIcon from '../../createLucideIcon.js';

const Home = createLucideIcon('Home', [
  ['path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }],
  ['polyline', { points: '9 22 9 12 15 12 15 22' }],
]);

export default Home;
```

**Features**:
- Tree-shaking enabled
- Named and default exports
- `.js` extensions in imports
- No runtime dependencies except framework

### CommonJS (CJS)

**Target**: Node.js <14, legacy bundlers, server-side rendering

**Format**:
```javascript
// dist/cjs/icons/stroke-rounded/Home.js
'use strict';

const createLucideIcon = require('../../createLucideIcon.js');

const Home = createLucideIcon('Home', [
  ['path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }],
  ['polyline', { points: '9 22 9 12 15 12 15 22' }],
]);

module.exports = Home;
exports.default = Home;
```

**Features**:
- `module.exports` for default
- `exports.default` for interop
- Synchronous loading
- Compatible with older Node.js

### UMD Bundle

**Target**: Browser `<script>` tags, legacy environments

**Format**:
```javascript
// dist/umd/ruman-react.min.js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports, require('react'))
    : typeof define === 'function' && define.amd
    ? define(['exports', 'react'], factory)
    : ((global = global || self), factory((global.RumanReact = {}), global.React));
})(this, function (exports, React) {
  'use strict';

  // All icons bundled
  const icons = {
    strokeRounded: {
      Home: createLucideIcon('Home', [/* ... */]),
      Settings: createLucideIcon('Settings', [/* ... */]),
      // ... all icons
    },
    // ... all styles
  };

  exports.icons = icons;
  Object.defineProperty(exports, '__esModule', { value: true });
});
```

**Usage**:
```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/@ruman/react@0.1.0/dist/umd/ruman-react.min.js"></script>
<script>
  const { Home } = RumanReact.icons.strokeRounded;
  // Use Home component
</script>
```

**Bundle Sizes**:
- All styles + all icons: ~2.5MB (uncompressed), ~400KB (gzipped)
- Single style: ~280KB (uncompressed), ~45KB (gzipped)

**Recommendation**: Use ESM imports instead of UMD for better tree-shaking

---

## TypeScript Definitions

### Type Declaration Files

**Main Entry** (`dist/types/index.d.ts`):
```typescript
// Export core types
export type { IconProps, ReactIconProps, ReactIconComponent } from './types.js';

// Export icon factory
export { default as createLucideIcon } from './createLucideIcon.js';

// Export generic Icon component
export { default as Icon } from './Icon.js';

// Re-export all styles (barrel exports)
export * as strokeRounded from './icons/stroke-rounded/index.js';
export * as strokeSharp from './icons/stroke-sharp/index.js';
export * as strokeStandard from './icons/stroke-standard/index.js';
export * as solidRounded from './icons/solid-rounded/index.js';
export * as solidSharp from './icons/solid-sharp/index.js';
export * as solidStandard from './icons/solid-standard/index.js';
export * as duotoneRounded from './icons/duotone-rounded/index.js';
export * as twotoneRounded from './icons/twotone-rounded/index.js';
export * as bulkRounded from './icons/bulk-rounded/index.js';
```

**Style Barrel Export** (`dist/types/icons/stroke-rounded/index.d.ts`):
```typescript
import type { ReactIconComponent } from '../../types.js';

// Individual icon exports
export declare const Home: ReactIconComponent;
export declare const Settings: ReactIconComponent;
export declare const User: ReactIconComponent;
// ... 4,300+ icons

// Icon name type
export type IconName =
  | 'home'
  | 'settings'
  | 'user'
  // ... 4,300+ names
  ;

// Icon names array
export declare const iconNames: readonly IconName[];

// Default export (all icons as object)
declare const icons: Record<string, ReactIconComponent>;
export default icons;
```

**Individual Icon** (`dist/types/icons/stroke-rounded/Home.d.ts`):
```typescript
import type { ReactIconComponent } from '../../types.js';

declare const Home: ReactIconComponent;
export default Home;
```

### TypeScript Configuration

**tsconfig.json** (Package):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist/types",
    "rootDir": "./src",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

---

## Tree-Shaking Configuration

### Rollup Config (Example)

```javascript
// rollup.config.js
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default defineConfig([
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    plugins: [
      typescript({
        outDir: 'dist/esm',
        declaration: false,
      }),
    ],
    external: ['react', 'react/jsx-runtime'],
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    plugins: [
      typescript({
        outDir: 'dist/cjs',
        declaration: false,
      }),
    ],
    external: ['react', 'react/jsx-runtime'],
  },
  // TypeScript declarations
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/types',
    },
    plugins: [
      typescript({
        outDir: 'dist/types',
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
      }),
    ],
  },
]);
```

### Tree-Shaking Verification

**Test Setup** (`test-tree-shaking.js`):
```javascript
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

async function testTreeShaking() {
  const bundle = await rollup({
    input: 'test/fixtures/single-icon.js',
    plugins: [nodeResolve(), terser()],
  });

  const { output } = await bundle.generate({
    format: 'esm',
  });

  const code = output[0].code;
  const size = Buffer.byteLength(code, 'utf8');

  console.log(`Bundle size: ${size} bytes`);
  console.log(`Contains "Home": ${code.includes('Home')}`);
  console.log(`Contains "Settings": ${code.includes('Settings')}`); // Should be false

  if (size > 2000) {
    throw new Error('Bundle size too large! Tree-shaking may not be working.');
  }
}

testTreeShaking();
```

---

## CDN Hosting

### jsDelivr

**Latest Version**:
```html
<!-- ESM -->
<script type="module">
  import { Home } from 'https://cdn.jsdelivr.net/npm/@ruman/react@latest/+esm';
</script>

<!-- Specific version -->
<script type="module">
  import { Home } from 'https://cdn.jsdelivr.net/npm/@ruman/react@0.1.0/+esm';
</script>

<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/@ruman/react@0.1.0/dist/umd/ruman-react.min.js"></script>
```

### unpkg

**Latest Version**:
```html
<!-- ESM -->
<script type="module">
  import { Home } from 'https://unpkg.com/@ruman/react@latest?module';
</script>

<!-- UMD -->
<script src="https://unpkg.com/@ruman/react@0.1.0/dist/umd/ruman-react.min.js"></script>
```

### Custom CDN (Optional)

**Cloudflare R2 / AWS S3**:
```
https://icons.ruman.sa/@ruman/react@0.1.0/dist/esm/icons/stroke-rounded/Home.js
https://icons.ruman.sa/@ruman/react@0.1.0/dist/umd/ruman-react.min.js
```

---

## Versioning & Compatibility

### Semantic Versioning

**Format**: `MAJOR.MINOR.PATCH`

**Example**: `0.1.0`

**Rules**:
- **MAJOR**: Breaking API changes (e.g., prop renames, removed icons)
- **MINOR**: New features (e.g., new icons, new styles, new props)
- **PATCH**: Bug fixes, performance improvements

**Pre-releases**:
- `0.1.0-beta.1`: Beta releases
- `0.1.0-alpha.1`: Alpha releases
- `0.1.0-rc.1`: Release candidates

### Version Synchronization

All framework packages share the same MAJOR.MINOR version:
- `@ruman/react@0.1.0`
- `@ruman/vue@0.1.0`
- `@ruman/svelte@0.1.0`

PATCH versions may differ for framework-specific fixes:
- `@ruman/react@0.1.1` (React-specific fix)
- `@ruman/vue@0.1.0` (no change)

---

## Package Size Targets

### Bundle Size Limits

| Metric | Target | Maximum |
|--------|--------|---------|
| Single icon (minified + gzipped) | 0.5KB | 1KB |
| 10 icons (minified + gzipped) | 5KB | 10KB |
| 100 icons (minified + gzipped) | 50KB | 100KB |
| Full package (all icons, all styles) | N/A | 5MB |

### Size Analysis

**Tools**:
- `bundlesize` - CI bundle size checks
- `rollup-plugin-visualizer` - Bundle composition analysis
- `webpack-bundle-analyzer` - Webpack bundle analysis

**Example** (package.json):
```json
{
  "scripts": {
    "analyze": "rollup -c --environment ANALYZE"
  },
  "bundlesize": [
    {
      "path": "./dist/esm/icons/stroke-rounded/Home.js",
      "maxSize": "1KB"
    }
  ]
}
```

---

## Error Handling

### Import Errors

**Non-existent Icon**:
```typescript
// TypeScript error at compile time
import { NonExistentIcon } from '@ruman/react/icons/stroke-rounded';
// Error: Module '"@ruman/react/icons/stroke-rounded"' has no exported member 'NonExistentIcon'
```

**Invalid Style Path**:
```typescript
// Module not found
import { Home } from '@ruman/react/icons/invalid-style';
// Error: Cannot find module '@ruman/react/icons/invalid-style'
```

**CommonJS/ESM Interop**:
```javascript
// CJS importing ESM (Node.js 14+)
const { Home } = await import('@ruman/react/icons/stroke-rounded');

// CJS importing ESM (Node.js <14)
// Error: Must use dynamic import() or upgrade Node.js
```

---

## Publishing Checklist

Before publishing a package to npm:

- [ ] All 9 style directories exist in `dist/esm/icons/`
- [ ] All 9 style directories exist in `dist/cjs/icons/`
- [ ] All 9 style directories exist in `dist/types/icons/`
- [ ] UMD bundle exists and is minified
- [ ] `package.json` has correct version, exports, and peer dependencies
- [ ] TypeScript definitions compile without errors
- [ ] Tree-shaking test passes
- [ ] Bundle size is within targets
- [ ] README.md is up to date
- [ ] LICENSE file is included
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Package installs correctly (`npm pack` → `npm install`)

---

## Contract Compliance Checklist

All framework packages must:

- [ ] Export icons from style-specific paths (`/icons/{style}`)
- [ ] Support ESM, CJS, and UMD formats
- [ ] Include TypeScript definitions for all exports
- [ ] Enable tree-shaking (sideEffects: false)
- [ ] Provide individual icon exports for optimal tree-shaking
- [ ] Include all 9 styles with consistent structure
- [ ] Follow package.json exports structure
- [ ] Set correct peer dependencies
- [ ] Support dynamic imports
- [ ] Include source maps for debugging
- [ ] Stay within bundle size targets
- [ ] Work with major CDN providers (jsDelivr, unpkg)

---

**Document Status**: Draft
**Next Review**: After Phase 1 implementation
**Maintainer**: Ruman Agency Development Team
