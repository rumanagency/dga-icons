# DGA Icons - Quickstart Guide

**Version**: 1.0.0
**Last Updated**: 2025-11-18
**Get started in 5 minutes**

---

## What is DGA Icons?

DGA Icons is a comprehensive, open-source icon library featuring **39,186 professionally designed icons** across **9 distinct visual styles**. Built for modern web development, it provides framework-specific packages for React, Vue, Svelte, Angular, and more—all generated from a single, optimized source.

**Key Features**:
- 4,354+ unique icons per style
- 9 visual styles (stroke, solid, duotone, twotone, bulk)
- Multi-color customization support
- Full TypeScript support with autocomplete
- Tree-shakeable for minimal bundle sizes
- MIT licensed

**Designed by**: [HugeIcons V4](https://hugeicons.com)
**Distributed by**: [Saudi Digital Government Authority (DGA)](https://dga.gov.sa)
**Developed by**: [Ruman Agency](https://ruman.sa)

---

## Installation

### 1. React

```bash
# npm
npm install @ruman/react

# yarn
yarn add @ruman/react

# pnpm
pnpm add @ruman/react
```

**Peer Dependencies**: React 16.8+ (Hooks required)

**TypeScript Setup**: Types are included automatically. No additional `@types` packages needed.

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "jsx": "react-jsx"
  }
}
```

---

### 2. Vue 3

```bash
# npm
npm install @ruman/vue

# yarn
yarn add @ruman/vue

# pnpm
pnpm add @ruman/vue
```

**Peer Dependencies**: Vue 3.0+

**Plugin Configuration**: No plugin installation required—icons work out of the box.

**TypeScript Setup**:
```typescript
// vite-env.d.ts or env.d.ts
/// <reference types="@ruman/vue" />
```

---

### 3. Svelte

```bash
# npm
npm install @ruman/svelte

# yarn
yarn add @ruman/svelte

# pnpm
pnpm add @ruman/svelte
```

**Peer Dependencies**: Svelte 3.0+ or 4.0+

**SvelteKit Compatibility**: Fully compatible with SvelteKit. No additional configuration needed.

---

### 4. Angular

```bash
# npm
npm install @ruman/angular

# yarn
yarn add @ruman/angular

# pnpm
pnpm add @ruman/angular
```

**Peer Dependencies**: Angular 12+ (both `@angular/core` and `@angular/common`)

**Module Import**:
```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { RumanIconsModule } from '@ruman/angular';

@NgModule({
  imports: [
    RumanIconsModule
  ]
})
export class AppModule { }
```

---

### 5. Other Frameworks

**Solid.js**:
```bash
npm install @ruman/solid
```

**Preact**:
```bash
npm install @ruman/preact
```

**Astro**:
```bash
npm install @ruman/astro
```

**Nuxt.js**:
```bash
npm install @ruman/nuxt
```

**Laravel (Blade)**:
```bash
composer require ruman/laravel
```

**Static Files** (no framework):
```bash
npm install @ruman/static
```

**CDN** (no installation):
```html
<!-- UMD Bundle -->
<script src="https://unpkg.com/@ruman/react@0.1.0/dist/umd/ruman-react.min.js"></script>

<!-- ES Module -->
<script type="module">
  import { Home } from 'https://cdn.jsdelivr.net/npm/@ruman/react@0.1.0/+esm';
</script>
```

---

## Basic Usage

### React Example

**Simple Icon Render**:
```tsx
import { Home } from '@ruman/react/icons/stroke-rounded';

function App() {
  return (
    <div>
      <Home />
    </div>
  );
}
```

**With Size and Color Props**:
```tsx
import { Home, Settings, User } from '@ruman/react/icons/stroke-rounded';

function Navigation() {
  return (
    <nav>
      <Home size={24} color="#3B82F6" />
      <Settings size={24} color="#10B981" />
      <User size={24} color="#EF4444" />
    </nav>
  );
}
```

**Multi-Color Duotone Icon**:
```tsx
import { Home } from '@ruman/react/icons/duotone-rounded';

function Header() {
  return (
    <Home
      size={32}
      primaryColor="#3B82F6"      // Main icon color
      secondaryColor="#93C5FD"    // Background/accent color
    />
  );
}
```

**With Custom Stroke Width**:
```tsx
import { Search } from '@ruman/react/icons/stroke-rounded';

function SearchBar() {
  return (
    <Search
      size={20}
      color="#6B7280"
      strokeWidth={1.5}           // Thinner stroke
    />
  );
}
```

**All Props Example**:
```tsx
import { Heart } from '@ruman/react/icons/stroke-rounded';

function LikeButton() {
  return (
    <Heart
      size={28}
      color="#EF4444"
      strokeWidth={2}
      className="like-icon"
      style={{ marginRight: '8px' }}
      onClick={() => console.log('Liked!')}
      aria-label="Like this post"
    />
  );
}
```

---

### Vue Example

**Composition API Usage**:
```vue
<script setup lang="ts">
import { Home, Settings, User } from '@ruman/vue/icons/stroke-rounded';
import { ref } from 'vue';

const iconSize = ref(24);
</script>

<template>
  <div>
    <!-- Basic usage -->
    <Home />

    <!-- With props -->
    <Settings :size="24" color="#3B82F6" />

    <!-- Reactive props -->
    <User :size="iconSize" color="#10B981" />
  </div>
</template>
```

**Reactive Props**:
```vue
<script setup lang="ts">
import { Heart } from '@ruman/vue/icons/stroke-rounded';
import { ref, computed } from 'vue';

const isLiked = ref(false);
const heartColor = computed(() => isLiked.value ? '#EF4444' : '#6B7280');
</script>

<template>
  <button @click="isLiked = !isLiked">
    <Heart
      :size="24"
      :color="heartColor"
      :class="{ 'liked': isLiked }"
    />
  </button>
</template>
```

**Multi-Color Icon** (kebab-case props in template):
```vue
<script setup lang="ts">
import { Home } from '@ruman/vue/icons/duotone-rounded';
</script>

<template>
  <Home
    :size="32"
    primary-color="#3B82F6"
    secondary-color="#93C5FD"
  />
</template>
```

---

### Svelte Example

**Basic Usage**:
```svelte
<script>
  import { Home, Settings, User } from '@ruman/svelte/icons/stroke-rounded';
</script>

<div>
  <!-- Simple icon -->
  <Home />

  <!-- With props -->
  <Settings size={24} color="#3B82F6" />
  <User size={24} color="#10B981" />
</div>
```

**Reactive Statements**:
```svelte
<script>
  import { Heart } from '@ruman/svelte/icons/stroke-rounded';

  let isLiked = false;
  $: heartColor = isLiked ? '#EF4444' : '#6B7280';
</script>

<button on:click={() => isLiked = !isLiked}>
  <Heart size={24} color={heartColor} />
</button>
```

**Multi-Color Icon**:
```svelte
<script>
  import { Home } from '@ruman/svelte/icons/duotone-rounded';
</script>

<Home
  size={32}
  primaryColor="#3B82F6"
  secondaryColor="#93C5FD"
/>
```

---

### Angular Example

**Template Syntax**:
```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- Basic usage -->
    <ruman-icon name="home" style="stroke-rounded"></ruman-icon>

    <!-- With size and color -->
    <ruman-icon
      name="settings"
      style="stroke-rounded"
      [size]="24"
      color="#3B82F6"
    ></ruman-icon>

    <!-- Reactive props -->
    <ruman-icon
      name="user"
      style="stroke-rounded"
      [size]="iconSize"
      [color]="iconColor"
    ></ruman-icon>
  `,
})
export class AppComponent {
  iconSize = 24;
  iconColor = '#10B981';
}
```

**Property Binding**:
```typescript
@Component({
  template: `
    <button (click)="toggleLike()">
      <ruman-icon
        name="heart"
        style="stroke-rounded"
        [size]="24"
        [color]="heartColor"
      ></ruman-icon>
    </button>
  `
})
export class LikeButtonComponent {
  isLiked = false;

  get heartColor() {
    return this.isLiked ? '#EF4444' : '#6B7280';
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
  }
}
```

**Multi-Color Icon**:
```typescript
@Component({
  template: `
    <ruman-icon
      name="home"
      style="duotone-rounded"
      [size]="32"
      primaryColor="#3B82F6"
      secondaryColor="#93C5FD"
    ></ruman-icon>
  `
})
export class HeaderComponent { }
```

---

## Icon Styles

DGA Icons offers **9 distinct visual styles** to match your design system:

### 1. **stroke-rounded** — Outline with Rounded Corners
**Best for**: Modern, friendly UIs
**Characteristics**: 2px stroke, rounded line caps, smooth curves
**Example**: Navigation menus, buttons, cards

```tsx
import { Home, Settings, User } from '@ruman/react/icons/stroke-rounded';
```

---

### 2. **solid-rounded** — Filled with Rounded Corners
**Best for**: Emphasis, active states
**Characteristics**: Solid fill, rounded edges, bold presence
**Example**: Active navigation items, primary actions

```tsx
import { Home, Settings, User } from '@ruman/react/icons/solid-rounded';
```

---

### 3. **duotone-rounded** — Two-Color with Rounded Corners
**Best for**: Depth, hierarchy
**Characteristics**: Primary + secondary colors, opacity layers
**Example**: Feature illustrations, dashboard cards

```tsx
import { Home, Settings, User } from '@ruman/react/icons/duotone-rounded';

<Home
  primaryColor="#3B82F6"      // Main color
  secondaryColor="#93C5FD"    // Background/accent
/>
```

---

### 4. **twotone-rounded** — Two-Tone Variant with Rounded Corners
**Best for**: Visual distinction, layered designs
**Characteristics**: Two-color system, balanced contrast
**Example**: Icon grids, feature lists

```tsx
import { Home } from '@ruman/react/icons/twotone-rounded';

<Home primaryColor="#10B981" secondaryColor="#6EE7B7" />
```

---

### 5. **bulk-rounded** — Bulk Fill with Accents
**Best for**: Rich, detailed interfaces
**Characteristics**: Solid base with accent overlays
**Example**: Product catalogs, media galleries

```tsx
import { Home } from '@ruman/react/icons/bulk-rounded';

<Home primaryColor="#EF4444" secondaryColor="#FCA5A5" />
```

---

### 6. **stroke-sharp** — Outline with Sharp Corners
**Best for**: Technical, precise UIs
**Characteristics**: Sharp angles, clean lines, 2px stroke
**Example**: Developer tools, admin panels

```tsx
import { Home } from '@ruman/react/icons/stroke-sharp';
```

---

### 7. **solid-sharp** — Filled with Sharp Corners
**Best for**: Bold, geometric designs
**Characteristics**: Solid fill, angular edges
**Example**: Call-to-action buttons, alerts

```tsx
import { Home } from '@ruman/react/icons/solid-sharp';
```

---

### 8. **stroke-standard** — Outline Standard
**Best for**: Balanced, versatile UIs
**Characteristics**: Standard corners, 2px stroke
**Example**: General-purpose interfaces

```tsx
import { Home } from '@ruman/react/icons/stroke-standard';
```

---

### 9. **solid-standard** — Filled Standard
**Best for**: Classic, timeless designs
**Characteristics**: Solid fill, standard edges
**Example**: Traditional dashboards

```tsx
import { Home } from '@ruman/react/icons/solid-standard';
```

---

## Common Props

All icon components support these props across frameworks:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Icon dimensions in pixels (`24`) or CSS units (`"2rem"`) |
| `color` | `string` | `'currentColor'` | Icon color (CSS color value). For single-color icons. |
| `strokeWidth` | `number` | `2` | Stroke width for stroke-style icons. Ignored for solid styles. |
| `absoluteStrokeWidth` | `boolean` | `false` | If `true`, stroke width scales with size. If `false`, remains constant. |
| `primaryColor` | `string` | `'currentColor'` | Primary/foreground color (multi-color icons only) |
| `secondaryColor` | `string` | `'currentColor'` | Secondary/background color (multi-color icons only) |
| `className` / `class` | `string` | — | CSS class name(s) |
| `style` | `object \| string` | — | Inline styles |

**Framework-Specific Props**:
- **React**: All standard SVG props (`onClick`, `aria-label`, etc.) + `ref` support
- **Vue**: Kebab-case in templates (`primary-color`, `secondary-color`)
- **Svelte**: Standard HTML attributes + event handlers (`on:click`)
- **Angular**: Property binding (`[size]`, `[color]`), event binding (`(click)`)

---

## Multi-Color Icons

**Duotone**, **Twotone**, and **Bulk** styles support independent color customization:

### React Example

```tsx
import { Home } from '@ruman/react/icons/duotone-rounded';

// Both colors customized
<Home
  size={32}
  primaryColor="#3B82F6"      // Main icon shape
  secondaryColor="#93C5FD"    // Background/accent
/>

// Only primary color (secondary uses currentColor)
<Home primaryColor="#3B82F6" />

// Single color for both (loses multi-color effect)
<Home color="#3B82F6" />
```

### Vue Example

```vue
<script setup lang="ts">
import { Home } from '@ruman/vue/icons/duotone-rounded';
</script>

<template>
  <Home
    :size="32"
    primary-color="#3B82F6"
    secondary-color="#93C5FD"
  />
</template>
```

### How It Works

Multi-color icons use **CSS custom properties** under the hood:

```svg
<!-- Transformed SVG (simplified) -->
<svg style="--ruman-icon-primary: #3B82F6; --ruman-icon-secondary: #93C5FD">
  <path fill="var(--ruman-icon-secondary)" opacity="0.4" d="..." />
  <path fill="var(--ruman-icon-primary)" d="..." />
</svg>
```

**Fallback**: If CSS custom properties aren't supported (IE11), icons fall back to `currentColor`.

---

## Tree-Shaking & Bundle Size

DGA Icons is **fully tree-shakeable**—only imported icons are included in your bundle.

### How It Works

```tsx
// ✅ GOOD: Only Home icon bundled (~0.5KB gzipped)
import { Home } from '@ruman/react/icons/stroke-rounded';

// ❌ AVOID: Entire barrel export (~45KB gzipped)
import * as Icons from '@ruman/react/icons/stroke-rounded';
```

### Bundle Size Estimates

| Import Count | Estimated Size (gzipped) |
|--------------|--------------------------|
| 1 icon       | ~0.5KB                   |
| 10 icons     | ~5KB                     |
| 100 icons    | ~50KB                    |

### Optimization Tips

**1. Import Only What You Need**:
```tsx
// ✅ Specific imports
import { Home, Settings } from '@ruman/react/icons/stroke-rounded';

// ❌ Avoid wildcard imports
import * as AllIcons from '@ruman/react';
```

**2. Dynamic Imports for Rarely-Used Icons**:
```tsx
// React lazy loading
import { lazy, Suspense } from 'react';

const RareIcon = lazy(() =>
  import('@ruman/react/icons/stroke-rounded/RareIcon')
);

<Suspense fallback={<div>Loading...</div>}>
  <RareIcon size={24} />
</Suspense>
```

**3. Use Style-Specific Imports**:
```tsx
// ✅ Style-specific (better tree-shaking)
import { Home } from '@ruman/react/icons/stroke-rounded';

// ❌ Generic import (worse tree-shaking)
import { Icon } from '@ruman/react';
<Icon name="home" style="stroke-rounded" />
```

---

## TypeScript Support

Full TypeScript support with **zero configuration** needed.

### Autocomplete & Type Safety

```tsx
import { Home, Settings } from '@ruman/react/icons/stroke-rounded';
import type { ReactIconProps } from '@ruman/react';

// ✅ Type-safe props
const MyIcon: React.FC<ReactIconProps> = (props) => {
  return <Home {...props} />;
};

// ✅ Autocomplete for icon names
import type { IconName } from '@ruman/react/icons/stroke-rounded';
const iconName: IconName = 'home'; // Autocomplete suggests all 4,354+ icons

// ❌ TypeScript error
const invalid: IconName = 'not-an-icon'; // Error: Type '"not-an-icon"' is not assignable
```

### Component Type Definitions

```tsx
import type { ReactIconComponent } from '@ruman/react';
import type { VueIconComponent } from '@ruman/vue';
import type { SvelteIconComponent } from '@ruman/svelte';

// React
const HomeIcon: ReactIconComponent = Home;

// Vue
const HomeIcon: VueIconComponent = Home;
```

### Strict Prop Types

```tsx
// ✅ Valid props
<Home size={24} color="#3B82F6" />
<Home size="2rem" />

// ❌ TypeScript errors
<Home size="invalid" />       // Error: Type 'string' is not assignable
<Home invalidProp="value" />  // Error: Property 'invalidProp' does not exist
```

---

## Finding Icons

### Icon Browser

Visit the **DGA Icons Documentation** (coming soon) to:
- Browse all 39,186 icons visually
- Search by name or category
- Filter by style
- Copy-paste code snippets

### Icon Categories

Icons are organized into semantic categories:

- **Navigation**: Home, Menu, Arrows, Chevrons
- **Communication**: Mail, Phone, Chat, Message
- **Media**: Play, Pause, Music, Video
- **Files**: Document, Folder, Upload, Download
- **People**: User, Profile, Team, Group
- **UI Elements**: Settings, Search, Filter, Close
- **Business**: Chart, Graph, Calendar, Money
- **Commerce**: Cart, Shop, Product, Payment
- **Social**: Share, Like, Comment, Follow
- **Actions**: Edit, Delete, Add, Save

### Search by Name

```tsx
// Exact name match
import { Home } from '@ruman/react/icons/stroke-rounded';

// Common variations (aliases)
import { House } from '@ruman/react/icons/stroke-rounded'; // Alias for "home"
```

### Tags and Aliases

Icons support multiple search terms:

- **"home"**: `home`, `house`, `residence`, `dashboard`
- **"user"**: `user`, `person`, `profile`, `account`, `avatar`
- **"settings"**: `settings`, `gear`, `preferences`, `config`

---

## Next Steps

### Full Documentation

- **API Reference**: Complete prop documentation for all frameworks
- **Framework Guides**: In-depth guides for React, Vue, Svelte, Angular, etc.
- **Migration Guides**: Migrating from other icon libraries
- **Advanced Usage**: Custom icon creation, server-side rendering, dynamic imports

### Contributing

DGA Icons is **open-source** and welcomes contributions:

- **Report Issues**: [GitHub Issues](https://github.com/rumanagency/dga-icons/issues)
- **Request Icons**: Submit icon requests via GitHub
- **Contribute Code**: See [CONTRIBUTING.md](https://github.com/rumanagency/dga-icons/blob/main/CONTRIBUTING.md)

### Stay Updated

- **GitHub**: [github.com/rumanagency/dga-icons](https://github.com/rumanagency/dga-icons)
- **npm**: [@ruman organization](https://www.npmjs.com/org/ruman)
- **Twitter**: Follow [@RumanAgency](https://twitter.com/RumanAgency) for updates

---

## Troubleshooting

### Icons Not Displaying

**Problem**: Icons don't render or show as blank spaces.

**Solutions**:
1. Check import path is correct:
   ```tsx
   // ✅ Correct
   import { Home } from '@ruman/react/icons/stroke-rounded';

   // ❌ Wrong
   import { Home } from '@ruman/react';
   ```

2. Verify package is installed:
   ```bash
   npm list @ruman/react
   ```

3. Clear build cache:
   ```bash
   # Vite
   rm -rf node_modules/.vite

   # Next.js
   rm -rf .next

   # General
   rm -rf node_modules && npm install
   ```

---

### TypeScript Errors

**Problem**: TypeScript can't find icon types or shows errors.

**Solutions**:
1. Ensure TypeScript 4.5+ is installed:
   ```bash
   npm install -D typescript@latest
   ```

2. Update `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "esModuleInterop": true
     }
   }
   ```

3. Restart TypeScript server:
   - **VS Code**: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

---

### Bundle Size Issues

**Problem**: Bundle size is larger than expected.

**Solutions**:
1. Check for wildcard imports:
   ```tsx
   // ❌ Imports all icons
   import * as Icons from '@ruman/react/icons/stroke-rounded';

   // ✅ Import specific icons
   import { Home, Settings } from '@ruman/react/icons/stroke-rounded';
   ```

2. Enable tree-shaking in bundler:
   ```javascript
   // webpack.config.js
   module.exports = {
     optimization: {
       usedExports: true,
       sideEffects: false
     }
   };
   ```

3. Analyze bundle:
   ```bash
   # Webpack
   npx webpack-bundle-analyzer

   # Rollup
   npm install -D rollup-plugin-visualizer
   ```

---

### Multi-Color Not Working

**Problem**: `primaryColor` and `secondaryColor` don't apply.

**Solutions**:
1. Ensure you're using a multi-color style:
   ```tsx
   // ✅ Multi-color style
   import { Home } from '@ruman/react/icons/duotone-rounded';

   // ❌ Single-color style (ignores secondaryColor)
   import { Home } from '@ruman/react/icons/stroke-rounded';
   ```

2. Check CSS custom properties are supported:
   ```javascript
   if (!window.CSS || !window.CSS.supports('color', 'var(--test)')) {
     console.warn('CSS custom properties not supported. Multi-color icons will use currentColor.');
   }
   ```

3. Verify browser compatibility (IE11 not supported for multi-color).

---

### CDN/UMD Issues

**Problem**: Icons don't load from CDN.

**Solutions**:
1. Check CDN URL is correct:
   ```html
   <!-- ✅ Correct -->
   <script src="https://unpkg.com/@ruman/react@0.1.0/dist/umd/ruman-react.min.js"></script>

   <!-- ❌ Wrong -->
   <script src="https://unpkg.com/@ruman/react/index.js"></script>
   ```

2. Ensure React is loaded first:
   ```html
   <!-- Load React before DGA Icons -->
   <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
   <script src="https://unpkg.com/@ruman/react@0.1.0/dist/umd/ruman-react.min.js"></script>
   ```

3. Check global variable name:
   ```html
   <script>
     console.log(RumanReact); // Should log object with icons
   </script>
   ```

---

## Credits

### Attribution

**Icon Design**: [HugeIcons V4](https://hugeicons.com) — Original icon designs
**Distributed by**: [Saudi Digital Government Authority (DGA)](https://dga.gov.sa) — Making icons freely available
**Library Development**: [Ruman Agency](https://ruman.sa) (وكالة رمان) — Framework integration and build system

### License

**MIT License** — Free for commercial and personal use.

See full license: [LICENSE](https://github.com/rumanagency/dga-icons/blob/main/LICENSE)

### Support

- **Issues**: [GitHub Issues](https://github.com/rumanagency/dga-icons/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rumanagency/dga-icons/discussions)
- **Email**: hello@ruman.sa

---

**Happy coding!** 🎨✨

*Made with love by the Ruman Agency team*
