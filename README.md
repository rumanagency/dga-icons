# DGA Icons

> Multi-platform icon library with 39,000+ icons across 9 visual styles

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@ruman/react.svg)](https://www.npmjs.com/package/@ruman/react)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

## Overview

DGA Icons is a comprehensive, production-ready icon library providing **39,186 SVG icons** across **9 distinct visual styles** for all major web and mobile frameworks.

### Features

- ✅ **39,000+ Icons** - Complete icon coverage for any project
- ✅ **9 Visual Styles** - stroke-rounded, solid-rounded, duotone-rounded, and 6 more
- ✅ **13 Framework Packages** - React, Vue, Angular, Svelte, Solid, Preact, Astro, Nuxt, Laravel, React Native, Flutter, Swift
- ✅ **Multi-Color Support** - Independent color customization for duotone/twotone/bulk styles
- ✅ **Tree-Shakeable** - Only import what you need
- ✅ **TypeScript First** - Full type safety with autocomplete
- ✅ **Accessibility** - ARIA-compliant, screen reader friendly
- ✅ **MIT Licensed** - Free for commercial use

## Quick Start

### React

```bash
pnpm add @ruman/react
```

```tsx
import { Home, Settings, User } from '@ruman/react/icons/stroke-rounded';

function App() {
  return (
    <div>
      <Home size={24} color="#3B82F6" />
      <Settings size={32} strokeWidth={1.5} />
      <User className="icon-user" />
    </div>
  );
}
```

### Vue 3

```bash
pnpm add @ruman/vue
```

```vue
<script setup>
import { Home, Settings } from '@ruman/vue/icons/stroke-rounded';
</script>

<template>
  <Home :size="24" color="#3B82F6" />
  <Settings :size="32" stroke-width="1.5" />
</template>
```

### Angular

```bash
pnpm add @ruman/angular
```

```typescript
import { RumanIconsModule } from '@ruman/angular';

@NgModule({
  imports: [RumanIconsModule]
})
```

```html
<ruman-icon name="home" style="stroke-rounded" [size]="24"></ruman-icon>
```

## Available Packages

| Package | Description | Version | Downloads |
|---------|-------------|---------|-----------|
| [@ruman/icons](./packages/core) | Core TypeScript library | ![npm](https://img.shields.io/npm/v/@ruman/icons) | ![downloads](https://img.shields.io/npm/dm/@ruman/icons) |
| [@ruman/react](./packages/react) | React components | ![npm](https://img.shields.io/npm/v/@ruman/react) | ![downloads](https://img.shields.io/npm/dm/@ruman/react) |
| [@ruman/vue](./packages/vue) | Vue 3 components | ![npm](https://img.shields.io/npm/v/@ruman/vue) | ![downloads](https://img.shields.io/npm/dm/@ruman/vue) |
| [@ruman/angular](./packages/angular) | Angular components | ![npm](https://img.shields.io/npm/v/@ruman/angular) | ![downloads](https://img.shields.io/npm/dm/@ruman/angular) |
| [@ruman/svelte](./packages/svelte) | Svelte components | ![npm](https://img.shields.io/npm/v/@ruman/svelte) | ![downloads](https://img.shields.io/npm/dm/@ruman/svelte) |
| [@ruman/solid](./packages/solid) | Solid.js components | ![npm](https://img.shields.io/npm/v/@ruman/solid) | ![downloads](https://img.shields.io/npm/dm/@ruman/solid) |
| [@ruman/preact](./packages/preact) | Preact components | ![npm](https://img.shields.io/npm/v/@ruman/preact) | ![downloads](https://img.shields.io/npm/dm/@ruman/preact) |
| [@ruman/astro](./packages/astro) | Astro components | ![npm](https://img.shields.io/npm/v/@ruman/astro) | ![downloads](https://img.shields.io/npm/dm/@ruman/astro) |
| [@ruman/nuxt](./packages/nuxt) | Nuxt.js module | ![npm](https://img.shields.io/npm/v/@ruman/nuxt) | ![downloads](https://img.shields.io/npm/dm/@ruman/nuxt) |
| [@ruman/laravel](./packages/laravel) | Laravel Blade components | ![packagist](https://img.shields.io/packagist/v/ruman/icons) | ![downloads](https://img.shields.io/packagist/dm/ruman/icons) |
| [@ruman/static](./packages/static) | Static SVG files | ![npm](https://img.shields.io/npm/v/@ruman/static) | ![downloads](https://img.shields.io/npm/dm/@ruman/static) |

## Icon Styles

### Available Styles

1. **stroke-rounded** - Outlined icons with rounded line caps
2. **stroke-sharp** - Outlined icons with sharp corners
3. **stroke-standard** - Outlined icons with standard corners
4. **solid-rounded** - Filled icons with rounded corners
5. **solid-sharp** - Filled icons with sharp corners
6. **solid-standard** - Filled icons with standard corners
7. **duotone-rounded** - Two-tone icons (multi-color support)
8. **twotone-rounded** - Two-tone variant (multi-color support)
9. **bulk-rounded** - Bulk style (multi-color support)

### Multi-Color Icons

```tsx
import { Home } from '@ruman/react/icons/duotone-rounded';

<Home
  size={32}
  primaryColor="#3B82F6"
  secondaryColor="#93C5FD"
/>
```

## Documentation

- **[Getting Started](./docs/getting-started.md)** - Installation and basic usage
- **[API Reference](./docs/api/)** - Complete API documentation
- **[Migration Guide](./docs/migration/)** - Migrating from other libraries
- **[Contributing](./CONTRIBUTING.md)** - How to contribute

## Credits

**Icon Design:** [HugeIcons V4](https://hugeicons.com)
**Distributed by:** [Saudi Digital Government Authority (DGA)](https://dga.gov.sa)
**Library Development:** Saleh / [Ruman Agency](https://ruman.sa) (وكالة رمان)

Special thanks to the Saudi Digital Government Authority for making these icons freely available to the community.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: hello@ruman.sa
- 🐛 Issues: [GitHub Issues](https://github.com/rumanagency/dga-icons/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/rumanagency/dga-icons/discussions)

---

**Made with ❤️ by [Ruman Agency](https://ruman.sa)**
