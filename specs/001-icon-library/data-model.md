# Data Model: DGA Icons Library

**Feature Branch**: `001-icon-library`
**Created**: 2025-11-18
**Status**: Phase 1 - Foundation
**Version**: 1.0.0

## Overview

This document defines the complete data architecture for managing 39,186 SVG icons across 9 visual styles in a monorepo structure. The data model supports multi-framework package generation, icon metadata management, multi-color customization, and efficient build pipelines.

**Core Architecture Principles**:
- **Single Source of Truth**: All icon data originates from optimized SVG files in `icons/{style}/` directories
- **Build-Time Generation**: Icon components, types, and metadata are generated at build time, not committed to git
- **Framework-Agnostic Core**: Icon data stored separately from framework-specific implementations
- **Type-Safe**: Full TypeScript support with auto-generated string literal unions for icon names

---

## Entities

### 1. Icon

**Description**: Represents a single icon design (e.g., "home", "user", "settings") that exists across all 9 visual styles.

**Storage**: Source SVG files in `icons/{style}/{name}.svg`

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `name` | `string` | Yes | Unique kebab-case identifier | `"home-icon"` |
| `displayName` | `string` | Yes | Human-readable PascalCase name | `"HomeIcon"` |
| `styles` | `StyleName[]` | Yes | All 9 style variants | `["stroke-rounded", "solid-rounded", ...]` |
| `categories` | `Category[]` | No | Semantic groupings | `["Navigation", "Buildings"]` |
| `tags` | `string[]` | No | Searchable keywords | `["house", "main", "dashboard"]` |
| `aliases` | `string[]` | No | Alternative names | `["house", "residence"]` |
| `multiColor` | `boolean` | Yes | Supports multi-color customization | `true` (duotone/twotone/bulk) |
| `colorCount` | `1 \| 2` | Yes | Number of customizable colors | `2` (multi-color), `1` (single) |
| `fileSize` | `number` | Yes | Average optimized size in bytes | `412` |
| `pathCount` | `number` | Yes | Number of SVG path elements | `2` |

**Validation Rules**:
- `name` MUST be unique across all icons (no duplicates)
- `name` MUST be kebab-case (lowercase, hyphen-separated)
- Icon MUST exist in all 9 style directories (style parity requirement)
- SVG MUST be valid XML and pass SVGO optimization
- File size MUST be < 5KB per icon
- No JavaScript, external references, or raster images in SVG

**Relationships**:
- **Has many** `IconStyle` (exactly 9, one per style)
- **Belongs to many** `Category` (0 or more categories)
- **Has many** `Tag` (0 or more tags)
- **Referenced by** `IconComponent` (generated components across frameworks)

**Example**:
```typescript
{
  name: "home-icon",
  displayName: "HomeIcon",
  styles: [
    "bulk-rounded", "duotone-rounded", "solid-rounded",
    "solid-sharp", "solid-standard", "stroke-rounded",
    "stroke-sharp", "stroke-standard", "twotone-rounded"
  ],
  categories: ["Navigation", "Buildings"],
  tags: ["house", "main", "dashboard", "homepage"],
  aliases: ["house", "residence"],
  multiColor: false,
  colorCount: 1,
  fileSize: 412,
  pathCount: 2
}
```

---

### 2. IconStyle

**Description**: One visual variant of an icon (e.g., "home" in "stroke-rounded" style). Each icon has exactly 9 IconStyle instances.

**Storage**: Individual SVG file at `icons/{styleName}/{iconName}.svg`

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `iconName` | `string` | Yes | References parent Icon | `"home-icon"` |
| `styleName` | `StyleName` | Yes | One of 9 styles | `"stroke-rounded"` |
| `svgContent` | `string` | Yes | Optimized SVG markup | `"<svg xmlns=..."` |
| `viewBox` | `string` | Yes | Standardized viewBox | `"0 0 24 24"` |
| `width` | `number` | Yes | Default width | `24` |
| `height` | `number` | Yes | Default height | `24` |
| `paths` | `SVGPathData[]` | Yes | Parsed SVG path elements | `[{ d: "M3 12...", fill: "currentColor" }]` |
| `hasOpacity` | `boolean` | Yes | Contains opacity attributes | `true` (duotone) |
| `hasMultiColor` | `boolean` | Yes | Requires color customization | `true` (duotone/twotone/bulk) |
| `fileSize` | `number` | Yes | Optimized size in bytes | `412` |
| `hash` | `string` | Yes | SHA-256 hash for cache busting | `"a3f2e1..."` |

**Validation Rules**:
- `viewBox` MUST be `"0 0 24 24"` (standardized)
- `svgContent` MUST use `currentColor` or CSS variables for fills/strokes
- No `<script>`, `<foreignObject>`, or external `<image>` elements
- All paths MUST be closed and valid
- Decimal precision reduced to 2 places max
- File size < 5KB
- No embedded styles (use inline attributes)

**Relationships**:
- **Belongs to** `Icon` (references icon name)
- **Belongs to** `Style` (references style name)

**Example**:
```typescript
{
  iconName: "home-icon",
  styleName: "stroke-rounded",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-width="2" d="M3 12l9-9 9 9"/>
  </svg>`,
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  paths: [
    { d: "M3 12l9-9 9 9", stroke: "currentColor", strokeWidth: 2 }
  ],
  hasOpacity: false,
  hasMultiColor: false,
  fileSize: 412,
  hash: "a3f2e1b4c5d6..."
}
```

---

### 3. IconMetadata

**Description**: Searchable metadata catalog for all icons, generated at build time and used for icon discovery, search, and documentation.

**Storage**: `icons/metadata.json` (auto-generated, not committed to git)

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `version` | `string` | Yes | Metadata schema version | `"1.0.0"` |
| `iconCount` | `number` | Yes | Total unique icons | `4354` |
| `styleCount` | `number` | Yes | Number of styles | `9` |
| `totalFiles` | `number` | Yes | Total SVG files | `39186` |
| `icons` | `IconRecord` | Yes | Map of icon name to metadata | `{ "home": {...} }` |
| `categories` | `CategoryMap` | Yes | Category definitions | `{ "Navigation": {...} }` |
| `tags` | `TagMap` | Yes | Tag index | `{ "house": ["home", ...] }` |
| `generatedAt` | `string` | Yes | ISO 8601 timestamp | `"2025-11-18T10:30:00Z"` |

**IconRecord Schema**:
```typescript
interface IconRecord {
  name: string;
  displayName: string;
  categories: string[];
  tags: string[];
  aliases: string[];
  multiColor: boolean;
  popularityScore: number; // 0-100, based on usage analytics
  styles: {
    [styleName: string]: {
      fileSize: number;
      pathCount: number;
      hash: string;
    };
  };
}
```

**Example**:
```json
{
  "version": "1.0.0",
  "iconCount": 4354,
  "styleCount": 9,
  "totalFiles": 39186,
  "generatedAt": "2025-11-18T10:30:00Z",
  "icons": {
    "home": {
      "name": "home",
      "displayName": "Home",
      "categories": ["Navigation", "Buildings"],
      "tags": ["house", "main", "homepage", "dashboard"],
      "aliases": ["house", "residence"],
      "multiColor": false,
      "popularityScore": 95,
      "styles": {
        "stroke-rounded": {
          "fileSize": 412,
          "pathCount": 2,
          "hash": "a3f2e1..."
        },
        "solid-rounded": {
          "fileSize": 389,
          "pathCount": 1,
          "hash": "b4f3e2..."
        }
      }
    }
  },
  "categories": {
    "Navigation": {
      "name": "Navigation",
      "description": "Icons for navigation and wayfinding",
      "iconCount": 245,
      "icons": ["home", "menu", "arrow-left", ...]
    }
  },
  "tags": {
    "house": ["home", "building", "residence"],
    "dashboard": ["home", "analytics", "stats"]
  }
}
```

---

### 4. Category

**Description**: Hierarchical semantic grouping of icons for discovery and organization.

**Storage**: `categories.json` (manually curated, committed to git)

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | `string` | Yes | Unique identifier | `"navigation"` |
| `name` | `string` | Yes | Display name | `"Navigation"` |
| `description` | `string` | No | Category description | `"Icons for navigation..."` |
| `iconCount` | `number` | Yes | Number of icons in category | `245` |
| `parentCategory` | `string \| null` | No | Parent category ID | `"ui-elements"` or `null` |
| `iconNames` | `string[]` | Yes | List of icon names | `["home", "menu", "arrow-left"]` |

**Validation Rules**:
- `id` MUST be unique and kebab-case
- `name` MUST be title case
- Hierarchical depth limited to 2 levels (parent → child)
- All `iconNames` MUST reference valid icons

**Example**:
```json
{
  "id": "navigation",
  "name": "Navigation",
  "description": "Icons for navigation, wayfinding, and directional indicators",
  "iconCount": 245,
  "parentCategory": null,
  "iconNames": ["home", "menu", "arrow-left", "arrow-right", "chevron-up"]
}
```

---

### 5. Style

**Description**: One of 9 visual style variants (stroke, solid, duotone, etc.). Defines global style properties.

**Storage**: `styles.json` (configuration file, committed to git)

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `name` | `StyleName` | Yes | Unique style identifier | `"stroke-rounded"` |
| `displayName` | `string` | Yes | Human-readable name | `"Stroke Rounded"` |
| `description` | `string` | No | Style description | `"Outlined icons with rounded corners"` |
| `multiColor` | `boolean` | Yes | Supports multiple colors | `false` |
| `defaultStrokeWidth` | `number \| null` | No | Default stroke width | `2` (stroke styles only) |
| `iconCount` | `number` | Yes | Number of icons in style | `4354` |
| `directoryPath` | `string` | Yes | Source directory | `"icons/stroke-rounded"` |

**StyleName Type**:
```typescript
type StyleName =
  | 'bulk-rounded'
  | 'duotone-rounded'
  | 'solid-rounded'
  | 'solid-sharp'
  | 'solid-standard'
  | 'stroke-rounded'
  | 'stroke-sharp'
  | 'stroke-standard'
  | 'twotone-rounded';
```

**Example**:
```json
{
  "name": "stroke-rounded",
  "displayName": "Stroke Rounded",
  "description": "Outlined icons with rounded line caps and corners",
  "multiColor": false,
  "defaultStrokeWidth": 2,
  "iconCount": 4354,
  "directoryPath": "icons/stroke-rounded"
}
```

---

### 6. Package

**Description**: Framework-specific distribution package generated from core icon data.

**Storage**: `packages/{framework}/` directory with source code and build configuration

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `name` | `string` | Yes | npm package name | `"@ruman/react"` |
| `version` | `string` | Yes | Semantic version | `"0.1.0"` |
| `framework` | `FrameworkType` | Yes | Target framework | `"react"` |
| `dependencies` | `DependencyMap` | No | Runtime dependencies | `{ "react": ">=16.8" }` |
| `peerDependencies` | `DependencyMap` | No | Peer dependencies | `{ "react": ">=16.8" }` |
| `buildConfig` | `BuildConfig` | Yes | Build configuration | `{ bundler: "rollup", ... }` |
| `exports` | `ExportMap` | Yes | Package exports | `{ ".": "./dist/index.mjs" }` |
| `sideEffects` | `boolean` | Yes | Side effects flag | `false` (tree-shakeable) |

**FrameworkType**:
```typescript
type FrameworkType =
  | 'core'        // @ruman/icons (vanilla JS/TS)
  | 'react'       // @ruman/react
  | 'vue'         // @ruman/vue
  | 'angular'     // @ruman/angular
  | 'svelte'      // @ruman/svelte
  | 'solid'       // @ruman/solid
  | 'preact'      // @ruman/preact
  | 'astro'       // @ruman/astro
  | 'nuxt'        // @ruman/nuxt
  | 'laravel'     // @ruman/laravel
  | 'react-native' // @ruman/react-native
  | 'static'      // @ruman/static
  | 'webfont';    // @ruman/webfont
```

**Example package.json**:
```json
{
  "name": "@ruman/react",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./icons/stroke-rounded": {
      "import": "./dist/icons/stroke-rounded/index.mjs",
      "require": "./dist/icons/stroke-rounded/index.cjs",
      "types": "./dist/icons/stroke-rounded/index.d.ts"
    }
  },
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  "sideEffects": false,
  "license": "MIT"
}
```

---

### 7. IconComponent (Generated)

**Description**: Framework-specific icon component generated from IconStyle SVG data.

**Storage**: Auto-generated in `packages/{framework}/src/icons/{style}/{name}.tsx` (not committed)

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `componentName` | `string` | Yes | PascalCase component name | `"Home"` |
| `iconName` | `string` | Yes | Kebab-case icon name | `"home"` |
| `styleName` | `StyleName` | Yes | Style variant | `"stroke-rounded"` |
| `framework` | `FrameworkType` | Yes | Target framework | `"react"` |
| `filePath` | `string` | Yes | Generated file path | `"packages/react/src/icons/stroke-rounded/Home.tsx"` |
| `exports` | `string[]` | Yes | Export types | `["default", "Home"]` |
| `svgNodes` | `SVGNode[]` | Yes | Parsed SVG elements | `[["path", { d: "M3...", stroke: "currentColor" }]]` |

**SVGNode Type**:
```typescript
type SVGNode = [
  elementName: string,
  attrs: Record<string, string | number>,
  children?: SVGNode[]
];
```

**Example Generated React Component**:
```tsx
// packages/react/src/icons/stroke-rounded/Home.tsx (auto-generated)
import createLucideIcon from '../../createLucideIcon';

const Home = createLucideIcon('Home', [
  ['path', { d: 'M3 12l9-9 9 9', stroke: 'currentColor', strokeWidth: 2 }]
]);

export default Home;
```

**Example Generated Vue Component**:
```vue
<!-- packages/vue/src/icons/stroke-rounded/Home.vue (auto-generated) -->
<script setup lang="ts">
import type { IconProps } from '../../types';

const props = withDefaults(defineProps<IconProps>(), {
  size: 24,
  color: 'currentColor'
});
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none">
    <path d="M3 12l9-9 9 9" :stroke="color" stroke-width="2" />
  </svg>
</template>
```

---

## Data Flow

### Icon Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. SOURCE SVG FILES                                             │
│    icons/{style}/{name}.svg (39,186 files)                      │
│    - Exported from Figma (HugeIcons V4)                         │
│    - Manual additions via PR process                            │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. SVGO OPTIMIZATION                                            │
│    scripts/optimizeSvgs.mts                                     │
│    - Remove metadata, comments, editor artifacts                │
│    - Standardize viewBox to "0 0 24 24"                         │
│    - Convert colors to currentColor                             │
│    - Simplify paths, reduce decimal precision                   │
│    - Output: Optimized SVGs (30-40% size reduction)             │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. VALIDATION                                                   │
│    scripts/validateIcons.mts                                    │
│    - Check viewBox consistency                                  │
│    - Verify style parity (all icons in all 9 styles)            │
│    - Validate SVG structure                                     │
│    - Check file size limits (<5KB)                              │
│    - Detect duplicates                                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. METADATA EXTRACTION                                          │
│    scripts/buildMetadata.mts                                    │
│    - Parse SVG files                                            │
│    - Extract icon names, paths, attributes                      │
│    - Categorize icons                                           │
│    - Generate tags and aliases                                  │
│    - Calculate file sizes, path counts                          │
│    - Output: icons/metadata.json                                │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. TYPE GENERATION                                              │
│    scripts/generateTypes.mts                                    │
│    - Generate IconName string literal unions per style          │
│    - Create icon name arrays                                    │
│    - Generate IconProps interfaces                              │
│    - Output: packages/{framework}/src/types/*.ts                │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. COMPONENT GENERATION (Per Framework)                         │
│    tools/build-icons/cli.ts                                     │
│    - Read SVG files per style                                   │
│    - Parse SVG to component-specific syntax                     │
│    - Apply framework template (React JSX, Vue SFC, etc.)        │
│    - Generate barrel exports (index.ts)                         │
│    - Output: packages/{framework}/src/icons/{style}/*.tsx       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. PACKAGE BUNDLING                                             │
│    Rollup/Vite per package                                      │
│    - Bundle ES modules (.mjs)                                   │
│    - Bundle CommonJS (.cjs)                                     │
│    - Bundle UMD (.umd.js)                                       │
│    - Generate TypeScript declarations (.d.ts)                   │
│    - Tree-shaking optimization                                  │
│    - Output: packages/{framework}/dist/                         │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. TESTING                                                      │
│    Vitest + Testing Library                                     │
│    - Component render tests                                     │
│    - Prop validation tests                                      │
│    - Multi-color support tests                                  │
│    - Tree-shaking tests                                         │
│    - Accessibility tests                                        │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. PUBLISHING                                                   │
│    GitHub Actions + npm                                         │
│    - Version bumping (semantic versioning)                      │
│    - Changelog generation                                       │
│    - npm publish @ruman/{framework}                             │
│    - GitHub release creation                                    │
│    - CDN deployment (jsDelivr, unpkg)                           │
└─────────────────────────────────────────────────────────────────┘
```

### Runtime Data Flow (Developer Usage)

```
┌─────────────────────────────────────────────────────────────────┐
│ DEVELOPER CODE                                                  │
│ import { Home } from '@ruman/react/icons/stroke-rounded';       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ PACKAGE ENTRY POINT                                             │
│ packages/react/dist/icons/stroke-rounded/index.mjs              │
│ - Resolves named export "Home"                                  │
│ - Returns Home component reference                              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ ICON COMPONENT                                                  │
│ packages/react/dist/icons/stroke-rounded/Home.mjs               │
│ - React component wrapping SVG nodes                            │
│ - Accepts props: size, color, primaryColor, secondaryColor      │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ CORE ICON FACTORY                                               │
│ createLucideIcon('Home', svgNodes)                              │
│ - Applies props to SVG attributes                               │
│ - Handles multi-color via CSS variables                         │
│ - Returns React.FC<IconProps>                                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ SVG RENDERING                                                   │
│ <svg width={size} height={size} viewBox="0 0 24 24">           │
│   <path d="..." stroke={color} />                               │
│ </svg>                                                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ DOM OUTPUT                                                      │
│ Rendered SVG element in browser                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Transitions

### Icon Lifecycle

```
┌──────────────┐
│  1. DESIGN   │ Icon created in Figma (HugeIcons V4)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  2. EXPORT   │ SVG exported to icons/{style}/ directory
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 3. OPTIMIZE  │ SVGO processing (viewBox, currentColor, path simplification)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 4. VALIDATE  │ Schema validation, style parity check, file size check
└──────┬───────┘
       │       └─[FAIL]─> REJECTED (fix required)
       │
       ▼[PASS]
┌──────────────┐
│ 5. METADATA  │ Icon metadata extracted, categories/tags assigned
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 6. GENERATE  │ Component code generation for all frameworks
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  7. TESTING  │ Automated tests (render, props, tree-shaking, a11y)
└──────┬───────┘
       │       └─[FAIL]─> BLOCKED (test fixes required)
       │
       ▼[PASS]
┌──────────────┐
│ 8. PUBLISHED │ Available in npm package (@ruman/{framework})
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  9. USAGE    │ Developer imports and uses in application
└──────┬───────┘
       │
       ▼
┌──────────────┐
│10. DEPRECATED│ (Optional) Icon marked deprecated, warning shown
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 11. REMOVED  │ Icon removed from next MAJOR version
└──────────────┘
```

### Package Release Lifecycle

```
┌─────────────────┐
│  DEVELOPMENT    │ Local builds, testing, feature branches
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PRE-RELEASE    │ Alpha/Beta versions (0.1.0-alpha.1)
└────────┬────────┘ - Experimental features
         │         - API unstable
         │         - Testing phase
         ▼
┌─────────────────┐
│ RELEASE         │ Release Candidate (0.1.0-rc.1)
│ CANDIDATE       │ - Feature complete
└────────┬────────┘ - API stable
         │         - Final testing
         ▼
┌─────────────────┐
│    STABLE       │ Published to npm (0.1.0)
└────────┬────────┘ - Production-ready
         │         - Full support
         │         - Documentation complete
         ▼
┌─────────────────┐
│  MAINTENANCE    │ Patch releases (0.1.1, 0.1.2)
└────────┬────────┘ - Bug fixes
         │         - Security patches
         │         - Performance improvements
         ▼
┌─────────────────┐
│  DEPRECATED     │ End-of-life notice
└────────┬────────┘ - 6-month notice period
         │         - Security updates only
         │         - Migration guide provided
         ▼
┌─────────────────┐
│   ARCHIVED      │ No longer maintained
└─────────────────┘ - Community support only
                     - No official patches
```

---

## Metadata Schema

### icons/metadata.json Structure

```json
{
  "version": "1.0.0",
  "iconCount": 4354,
  "styleCount": 9,
  "totalFiles": 39186,
  "generatedAt": "2025-11-18T10:30:00.000Z",
  "icons": {
    "home": {
      "name": "home",
      "displayName": "Home",
      "categories": ["Navigation", "Buildings"],
      "tags": ["house", "main", "homepage", "dashboard"],
      "aliases": ["house", "residence"],
      "multiColor": false,
      "popularityScore": 95,
      "styles": {
        "stroke-rounded": {
          "fileSize": 412,
          "pathCount": 2,
          "hash": "a3f2e1b4c5d6e7f8"
        },
        "solid-rounded": {
          "fileSize": 389,
          "pathCount": 1,
          "hash": "b4f3e2c1d5e6f7a8"
        },
        "duotone-rounded": {
          "fileSize": 445,
          "pathCount": 3,
          "hash": "c5e6f7a8b9d0e1f2"
        },
        "twotone-rounded": {
          "fileSize": 420,
          "pathCount": 2,
          "hash": "d6f7a8b9c0e1f2a3"
        },
        "bulk-rounded": {
          "fileSize": 435,
          "pathCount": 2,
          "hash": "e7a8b9c0d1f2a3b4"
        },
        "solid-sharp": {
          "fileSize": 385,
          "pathCount": 1,
          "hash": "f8b9c0d1e2a3b4c5"
        },
        "solid-standard": {
          "fileSize": 390,
          "pathCount": 1,
          "hash": "a9c0d1e2f3b4c5d6"
        },
        "stroke-sharp": {
          "fileSize": 408,
          "pathCount": 2,
          "hash": "b0d1e2f3a4c5d6e7"
        },
        "stroke-standard": {
          "fileSize": 415,
          "pathCount": 2,
          "hash": "c1e2f3a4b5d6e7f8"
        }
      }
    },
    "user": {
      "name": "user",
      "displayName": "User",
      "categories": ["People", "Account"],
      "tags": ["person", "profile", "account", "avatar"],
      "aliases": ["person", "profile"],
      "multiColor": false,
      "popularityScore": 92,
      "styles": {
        "stroke-rounded": {
          "fileSize": 398,
          "pathCount": 2,
          "hash": "d2f3a4b5c6e7f8a9"
        }
        // ... (8 more styles)
      }
    }
    // ... (4,352 more icons)
  },
  "categories": {
    "Navigation": {
      "name": "Navigation",
      "description": "Icons for navigation, wayfinding, and directional indicators",
      "iconCount": 245,
      "icons": ["home", "menu", "arrow-left", "arrow-right", "chevron-up", "chevron-down"]
    },
    "Buildings": {
      "name": "Buildings",
      "description": "Icons representing buildings, structures, and architecture",
      "iconCount": 78,
      "icons": ["home", "office", "store", "hospital", "school"]
    }
    // ... (more categories)
  },
  "tags": {
    "house": ["home", "building", "residence", "real-estate"],
    "dashboard": ["home", "analytics", "stats", "overview"],
    "person": ["user", "profile", "avatar", "account"],
    "profile": ["user", "account", "settings"]
    // ... (more tags)
  }
}
```

### categories.json Structure

```json
{
  "categories": [
    {
      "id": "navigation",
      "name": "Navigation",
      "description": "Icons for navigation, wayfinding, and directional indicators",
      "iconCount": 245,
      "parentCategory": null,
      "iconNames": ["home", "menu", "arrow-left", "arrow-right", "chevron-up"]
    },
    {
      "id": "arrows",
      "name": "Arrows",
      "description": "Directional arrow icons",
      "iconCount": 82,
      "parentCategory": "navigation",
      "iconNames": ["arrow-left", "arrow-right", "arrow-up", "arrow-down"]
    }
  ]
}
```

### styles.json Structure

```json
{
  "styles": [
    {
      "name": "stroke-rounded",
      "displayName": "Stroke Rounded",
      "description": "Outlined icons with rounded line caps and corners",
      "multiColor": false,
      "defaultStrokeWidth": 2,
      "iconCount": 4354,
      "directoryPath": "icons/stroke-rounded"
    },
    {
      "name": "duotone-rounded",
      "displayName": "Duotone Rounded",
      "description": "Two-tone icons with primary and secondary colors",
      "multiColor": true,
      "defaultStrokeWidth": null,
      "iconCount": 4354,
      "directoryPath": "icons/duotone-rounded"
    }
    // ... (7 more styles)
  ]
}
```

---

## Type Definitions

### Core TypeScript Types

```typescript
// ============================================================================
// Icon Name Types (Auto-generated per style)
// ============================================================================

// Generated: packages/icons/src/types/stroke-rounded.ts
export type IconName =
  | 'home'
  | 'user'
  | 'settings'
  | 'search'
  | 'heart'
  // ... (4,350+ more icon names)
  ;

export const iconNames: readonly IconName[] = [
  'home',
  'user',
  'settings',
  // ...
] as const;

// ============================================================================
// Style Types
// ============================================================================

export type StyleName =
  | 'bulk-rounded'
  | 'duotone-rounded'
  | 'solid-rounded'
  | 'solid-sharp'
  | 'solid-standard'
  | 'stroke-rounded'
  | 'stroke-sharp'
  | 'stroke-standard'
  | 'twotone-rounded';

export const styleNames: readonly StyleName[] = [
  'bulk-rounded',
  'duotone-rounded',
  'solid-rounded',
  'solid-sharp',
  'solid-standard',
  'stroke-rounded',
  'stroke-sharp',
  'stroke-standard',
  'twotone-rounded',
] as const;

// ============================================================================
// Icon Props (Framework-specific but share common base)
// ============================================================================

// Base props (all frameworks)
export interface IconPropsBase {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: Record<string, string | number>;
  // Multi-color props
  primaryColor?: string;
  secondaryColor?: string;
}

// React-specific
export interface IconProps extends IconPropsBase, Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'color'> {
  absoluteStrokeWidth?: boolean;
}

// Vue-specific
export interface IconProps extends IconPropsBase {
  // Vue uses kebab-case in templates but camelCase in defineProps
}

// Angular-specific
export interface IconProps extends IconPropsBase {
  // Angular uses bracket syntax [size]="24"
}

// ============================================================================
// Icon Node Structure
// ============================================================================

export type IconNode = [
  elementName: string,
  attrs: Record<string, string | number>
] | [
  elementName: string,
  attrs: Record<string, string | number>,
  children: IconNode[]
];

// Example:
// [
//   'path',
//   { d: 'M3 12l9-9 9 9', stroke: 'currentColor', strokeWidth: 2 }
// ]

// ============================================================================
// Icon Metadata Types
// ============================================================================

export interface IconMetadata {
  name: string;
  displayName: string;
  categories: string[];
  tags: string[];
  aliases: string[];
  multiColor: boolean;
  popularityScore: number;
  styles: Record<StyleName, {
    fileSize: number;
    pathCount: number;
    hash: string;
  }>;
}

export interface CategoryMetadata {
  id: string;
  name: string;
  description?: string;
  iconCount: number;
  parentCategory: string | null;
  iconNames: string[];
}

export interface MetadataFile {
  version: string;
  iconCount: number;
  styleCount: number;
  totalFiles: number;
  generatedAt: string;
  icons: Record<string, IconMetadata>;
  categories: Record<string, CategoryMetadata>;
  tags: Record<string, string[]>;
}

// ============================================================================
// Component Factory Types
// ============================================================================

export type IconComponent<P = IconProps> = React.FC<P>; // React
export type IconComponent<P = IconProps> = DefineComponent<P>; // Vue
export type IconComponent<P = IconProps> = Component<P>; // Svelte

// ============================================================================
// Build Configuration Types
// ============================================================================

export interface BuildConfig {
  bundler: 'rollup' | 'vite';
  formats: ('es' | 'cjs' | 'umd')[];
  target: string; // 'es2020', 'es2022', etc.
  minify: boolean;
  sourcemap: boolean;
  external: string[]; // External dependencies
}

export interface PackageExports {
  '.': {
    import: string;
    require: string;
    types: string;
  };
  './icons/*': {
    import: string;
    require: string;
    types: string;
  };
}
```

### Generated Component Example Types

```typescript
// packages/react/src/icons/stroke-rounded/index.ts (auto-generated)
export { default as Home } from './Home';
export { default as User } from './User';
export { default as Settings } from './Settings';
// ... (4,351+ more exports)

// Type-safe icon map
export interface StrokeRoundedIcons {
  Home: React.FC<IconProps>;
  User: React.FC<IconProps>;
  Settings: React.FC<IconProps>;
  // ... (4,351+ more)
}

// Usage with autocomplete:
import type { IconName } from '@ruman/icons/types/stroke-rounded';
import type { IconProps } from '@ruman/react';

const iconName: IconName = 'home'; // ✓ Type-safe
const invalidName: IconName = 'not-an-icon'; // ✗ TypeScript error
```

---

## Database/Storage Strategy

### Source Control (Git)

**Committed to repository**:
- ✅ **Source SVG files**: `icons/{style}/{name}.svg` (39,186 files)
- ✅ **Metadata configs**: `categories.json`, `styles.json`, `tags.json`
- ✅ **Package source code**: `packages/{framework}/src/` (templates, helpers)
- ✅ **Build scripts**: `scripts/*.mts`, `tools/build-icons/`
- ✅ **Configuration files**: `package.json`, `tsconfig.json`, `turbo.json`, etc.
- ✅ **Documentation**: `README.md`, `CONTRIBUTING.md`, `docs/`
- ✅ **Tests**: All test files (`.test.ts`, `.spec.ts`)

**Ignored in .gitignore (generated at build time)**:
- ❌ **Generated icon components**: `packages/*/src/icons/**/*.tsx`
- ❌ **Generated types**: `packages/*/types/**/*.d.ts`
- ❌ **Build artifacts**: `packages/*/dist/`
- ❌ **Icon metadata**: `icons/metadata.json`
- ❌ **Node modules**: `node_modules/`, `.pnpm-store/`
- ❌ **Build cache**: `.turbo/`, `.vite/`, `*.tsbuildinfo`

**Rationale**: Generated files are reproducible from source SVGs and build scripts. Committing them would cause:
- 39,000+ file changes per icon update
- Massive git history bloat
- Merge conflict nightmares
- Slower clone times

### Build Artifacts (npm Registry)

**Published to npm** (`@ruman/{framework}`):
- ✅ **Compiled bundles**: `dist/index.mjs`, `dist/index.cjs`, `dist/index.umd.js`
- ✅ **Type definitions**: `dist/index.d.ts`, `dist/icons/{style}/*.d.ts`
- ✅ **Icon components**: Pre-generated and bundled (not individual files)
- ✅ **Package metadata**: `package.json`, `README.md`, `LICENSE`, `CHANGELOG.md`
- ❌ **Source code**: Not published (reduces package size)
- ❌ **Tests**: Not published
- ❌ **Build scripts**: Not published

**Rationale**: npm packages contain only production-ready artifacts. Developers don't need source SVGs or build tools to use the library.

### CDN Distribution (jsDelivr, unpkg)

**Hosted on CDN**:
- ✅ **UMD bundles**: `@ruman/react@0.1.0/dist/index.umd.js`
- ✅ **ES modules**: `@ruman/react@0.1.0/dist/index.mjs`
- ✅ **Minified versions**: `@ruman/react@0.1.0/dist/index.min.js`
- ✅ **Individual icon files**: For on-demand loading

**CDN URL Structure**:
```
https://cdn.jsdelivr.net/npm/@ruman/react@0.1.0/dist/index.umd.js
https://unpkg.com/@ruman/react@0.1.0/dist/index.mjs
```

### Local Development Storage

**Developer workspace** (`/Users/saleh/Desktop/dgaIcons/`):
- Source SVGs (`icons/`)
- Package source code (`packages/`)
- Build tools (`scripts/`, `tools/`)
- Tests (`*.test.ts`)
- Generated files (gitignored but present locally)

**Build cache** (`.turbo/`, `.vite/`):
- Incremental build cache for fast rebuilds
- Gitignored, not committed

---

## Performance Considerations

### Icon Loading Optimization

**Tree-Shaking** (only load imported icons):
```typescript
// Only Home component is bundled (not all 4,354 icons)
import { Home } from '@ruman/react/icons/stroke-rounded';
```

**Dynamic Imports** (load icons on-demand):
```typescript
// Lazy load icon when needed
const Home = lazy(() => import('@ruman/react/icons/stroke-rounded/Home'));
```

**Bundle Splitting** (separate chunks per style):
```typescript
// Each style in separate chunk for code-splitting
import('@ruman/react/icons/stroke-rounded').then(icons => {
  const { Home } = icons;
});
```

**Aggressive Minification**:
- Terser for JavaScript
- SVGO for SVGs (30-40% size reduction)
- Brotli compression for CDN assets

### Metadata Performance

**Build-Time Indexing**:
- Icon metadata generated once at build time
- Search index pre-computed (Fuse.js, Algolia)
- No runtime parsing of SVG files

**Lazy Loading Metadata**:
```typescript
// Only load full metadata when search is triggered
const metadata = await import('@ruman/icons/metadata.json');
```

**In-Memory Caching**:
```typescript
let metadataCache: MetadataFile | null = null;

export async function getMetadata(): Promise<MetadataFile> {
  if (!metadataCache) {
    metadataCache = await import('@ruman/icons/metadata.json');
  }
  return metadataCache;
}
```

### Type Generation Performance

**Incremental Generation**:
- Only regenerate types for changed styles
- Cache type files per style
- Parallel type generation across styles

**Lazy Type Loading** (TypeScript):
```typescript
// TypeScript only loads types for imported modules
import type { Home } from '@ruman/react/icons/stroke-rounded';
// Other 4,353 icon types are not loaded
```

**Compile-Time Only Cost**:
- Types have zero runtime cost
- All type checking happens at build time
- No type information in production bundles

---

## Relationships & Dependencies

### Entity Relationship Diagram (Text)

```
Icon (1) ──────< (9) IconStyle
  │
  ├──< (0..N) Category
  │
  ├──< (0..N) Tag
  │
  └──< (M) IconComponent (across frameworks)
         │
         └──> (1) Package


Package (1) ──────< (N) IconComponent
  │
  └──> (1) Framework


Category (1) ──────< (N) Icon
  │
  └──> (0..1) Category (parent)


Style (1) ──────< (4354) IconStyle
```

### Dependency Graph

```
┌─────────────────┐
│  Source SVGs    │ (icons/{style}/{name}.svg)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   IconStyle     │ (one per SVG file, 39,186 total)
└────────┬────────┘
         │
         ├──> Icon (groups 9 IconStyles with same name)
         │
         ├──> IconMetadata (extracted at build time)
         │
         └──> IconComponent (generated per framework)
                │
                └──> Package (bundles components)
```

### Build Dependency Chain

```
SVG Files
  ↓ (depends on)
SVGO Optimization
  ↓ (depends on)
Validation Scripts
  ↓ (depends on)
Metadata Generation
  ↓ (depends on)
Type Generation
  ↓ (depends on)
Component Generation (per framework)
  ↓ (depends on)
Package Bundling
  ↓ (depends on)
Testing
  ↓ (depends on)
Publishing
```

---

## Validation Rules Summary

### Icon Validation
- ✓ Name must be unique across all icons
- ✓ Name must be kebab-case
- ✓ Must exist in all 9 style directories
- ✓ File size < 5KB
- ✓ Valid SVG structure
- ✓ ViewBox must be "0 0 24 24"

### SVG Validation
- ✓ No `<script>` elements
- ✓ No external resources
- ✓ No embedded raster images
- ✓ Uses `currentColor` or CSS variables
- ✓ Paths are closed and valid
- ✓ Decimal precision ≤ 2 places

### Package Validation
- ✓ `package.json` has required fields
- ✓ Exports map is valid
- ✓ `sideEffects: false` for tree-shaking
- ✓ TypeScript definitions exist
- ✓ README and LICENSE present

### Build Validation
- ✓ All tests pass (>80% coverage)
- ✓ Bundle size within limits
- ✓ TypeScript compiles with no errors
- ✓ Linting passes
- ✓ Tree-shaking works correctly

---

## Glossary

- **Icon**: A single design (e.g., "home") available in 9 styles
- **IconStyle**: One visual variant of an icon (e.g., "home" in "stroke-rounded")
- **Style**: One of 9 visual styles (stroke, solid, duotone, etc.)
- **Package**: Framework-specific distribution (e.g., @ruman/react)
- **Component**: Framework-specific wrapper around icon SVG
- **Metadata**: Searchable information about icons (categories, tags)
- **Tree-Shaking**: Build optimization removing unused code
- **Monorepo**: Single repository containing multiple packages
- **SVG Node**: Parsed SVG element represented as array tuple
- **Multi-Color**: Icons supporting independent color customization

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-18
**Status**: Approved for Implementation

**Related Documents**:
- Feature Spec: `specs/001-icon-library/spec.md`
- Research: `specs/001-icon-library/research.md`
- Constitution: `.specify/memory/constitution.md`
- Implementation Plan: `specs/001-icon-library/plan.md` (next step)

**Next Phase**: Proceed to implementation planning (plan.md) using this data model as foundation.
