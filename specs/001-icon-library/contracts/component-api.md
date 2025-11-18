# Icon Component API Contract

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2025-11-18

## Overview

This document defines the unified icon component API across all framework packages in the DGA Icons library. All framework-specific packages (`@ruman/react`, `@ruman/vue`, `@ruman/svelte`, etc.) must implement this contract with framework-appropriate idioms.

---

## Common Props Interface

All icon components across frameworks must support the following properties:

### Base Props (Required)

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | `number \| string` | `24` | Icon width and height in pixels (number) or CSS units (string, e.g., "2rem") |
| `color` | `string` | `'currentColor'` | Icon color (CSS color value). For single-color icons only. |
| `strokeWidth` | `number` | `2` | Stroke width for stroke-style icons. Ignored for solid styles. |
| `absoluteStrokeWidth` | `boolean` | `false` | If true, stroke width scales with icon size. If false, remains constant. |

### Multi-Color Props (Conditional)

For `duotone-rounded`, `twotone-rounded`, and `bulk-rounded` styles:

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `primaryColor` | `string` | `'currentColor'` | Primary/foreground color for multi-color icons |
| `secondaryColor` | `string` | `'currentColor'` | Secondary/background color for multi-color icons |

**Behavior**:
- If `primaryColor` is set, it takes precedence over `color` for the primary path
- If `secondaryColor` is set, it applies to the secondary path (with opacity)
- If only `color` is set, both paths use the same color (multi-color effect is lost)
- If none are set, both default to `currentColor`

### Framework-Specific Props

Each framework may add additional props following their conventions:

**React**:
```typescript
className?: string;
style?: React.CSSProperties;
ref?: React.Ref<SVGSVGElement>;
// All standard SVGProps<SVGSVGElement> except those overridden above
```

**Vue**:
```typescript
class?: string | object | Array<string | object>;
style?: string | object;
// All standard SVG attributes (kebab-case in templates)
```

**Svelte**:
```typescript
class?: string;
style?: string;
// All standard SVG attributes
```

**Angular**:
```typescript
class?: string;
ngStyle?: { [key: string]: any };
ngClass?: string | string[] | { [key: string]: boolean };
```

---

## TypeScript Type Definitions

### Core Icon Props Interface

```typescript
/**
 * Base icon component props shared across all frameworks
 */
export interface IconProps {
  /**
   * Icon size in pixels (number) or CSS units (string)
   * @default 24
   * @example
   * <Icon size={32} />
   * <Icon size="2rem" />
   */
  size?: number | string;

  /**
   * Icon color (CSS color value)
   * For single-color icons, this sets the fill/stroke color.
   * For multi-color icons, use primaryColor and secondaryColor instead.
   * @default 'currentColor'
   * @example
   * <Icon color="#3B82F6" />
   * <Icon color="rgb(59, 130, 246)" />
   */
  color?: string;

  /**
   * Stroke width for stroke-style icons (stroke-rounded, stroke-sharp, stroke-standard)
   * Ignored for solid and multi-color styles.
   * @default 2
   * @example
   * <Icon strokeWidth={1.5} />
   */
  strokeWidth?: number;

  /**
   * If true, stroke width scales with icon size.
   * If false, stroke width remains constant regardless of size.
   * @default false
   */
  absoluteStrokeWidth?: boolean;

  /**
   * Primary/foreground color for multi-color icons (duotone, twotone, bulk)
   * Takes precedence over `color` prop.
   * @default 'currentColor'
   * @example
   * <Icon primaryColor="#3B82F6" secondaryColor="#93C5FD" />
   */
  primaryColor?: string;

  /**
   * Secondary/background color for multi-color icons (duotone, twotone, bulk)
   * Applied to paths with opacity attributes.
   * @default 'currentColor'
   */
  secondaryColor?: string;
}
```

### React-Specific Type

```typescript
import type { SVGProps } from 'react';

/**
 * React icon component props
 * Extends base IconProps with React-specific SVG attributes
 */
export interface ReactIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'size' | 'color'>, IconProps {
  /**
   * CSS class name(s) to apply to the SVG element
   */
  className?: string;

  /**
   * Inline styles to apply to the SVG element
   */
  style?: React.CSSProperties;
}

/**
 * React icon component type with forwarded ref
 */
export type ReactIconComponent = React.ForwardRefExoticComponent<
  ReactIconProps & React.RefAttributes<SVGSVGElement>
>;
```

### Vue-Specific Type

```typescript
import type { SVGAttributes } from 'vue';

/**
 * Vue icon component props
 * Uses kebab-case for multi-word props in templates
 */
export interface VueIconProps extends IconProps {
  /**
   * CSS class name(s) - supports string, object, or array
   */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;

  /**
   * Inline styles - supports string or object
   */
  style?: string | Record<string, string | number>;
}

/**
 * Vue icon component type
 */
export type VueIconComponent = DefineComponent<VueIconProps>;
```

---

## Framework-Specific Implementations

### React Implementation

**Import Syntax**:
```typescript
// Named imports from style-specific paths
import { Home, Settings, User } from '@ruman/react/icons/stroke-rounded';
import { Home as HomeSolid } from '@ruman/react/icons/solid-rounded';
import { Home as HomeDuotone } from '@ruman/react/icons/duotone-rounded';

// Type imports
import type { ReactIconProps } from '@ruman/react';
```

**Usage Examples**:

```tsx
import { Home } from '@ruman/react/icons/stroke-rounded';

// Basic usage
<Home />

// Custom size (number)
<Home size={32} />

// Custom size (string)
<Home size="2rem" />

// Custom color
<Home color="#3B82F6" />

// Custom stroke width
<Home strokeWidth={1.5} />

// With className and style
<Home
  size={24}
  color="#3B82F6"
  className="icon-home"
  style={{ marginRight: '8px' }}
/>

// With ref
const iconRef = useRef<SVGSVGElement>(null);
<Home ref={iconRef} size={24} />

// Multi-color icon
import { Home as HomeDuotone } from '@ruman/react/icons/duotone-rounded';
<HomeDuotone
  size={32}
  primaryColor="#3B82F6"
  secondaryColor="#93C5FD"
/>

// Spread SVG attributes
<Home
  size={24}
  aria-label="Home icon"
  role="img"
  onClick={() => navigate('/home')}
/>
```

**Component Implementation Pattern**:

```typescript
// createLucideIcon.ts (React)
import { forwardRef, type SVGProps } from 'react';
import type { ReactIconProps } from './types';

interface CreateIconOptions {
  iconName: string;
  svgChildren: string;
}

export default function createLucideIcon({ iconName, svgChildren }: CreateIconOptions) {
  const IconComponent = forwardRef<SVGSVGElement, ReactIconProps>(
    (
      {
        size = 24,
        color,
        primaryColor,
        secondaryColor,
        strokeWidth = 2,
        absoluteStrokeWidth = false,
        className,
        style,
        ...restProps
      },
      ref
    ) => {
      // Calculate computed color values
      const computedPrimaryColor = primaryColor || color || 'currentColor';
      const computedSecondaryColor = secondaryColor || color || 'currentColor';

      // Merge styles with CSS custom properties
      const computedStyle = {
        ...style,
        '--ruman-icon-primary': computedPrimaryColor,
        '--ruman-icon-secondary': computedSecondaryColor,
      } as React.CSSProperties;

      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={computedPrimaryColor}
          strokeWidth={absoluteStrokeWidth ? strokeWidth : strokeWidth * 24 / Number(size)}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={computedStyle}
          {...restProps}
          dangerouslySetInnerHTML={{ __html: svgChildren }}
        />
      );
    }
  );

  IconComponent.displayName = iconName;
  return IconComponent;
}
```

---

### Vue 3 Implementation

**Import Syntax**:
```typescript
// Named imports from style-specific paths
import { Home, Settings, User } from '@ruman/vue/icons/stroke-rounded';
import { Home as HomeSolid } from '@ruman/vue/icons/solid-rounded';
```

**Usage Examples**:

```vue
<script setup lang="ts">
import { Home } from '@ruman/vue/icons/stroke-rounded';
import { Home as HomeDuotone } from '@ruman/vue/icons/duotone-rounded';
import { ref } from 'vue';

const iconSize = ref(24);
const iconColor = ref('#3B82F6');
</script>

<template>
  <!-- Basic usage -->
  <Home />

  <!-- Custom size (number) -->
  <Home :size="32" />

  <!-- Custom size (string) -->
  <Home size="2rem" />

  <!-- Custom color -->
  <Home color="#3B82F6" />

  <!-- Reactive props -->
  <Home :size="iconSize" :color="iconColor" />

  <!-- With class and style -->
  <Home
    :size="24"
    color="#3B82F6"
    class="icon-home"
    style="margin-right: 8px"
  />

  <!-- Multi-color icon (kebab-case props) -->
  <HomeDuotone
    :size="32"
    primary-color="#3B82F6"
    secondary-color="#93C5FD"
  />

  <!-- With v-bind -->
  <Home
    v-bind="iconProps"
    @click="handleClick"
  />

  <!-- With ref -->
  <Home ref="iconRef" :size="24" />
</template>
```

**Component Implementation Pattern**:

```typescript
// createLucideIcon.ts (Vue)
import { defineComponent, computed, type PropType } from 'vue';
import type { VueIconProps } from './types';

interface CreateIconOptions {
  iconName: string;
  svgChildren: string;
}

export default function createLucideIcon({ iconName, svgChildren }: CreateIconOptions) {
  return defineComponent({
    name: iconName,
    props: {
      size: {
        type: [Number, String] as PropType<number | string>,
        default: 24,
      },
      color: {
        type: String,
        default: 'currentColor',
      },
      primaryColor: String,
      secondaryColor: String,
      strokeWidth: {
        type: Number,
        default: 2,
      },
      absoluteStrokeWidth: {
        type: Boolean,
        default: false,
      },
      class: [String, Object, Array],
      style: [String, Object],
    },
    setup(props) {
      const computedStyle = computed(() => {
        const primary = props.primaryColor || props.color;
        const secondary = props.secondaryColor || props.color;

        return {
          ...(typeof props.style === 'object' ? props.style : {}),
          '--ruman-icon-primary': primary,
          '--ruman-icon-secondary': secondary,
        };
      });

      const computedStrokeWidth = computed(() => {
        if (props.absoluteStrokeWidth) return props.strokeWidth;
        return props.strokeWidth * 24 / Number(props.size);
      });

      return { computedStyle, computedStrokeWidth };
    },
    template: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="primaryColor || color"
        :stroke-width="computedStrokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="class"
        :style="computedStyle"
        v-html="'${svgChildren}'"
      />
    `,
  });
}
```

---

### Svelte Implementation

**Import Syntax**:
```typescript
import { Home, Settings, User } from '@ruman/svelte/icons/stroke-rounded';
import { Home as HomeSolid } from '@ruman/svelte/icons/solid-rounded';
```

**Usage Examples**:

```svelte
<script>
import { Home } from '@ruman/svelte/icons/stroke-rounded';
import { Home as HomeDuotone } from '@ruman/svelte/icons/duotone-rounded';

let iconSize = 24;
let iconColor = '#3B82F6';
</script>

<!-- Basic usage -->
<Home />

<!-- Custom size -->
<Home size={32} />
<Home size="2rem" />

<!-- Custom color -->
<Home color="#3B82F6" />

<!-- Reactive props -->
<Home size={iconSize} color={iconColor} />

<!-- With class and style -->
<Home
  size={24}
  color="#3B82F6"
  class="icon-home"
  style="margin-right: 8px"
/>

<!-- Multi-color icon -->
<HomeDuotone
  size={32}
  primaryColor="#3B82F6"
  secondaryColor="#93C5FD"
/>

<!-- Event handlers -->
<Home
  size={24}
  on:click={handleClick}
  on:mouseenter={handleHover}
/>

<!-- With bind:this -->
<Home bind:this={iconRef} size={24} />
```

---

### Angular Implementation

**Import Syntax**:
```typescript
// Module import in your Angular module
import { RumanIconsModule } from '@ruman/angular';

// In component TypeScript
import { IconName } from '@ruman/angular';
```

**Usage Examples**:

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- Basic usage -->
    <ruman-icon name="home" style="stroke-rounded"></ruman-icon>

    <!-- Custom size -->
    <ruman-icon name="home" style="stroke-rounded" [size]="32"></ruman-icon>
    <ruman-icon name="home" style="stroke-rounded" size="2rem"></ruman-icon>

    <!-- Custom color -->
    <ruman-icon name="home" style="stroke-rounded" color="#3B82F6"></ruman-icon>

    <!-- Reactive props -->
    <ruman-icon
      name="home"
      style="stroke-rounded"
      [size]="iconSize"
      [color]="iconColor"
    ></ruman-icon>

    <!-- Multi-color icon -->
    <ruman-icon
      name="home"
      style="duotone-rounded"
      [size]="32"
      primaryColor="#3B82F6"
      secondaryColor="#93C5FD"
    ></ruman-icon>

    <!-- With Angular directives -->
    <ruman-icon
      name="home"
      style="stroke-rounded"
      [size]="24"
      [ngClass]="{'active': isActive}"
      (click)="handleClick()"
    ></ruman-icon>
  `,
})
export class AppComponent {
  iconSize = 24;
  iconColor = '#3B82F6';
  isActive = true;

  handleClick() {
    console.log('Icon clicked');
  }
}
```

---

## Color Customization Behavior

### Single-Color Icons

For `stroke-rounded`, `stroke-sharp`, `stroke-standard`, `solid-rounded`, `solid-sharp`, `solid-standard`:

**Props Hierarchy**:
1. If `color` is set → use `color`
2. If `primaryColor` is set → use `primaryColor` (ignore `color`)
3. Otherwise → use `currentColor`

**Ignored Props**:
- `secondaryColor` (no effect on single-color icons)

**Example**:
```tsx
// All equivalent for single-color icons
<Home color="#3B82F6" />
<Home primaryColor="#3B82F6" />
<Home primaryColor="#3B82F6" secondaryColor="#93C5FD" /> // secondaryColor ignored
```

### Multi-Color Icons

For `duotone-rounded`, `twotone-rounded`, `bulk-rounded`:

**Props Hierarchy**:
1. Primary path: `primaryColor` → `color` → `currentColor`
2. Secondary path: `secondaryColor` → `color` → `currentColor`

**CSS Variable Mapping**:
```css
/* Applied to SVG element */
--ruman-icon-primary: <primaryColor || color || currentColor>;
--ruman-icon-secondary: <secondaryColor || color || currentColor>;
```

**SVG Transformation**:
```svg
<!-- Original multi-color SVG -->
<svg>
  <path fill="currentColor" opacity="0.4" d="..."/> <!-- Background -->
  <path fill="currentColor" d="..."/> <!-- Foreground -->
</svg>

<!-- Transformed at build time -->
<svg>
  <path fill="var(--ruman-icon-secondary, currentColor)" opacity="0.4" d="..."/>
  <path fill="var(--ruman-icon-primary, currentColor)" d="..."/>
</svg>
```

**Example**:
```tsx
import { Home } from '@ruman/react/icons/duotone-rounded';

// Both colors customized
<Home primaryColor="#3B82F6" secondaryColor="#93C5FD" />

// Only primary customized (secondary uses currentColor)
<Home primaryColor="#3B82F6" />

// Single color for both paths (loses multi-color effect)
<Home color="#3B82F6" />

// Inherits from parent text color
<div style={{ color: '#3B82F6' }}>
  <Home /> {/* Both paths use #3B82F6 */}
</div>
```

---

## Stroke Width Behavior

### Absolute vs Relative Stroke Width

**Relative Stroke Width** (default, `absoluteStrokeWidth={false}`):
- Stroke width scales proportionally with icon size
- Maintains visual consistency across different sizes
- Formula: `actualStrokeWidth = strokeWidth * 24 / size`

**Absolute Stroke Width** (`absoluteStrokeWidth={true}`):
- Stroke width remains constant regardless of icon size
- Useful for maintaining precise line weights

**Example**:
```tsx
import { Home } from '@ruman/react/icons/stroke-rounded';

// Relative (default): stroke scales with size
<Home size={12} strokeWidth={2} /> // Actual stroke: 4px (appears thicker)
<Home size={24} strokeWidth={2} /> // Actual stroke: 2px
<Home size={48} strokeWidth={2} /> // Actual stroke: 1px (appears thinner)

// Absolute: stroke stays constant
<Home size={12} strokeWidth={2} absoluteStrokeWidth /> // Stroke: 2px
<Home size={24} strokeWidth={2} absoluteStrokeWidth /> // Stroke: 2px
<Home size={48} strokeWidth={2} absoluteStrokeWidth /> // Stroke: 2px
```

---

## Error Handling

### Invalid Props

| Scenario | Behavior |
|----------|----------|
| Negative size | Warning logged, renders at default size (24) |
| Size = 0 | Warning logged, renders at default size (24) |
| Invalid color value | SVG accepts any string, browser handles invalid colors |
| strokeWidth < 0 | Warning logged, uses default (2) |
| Invalid style name in import path | TypeScript error at compile time, module not found |
| Non-existent icon name | TypeScript error at compile time, module not found |

### Browser Compatibility

**SVG Support**: Required (>99% global coverage)
**CSS Custom Properties**: Required for multi-color icons (all modern browsers)

**Fallback for Legacy Browsers**:
```tsx
// If CSS variables not supported, falls back to currentColor
<svg style="--ruman-icon-primary: #3B82F6">
  <path fill="var(--ruman-icon-primary, currentColor)" />
  <!-- Renders with currentColor in IE11 -->
</svg>
```

---

## Accessibility

### ARIA Attributes

All icon components accept standard SVG ARIA attributes:

```tsx
// Decorative icon (hidden from screen readers)
<Home aria-hidden="true" />

// Semantic icon with label
<Home
  role="img"
  aria-label="Home"
/>

// Icon button
<button>
  <Home aria-hidden="true" />
  <span>Go Home</span>
</button>

// Icon-only button
<button aria-label="Go to home page">
  <Home aria-hidden="true" />
</button>
```

### Recommended Patterns

**Decorative Icons** (no semantic meaning):
```tsx
<Home aria-hidden="true" />
```

**Semantic Icons** (convey meaning):
```tsx
<Home role="img" aria-label="Home page" />
```

**Interactive Icons**:
```tsx
<button aria-label="Go home">
  <Home aria-hidden="true" />
</button>
```

---

## Performance Considerations

### Bundle Size Impact

**Tree-shaking**: Only imported icons are included in bundle
**Estimated Size**:
- Single icon: ~0.5-1KB (minified + gzipped)
- 10 icons: ~5-10KB
- 100 icons: ~50-100KB

**Optimization Tips**:
1. Import only needed icons
2. Use dynamic imports for rarely-used icons
3. Avoid barrel imports (`import * from '@ruman/react'`)

### Rendering Performance

**Benchmarks**:
- Single icon render: <1ms
- 100 icons render: <16ms (60fps)
- 1000 icons render: <100ms

**Optimization**:
- Icons are pure components (React.memo, Vue computed)
- SVG paths are static, no runtime parsing
- CSS variables avoid style recalculation

---

## Version Compatibility

| Framework | Minimum Version | Recommended Version |
|-----------|-----------------|---------------------|
| React | 16.8.0 (Hooks) | 18.2.0+ |
| Vue | 3.0.0 | 3.3.0+ |
| Svelte | 3.0.0 | 4.0.0+ |
| Angular | 12.0.0 | 16.0.0+ |
| Solid | 1.0.0 | 1.7.0+ |
| Preact | 10.0.0 | 10.15.0+ |

---

## Contract Compliance Checklist

Framework packages must implement:

- [ ] All base props (size, color, strokeWidth, absoluteStrokeWidth)
- [ ] Multi-color props (primaryColor, secondaryColor)
- [ ] Framework-specific props (className/class, style, ref)
- [ ] TypeScript type definitions
- [ ] CSS custom property support for multi-color icons
- [ ] Stroke width scaling logic
- [ ] Default values (size=24, strokeWidth=2, color=currentColor)
- [ ] ARIA attribute pass-through
- [ ] SVG attribute pass-through
- [ ] Tree-shaking support
- [ ] Forward refs (where applicable)
- [ ] Display name for debugging
- [ ] PropTypes or runtime validation (optional)

---

**Document Status**: Draft
**Next Review**: After Phase 1 implementation
**Maintainer**: Ruman Agency Development Team
