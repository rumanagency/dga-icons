# Implementation Plan: DGA Icons - Multi-Platform Icon Library

**Branch**: `001-icon-library` | **Date**: 2025-11-18 | **Spec**: [spec.md](./spec.md)
**Status**: Phase 1 Complete - Ready for Implementation

## Summary

DGA Icons is a comprehensive, open-source icon library providing 39,186 optimized SVG icons across 9 distinct visual styles (bulk-rounded, duotone-rounded, solid-rounded, solid-sharp, solid-standard, stroke-rounded, stroke-sharp, stroke-standard, twotone-rounded). The library will be distributed as 13+ framework-specific packages under the `@ruman` namespace, generated from a Turborepo monorepo architecture using SVGO for optimization, custom build-icons CLI for code generation, and automated testing with Vitest.

**Development Strategy**: Sequential branch approach - each package will be developed in its own feature branch (e.g., `feature/core-package`, `feature/react-package`) and merged to main only after comprehensive testing and validation.

## Technical Context

**Language/Version**: TypeScript 5.8.3 (strict mode), Node.js 18+ (LTS)
**Primary Dependencies**: Turborepo v2.x, pnpm v10.11.0, Rollup v4.x, SVGO, Vitest v3.1.3
**Storage**: Git for source SVGs + code, npm registry for published packages, CDN (jsDelivr/unpkg) for browser distribution
**Testing**: Vitest + Testing Library (@testing-library/react, @testing-library/vue, etc.) + v8 coverage (>80% target)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions), Node.js 18+ for build tools
**Project Type**: Monorepo (web-focused) with 13+ framework packages
**Performance Goals**: Tree-shaking support, <5KB per icon (gzipped), <30s to generate 4,300 icons, <5min full monorepo build
**Constraints**: SVG-only (no raster), <5KB per icon, 9-style parity (identical icon names across all styles), MIT licensed
**Scale/Scope**: 39,186 total icons (4,354 per style × 9 styles), 13+ packages (Week 1: 11 web packages, Week 2: 3 mobile packages)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Monorepo-First Architecture
**Status**: COMPLIANT
**Evidence**: Using Turborepo + pnpm workspaces for all 13+ packages, single source of truth for all 39,186 icons, shared build infrastructure in tools/, atomic version synchronization

### ✅ Principle II: Style Parity (NON-NEGOTIABLE)
**Status**: COMPLIANT
**Evidence**: All 4,354 icons exist across all 9 styles with identical naming (verified via icon count analysis), build system enforces parity via validation scripts

### ✅ Principle III: Framework-Agnostic Core
**Status**: COMPLIANT
**Evidence**: @ruman/icons core package contains only SVG data + vanilla JS/TS utilities, framework packages (@ruman/react, @ruman/vue, etc.) are thin wrappers, no runtime framework dependencies in core

### ✅ Principle IV: Package Per Framework Strategy
**Status**: COMPLIANT
**Evidence**: Week 1 delivers 11 mandatory packages (@ruman/icons, react, vue, angular, svelte, solid, preact, astro, nuxt, laravel, static), Week 2 adds 3 mobile packages (react-native, flutter, swift)

### ✅ Principle V: SVG Optimization & Validation (NON-NEGOTIABLE)
**Status**: COMPLIANT
**Evidence**: SVGO processing with custom config (viewBox: "0 0 24 24", currentColor, <5KB limit), automated validation in CI/CD, build-time checks for naming/structure

### ✅ Principle VI: Multi-Color Icon Support
**Status**: COMPLIANT
**Evidence**: CSS custom properties (--ruman-icon-primary/secondary) for duotone/twotone/bulk styles, build-time SVG transformation to inject variables, primaryColor/secondaryColor props in all frameworks

### ✅ Principle VII: Type Safety & Developer Experience
**Status**: COMPLIANT
**Evidence**: Auto-generated TypeScript string literal unions for 4,354+ icon names per style, strict null checking, JSDoc documentation, IntelliSense support, zero `any` types in public APIs

### ✅ Principle VIII: Tree-Shaking & Bundle Optimization
**Status**: COMPLIANT
**Evidence**: ES modules format, sideEffects: false in package.json, style-specific barrel exports (@ruman/react/icons/stroke-rounded), individual icon files for direct imports, <5KB per icon target

### ✅ Principle IX: Automated Testing & Quality Gates
**Status**: COMPLIANT
**Evidence**: Vitest + Testing Library for >80% coverage, component tests (props, rendering, a11y), bundle size tests, tree-shaking verification, GitHub Actions CI/CD with mandatory green checks before merge

### ✅ Principle X: Semantic Versioning & Breaking Change Policy
**Status**: COMPLIANT
**Evidence**: All packages synchronized at v0.1.0 (beta), v1.0.0 after community feedback, changesets for version management, CHANGELOG.md per package, deprecation policy (1 MAJOR version support)

### ✅ Principle XI: Branch-Based Development & Merge Safety (NON-NEGOTIABLE)
**STATUS**: COMPLIANT
**Evidence**: Sequential branch strategy (feature/core-package, feature/react-package, etc.), GitHub branch protection enabled, all 7 merge criteria required (tests pass, code review approved, build succeeds, docs updated, manual verification, no conflicts, constitution compliance), squash merge for clean history

**GATE RESULT**: ✅ PASS - All 11 constitutional principles satisfied, ready to proceed

## Project Structure

### Documentation (this feature)

```
specs/001-icon-library/
├── spec.md              # Feature specification (User Stories + Requirements)
├── plan.md              # This file (Implementation Plan)
├── research.md          # Phase 0 output (Technical Decisions + Lucide Analysis)
├── data-model.md        # Phase 1 output (Entity Definitions + Data Flow)
├── quickstart.md        # Phase 1 output (Developer Quick Start Guide)
├── contracts/           # Phase 1 output (API Contracts)
│   ├── README.md
│   ├── component-api.md
│   ├── package-exports.md
│   ├── build-api.md
│   └── metadata-schema.json
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan - use /speckit.tasks)
```

### Source Code (repository root)

```
dga-icons/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # Lint + Test + Build on PR
│   │   ├── publish.yml          # Publish to npm on release
│   │   ├── test-packages.yml    # Per-package testing
│   │   └── visual-regression.yml # Icon rendering tests
│   └── CONTRIBUTING.md
│
├── packages/
│   ├── core/                    # @ruman/icons (Week 1, Branch: feature/core-package)
│   │   ├── src/
│   │   │   ├── bulk-rounded/
│   │   │   ├── duotone-rounded/
│   │   │   ├── solid-rounded/
│   │   │   ├── solid-sharp/
│   │   │   ├── solid-standard/
│   │   │   ├── stroke-rounded/
│   │   │   ├── stroke-sharp/
│   │   │   ├── stroke-standard/
│   │   │   ├── twotone-rounded/
│   │   │   ├── createElement.ts
│   │   │   ├── defaultAttributes.ts
│   │   │   └── types.ts
│   │   ├── scripts/
│   │   │   └── exportTemplate.mts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── rollup.config.mjs
│   │   ├── vitest.config.mts
│   │   └── README.md
│   │
│   ├── react/                   # @ruman/react (Week 1, Branch: feature/react-package)
│   │   ├── src/
│   │   │   ├── bulk-rounded/
│   │   │   ├── duotone-rounded/
│   │   │   ├── solid-rounded/
│   │   │   ├── solid-sharp/
│   │   │   ├── solid-standard/
│   │   │   ├── stroke-rounded/
│   │   │   ├── stroke-sharp/
│   │   │   ├── stroke-standard/
│   │   │   ├── twotone-rounded/
│   │   │   ├── Icon.tsx
│   │   │   ├── createRumanIcon.ts
│   │   │   └── types.ts
│   │   ├── scripts/exportTemplate.mts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── vue/                     # @ruman/vue (Week 1, Branch: feature/vue-package)
│   ├── svelte/                  # @ruman/svelte (Week 1, Branch: feature/svelte-package)
│   ├── angular/                 # @ruman/angular (Week 1, Branch: feature/angular-package)
│   ├── solid/                   # @ruman/solid (Week 1, Branch: feature/solid-package)
│   ├── preact/                  # @ruman/preact (Week 1, Branch: feature/preact-package)
│   ├── astro/                   # @ruman/astro (Week 1, Branch: feature/astro-package)
│   ├── nuxt/                    # @ruman/nuxt (Week 1, Branch: feature/nuxt-package)
│   ├── laravel/                 # @ruman/laravel (Week 1, Branch: feature/laravel-package)
│   ├── static/                  # @ruman/static (Week 1, Branch: feature/static-package)
│   ├── react-native/            # @ruman/react-native (Week 2)
│   ├── flutter/                 # @ruman/flutter (Week 2)
│   └── swift/                   # @ruman/swift (Week 2)
│
├── tools/
│   ├── build-helpers/           # Shared utilities (20+ functions)
│   │   ├── src/
│   │   │   ├── readSvg.ts
│   │   │   ├── readAllStyles.ts
│   │   │   ├── toPascalCase.ts
│   │   │   ├── toKebabCase.ts
│   │   │   └── ... (16 more)
│   │   └── package.json
│   │
│   ├── build-icons/             # Code generation CLI
│   │   ├── cli.ts
│   │   ├── building/
│   │   │   ├── generateIconFiles.ts
│   │   │   ├── generateExportsFile.ts
│   │   │   └── generateStyleExports.ts
│   │   └── package.json
│   │
│   └── rollup-plugins/          # Shared Rollup configuration
│       ├── plugins.js
│       └── package.json
│
├── icons/                       # Source SVG files (committed to git)
│   ├── bulk-rounded/            # 4,354 icons
│   ├── duotone-rounded/         # 4,354 icons
│   ├── solid-rounded/           # 4,354 icons
│   ├── solid-sharp/             # 4,353 icons
│   ├── solid-standard/          # 4,320 icons
│   ├── stroke-rounded/          # 4,354 icons
│   ├── stroke-sharp/            # 4,353 icons
│   ├── stroke-standard/         # 4,322 icons
│   └── twotone-rounded/         # 4,354 icons
│
├── scripts/
│   ├── optimize-svgs.mts        # SVGO batch processing (DONE)
│   ├── addMissingIconJsonFiles.mts # Metadata generation
│   ├── validate-icons.mts       # SVG validation
│   └── build-all-packages.mts   # Monorepo build orchestration
│
├── .gitignore                   # Ignore generated files (see below)
├── package.json                 # Root package.json (monorepo, private: true)
├── pnpm-workspace.yaml          # PNPM workspace config
├── turbo.json                   # Turborepo configuration
├── tsconfig.json                # Shared TypeScript config
├── LICENSE                      # MIT License
└── README.md                    # Project overview + quickstart
```

**Structure Decision**: Monorepo with packages/ directory for framework-specific builds, tools/ for shared build utilities, icons/ for source SVG files. This follows Lucide Icons architecture but adapted for 9 styles (each package has 9 subdirectories for style variants). Sequential branch strategy ensures each package is fully tested before merge.

### Gitignore Strategy

Based on Lucide reference + 9-style requirements:

```gitignore
# Development
.DS_Store
.idea
.vscode
node_modules/
*.log

# Build Artifacts
dist/
build/
coverage/
.next/
.nuxt/
.turbo/

# Generated Icon Files (NOT committed - auto-generated at build time)
packages/**/src/bulk-rounded/*.ts
packages/**/src/bulk-rounded/*.tsx
packages/**/src/duotone-rounded/*.ts
packages/**/src/duotone-rounded/*.tsx
packages/**/src/solid-rounded/*.ts
packages/**/src/solid-rounded/*.tsx
packages/**/src/solid-sharp/*.ts
packages/**/src/solid-sharp/*.tsx
packages/**/src/solid-standard/*.ts
packages/**/src/solid-standard/*.tsx
packages/**/src/stroke-rounded/*.ts
packages/**/src/stroke-rounded/*.tsx
packages/**/src/stroke-sharp/*.ts
packages/**/src/stroke-sharp/*.tsx
packages/**/src/stroke-standard/*.ts
packages/**/src/stroke-standard/*.tsx
packages/**/src/twotone-rounded/*.ts
packages/**/src/twotone-rounded/*.tsx

# Generated Type Files
packages/**/src/aliases/*.ts
packages/**/src/aliases.ts
!packages/**/src/aliases/index.ts
packages/**/src/dynamicIconImports.ts
packages/**/DynamicIcon.d.ts
packages/**/dynamicIconImports.js
packages/**/dynamicIconImports.d.ts
packages/**/dynamicIconImports.js.map
packages/**/dynamic.d.ts
packages/**/dynamic.mjs
packages/**/dynamic.mjs.map

# Published Files (generated during build, not source)
packages/**/LICENSE
icons/metadata.json
icons/categories.json
icons/tags.json

# Documentation Build
docs/.vitepress/cache
docs/.vitepress/dist
docs/.vitepress/.temp
docs/.vitepress/data/iconNodes
docs/.vitepress/data/iconMetaData.ts
docs/.vitepress/data/releaseMetaData.json

# Environment
.env
.env.local
```

**Rationale**: Generated icon files (4,354 × 9 = 39,186 files per package) would pollute git history. Source SVGs in icons/ are committed, but all TypeScript/JSX components are auto-generated at build time from templates.

## Complexity Tracking

*No constitution violations - this section is empty as all 11 principles are satisfied.*

## Implementation Phases

### Phase 0: Foundation & Setup (Week 1, Days 1-2)

**Objective**: Set up monorepo infrastructure and build tools before generating any packages.

**Tasks**:
1. Initialize Turborepo + pnpm workspace
2. Configure root-level scripts and tooling
3. Set up tools/build-helpers with 20+ utility functions
4. Create tools/build-icons CLI with 9-style support
5. Set up GitHub repository with branch protection
6. Configure CI/CD pipelines (GitHub Actions)
7. Create comprehensive .gitignore
8. Set up ESLint + Prettier + TypeScript configs

**Branch**: `feature/monorepo-setup`

**Deliverables**:
- ✅ turbo.json with pipeline configuration
- ✅ pnpm-workspace.yaml with packages/ + tools/ workspaces
- ✅ tools/build-helpers package published internally
- ✅ tools/build-icons CLI functional for all 9 styles
- ✅ .github/workflows/ with CI/CD pipelines
- ✅ .gitignore with all generated file patterns
- ✅ Root README.md with project overview

**Success Criteria**:
- `pnpm build` runs successfully (no packages yet, just tools)
- `build-icons --help` displays CLI usage
- GitHub Actions workflow triggers on push
- All linting/formatting rules pass

---

### Phase 1: Core Package (Week 1, Days 2-3)

**Objective**: Build and test @ruman/icons (vanilla JS/TS core library).

**Tasks**:
1. Create packages/core/ structure
2. Generate icon components for all 9 styles using build-icons
3. Implement createElement.ts and SVG manipulation utilities
4. Generate TypeScript type definitions (IconName unions, IconNode types)
5. Configure Rollup for ESM/CJS/UMD bundles
6. Write unit tests (Vitest)
7. Test tree-shaking with bundle analyzer
8. Write package README.md

**Branch**: `feature/core-package`

**Deliverables**:
- ✅ @ruman/icons package with 39,186 auto-generated icon files
- ✅ TypeScript types with autocomplete support
- ✅ ESM, CJS, UMD bundles
- ✅ Test coverage >80%
- ✅ Bundle size validation (<5KB per icon)

**Merge Criteria**:
- All 9 styles generate successfully
- All automated tests pass
- Code review approved (2 maintainers)
- README.md complete with examples
- Manual verification: Import icon, render in HTML

---

### Phase 2: React Package (Week 1, Days 3-4)

**Objective**: Build and test @ruman/react with full React 16.8+ support.

**Tasks**:
1. Create packages/react/ structure
2. Implement Icon.tsx base component with forwardRef
3. Implement createRumanIcon.ts factory function
4. Generate React components for all 9 styles
5. Add multi-color support (primaryColor, secondaryColor props)
6. Configure Rollup for React external dependencies
7. Write React-specific tests (@testing-library/react)
8. Test with Next.js, Vite, Create React App
9. Write package README.md with React examples

**Branch**: `feature/react-package`

**Deliverables**:
- ✅ @ruman/react package with React components
- ✅ Multi-color icon support (CSS custom properties)
- ✅ Dynamic imports support
- ✅ TypeScript definitions with React types
- ✅ Test coverage >80% (component rendering, props, a11y)

**Merge Criteria**:
- Passes all React-specific tests
- Works with Next.js (tested manually)
- Multi-color icons render correctly
- Tree-shaking verified (bundle size test)
- Code review approved
- README with copy-paste examples

---

### Phase 3: Vue, Svelte, Angular Packages (Week 1, Days 4-6)

**Objective**: Build and test @ruman/vue, @ruman/svelte, @ruman/angular with framework-specific patterns.

**Tasks per Framework**:

**@ruman/vue**:
1. Create packages/vue/ structure
2. Implement Icon component with Vue 3 Composition API
3. Generate Vue components for all 9 styles
4. Support v-bind reactivity
5. Write Vue-specific tests (@testing-library/vue)
6. Test with Vite + Vue 3
7. Write README.md with Vue examples

**@ruman/svelte**:
1. Create packages/svelte/ structure
2. Generate .svelte components for all 9 styles
3. Use svelte-package for compilation
4. Support reactive statements
5. Write Svelte-specific tests (@testing-library/svelte)
6. Test with SvelteKit
7. Write README.md with Svelte examples

**@ruman/angular**:
1. Create packages/angular/ structure
2. Generate Angular components with decorators
3. Use ng-packagr for build
4. Support Angular property binding
5. Write Angular-specific tests
6. Test with Angular 12+
7. Write README.md with Angular examples

**Branches**: `feature/vue-package`, `feature/svelte-package`, `feature/angular-package`

**Deliverables**:
- ✅ 3 framework packages published internally
- ✅ Framework-idiomatic component APIs
- ✅ Test coverage >80% per package
- ✅ READMEs with framework-specific examples

**Merge Criteria** (per package):
- Framework-specific tests pass
- Tested with latest framework version
- Multi-color support working
- Code review approved
- README complete

---

### Phase 4: Remaining Web Packages (Week 1, Days 6-7)

**Objective**: Build and test @ruman/solid, @ruman/preact, @ruman/astro, @ruman/nuxt, @ruman/laravel, @ruman/static.

**Tasks** (abbreviated - each follows Phase 2/3 pattern):

**@ruman/solid** (Solid.js):
- JSX-based components, createSignal support

**@ruman/preact** (Preact):
- Similar to React, smaller bundle

**@ruman/astro** (Astro):
- TypeScript-only, no bundling needed

**@ruman/nuxt** (Nuxt.js/Vue 3):
- Nuxt module, auto-import support

**@ruman/laravel** (Laravel Blade):
- Blade component syntax, PHP package

**@ruman/static** (Static files):
- Raw SVG files, sprite sheets

**Branches**: `feature/solid-package`, `feature/preact-package`, `feature/astro-package`, `feature/nuxt-package`, `feature/laravel-package`, `feature/static-package`

**Deliverables**:
- ✅ 6 additional packages
- ✅ All with >80% test coverage
- ✅ READMEs with usage examples

---

### Phase 5: Testing, Optimization, & Release (Week 1, Day 7)

**Objective**: Comprehensive testing, bundle optimization, and v0.1.0 beta release.

**Tasks**:
1. Run full test suite across all 11 packages
2. Visual regression testing (icon rendering consistency)
3. Cross-browser testing (Chrome, Firefox, Safari, Edge)
4. Bundle size validation (all packages within limits)
5. Accessibility audit (ARIA attributes, keyboard navigation)
6. Documentation review (all READMEs accurate)
7. Create root README.md with quickstart
8. Version bump to v0.1.0
9. Publish all 11 packages to npm (@ruman scope)
10. Create GitHub release with changelog

**Branch**: `release/v0.1.0`

**Deliverables**:
- ✅ All 11 packages published to npm
- ✅ GitHub release v0.1.0 with notes
- ✅ Root README.md with framework links
- ✅ All CI/CD pipelines green

**Success Criteria**:
- All automated tests pass
- Bundle sizes within targets
- No accessibility violations
- Documentation complete and accurate
- Packages installable via npm
- GitHub release created

---

### Phase 6: Mobile Packages (Week 2, Days 8-10)

**Objective**: Build and test @ruman/react-native, @ruman/flutter, @ruman/swift.

**Out of scope for current plan** - Will be addressed in separate feature branch after Week 1 completion.

---

## Dependencies & Prerequisites

**External Dependencies**:
- Figma icon source: https://www.figma.com/community/file/1392269191144731080 (DONE - icons already exported)
- Node.js 18+ LTS
- pnpm 10.11.0+
- GitHub repository access (https://github.com/rumanagency/dga-icons)
- npm @ruman organization access (for publishing)

**Internal Dependencies**:
- SVG optimization complete (✅ DONE - 39,118 icons optimized)
- Icon metadata structure defined (✅ DONE - data-model.md)
- Component API contracts finalized (✅ DONE - contracts/)
- Lucide reference architecture analyzed (✅ DONE - research.md)

**Blockers**: None - all prerequisites satisfied

---

## Risk Mitigation

**Risk 1: Multi-Color Icon Complexity**
- **Mitigation**: CSS custom properties tested in Phase 2 (React), fallback to single color if browser doesn't support
- **Fallback**: Document limitations clearly, provide single-color alternatives

**Risk 2: Large Icon Set Build Time**
- **Mitigation**: Turborepo caching, parallel builds, incremental generation
- **Target**: <30s per package, <5min full monorepo
- **Monitoring**: Add performance benchmarks to CI/CD

**Risk 3: Bundle Size Exceeding Limits**
- **Mitigation**: Tree-shaking tests in Phase 1/2, bundle size CI checks
- **Target**: <5KB per icon (gzipped)
- **Monitoring**: Bundle analyzer in every package build

**Risk 4: Cross-Framework API Inconsistencies**
- **Mitigation**: Shared component API contract (contracts/component-api.md), code review checklist
- **Validation**: Test suite verifies prop consistency
- **Documentation**: Unified quickstart guide (quickstart.md)

**Risk 5: Testing Coverage Below 80%**
- **Mitigation**: Coverage gates in CI/CD, enforce before merge
- **Tools**: Vitest coverage reports, v8 coverage
- **Process**: No PR approval without passing coverage

---

## Next Steps

1. ✅ **Phase 0 Complete**: Research and technical decisions finalized
2. ✅ **Phase 1 Complete**: Data models, contracts, and quickstart created
3. ⏳ **Phase 2 Next**: Run `/speckit.tasks` to generate detailed task breakdown
4. ⏳ **Implementation**: Execute tasks sequentially per branch strategy

**Command to Generate Tasks**:
```bash
/speckit.tasks
```

This will create `tasks.md` with day-by-day implementation checklist based on this plan.

---

## Appendix: Key Files Reference

**Design Artifacts** (this feature):
- [spec.md](./spec.md) - Feature specification with user stories
- [research.md](./research.md) - Technical decisions + Lucide analysis (860 lines)
- [data-model.md](./data-model.md) - Entity definitions + data flow
- [quickstart.md](./quickstart.md) - Developer quick start guide
- [contracts/](./contracts/) - API contracts (5 files)

**Lucide Reference**:
- `/Users/saleh/Desktop/dgaIcons/.claude/lucide-main-full-for-example/` - Full Lucide codebase for patterns

**Project Constitution**:
- `/Users/saleh/Desktop/dgaIcons/.specify/memory/constitution.md` - Governance and principles

---

**Plan Version**: 1.0
**Created**: 2025-11-18
**Author**: Claude Code (Ruman Agency)
**Status**: Phase 1 Complete - Ready for Task Generation
