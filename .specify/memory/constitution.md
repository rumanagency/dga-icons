<!--
SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles: N/A
Added sections:
  - Core Principles XI: Branch-Based Development & Merge Safety (new principle)
  - Core Principles count: 10 → 11 principles
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution Check section aligned
  ✅ .specify/templates/spec-template.md - Requirements alignment verified
  ✅ .specify/templates/tasks-template.md - Task categorization aligned
Follow-up TODOs: None
Amendment rationale: Added branch-based development principle to ensure code quality
  and prevent unstable code from reaching main branch. MINOR version bump per
  amendment rules (new principle added).
-->

# DGA Icons Constitution

## Project Vision

**DGA Icons** is a comprehensive, open-source icon library providing 39,000+ professionally designed SVG icons across 9 distinct visual styles. Inspired by lucide-icons architecture, DGA Icons enables developers across all platforms (web, mobile, desktop) to integrate high-quality, consistent iconography with minimal effort.

**Mission**: Democratize access to professional iconography by providing a free, open-source, multi-platform icon library that serves developers from hobbyists to enterprise teams.

**Core Values**:
- **Universal Access**: Free and open for all uses (personal, commercial, enterprise)
- **Platform Agnostic**: Native support for every major framework and platform
- **Quality First**: Every icon optimized, accessible, and production-ready
- **Developer Experience**: Intuitive APIs, excellent documentation, zero friction
- **Community Driven**: Transparent governance, open contributions, responsive maintenance

## Core Principles

### I. Monorepo-First Architecture

**Rule**: All icon styles, packages, and build tools MUST reside in a single monorepo.

- Single source of truth for all 39,000+ icons across 9 visual styles
- Shared build infrastructure, utilities, and tooling
- Atomic version synchronization across all published packages
- Unified testing, linting, and CI/CD pipelines
- Centralized icon metadata and naming conventions

**Rationale**: Monorepo architecture ensures consistency across styles, simplifies maintenance, enables atomic updates, and reduces tooling duplication. This approach follows proven patterns from Lucide Icons and other successful icon libraries.

### II. Style Parity (NON-NEGOTIABLE)

**Rule**: Every icon name MUST exist across all 9 visual styles with identical naming.

The 9 visual styles are:
1. `bulk-rounded` (4,354 icons)
2. `duotone-rounded` (4,354 icons)
3. `solid-rounded` (4,354 icons)
4. `solid-sharp` (4,353 icons)
5. `solid-standard` (4,320 icons)
6. `stroke-rounded` (4,354 icons)
7. `stroke-sharp` (4,353 icons)
8. `stroke-standard` (4,322 icons)
9. `twotone-rounded` (4,354 icons)

- New icon additions MUST include all 9 style variants
- Icon removals MUST be performed across all 9 styles simultaneously
- Naming convention: `kebab-case` (e.g., `home-icon`, `user-profile`)
- No style-specific icon names (icon identity is style-agnostic)

**Rationale**: Style parity guarantees developers can switch between visual styles without code changes, providing maximum flexibility without API disruption.

### III. Framework-Agnostic Core

**Rule**: Icon data and core utilities MUST be framework-independent.

- Core package (`@ruman/icons`) contains only SVG data and vanilla JS/TS utilities
- Framework packages (`@ruman/react`, `@ruman/vue`, etc.) are thin wrappers around core
- All icon transformations, optimizations, and metadata generation happen at build time
- No runtime framework dependencies in core package
- Framework packages depend on core, never the reverse

**Rationale**: Framework-agnostic core ensures longevity, enables framework migrations, reduces bundle sizes, and simplifies testing. Framework-specific packages can evolve independently without affecting core icon data.

### IV. Package Per Framework Strategy

**Rule**: Each major framework/platform MUST have a dedicated, idiomatic package.

**Mandatory Packages**:
- `@ruman/icons` - Core SVG files, TypeScript utilities, metadata
- `@ruman/react` - React components with hooks support
- `@ruman/vue` - Vue 3 components with Composition API
- `@ruman/angular` - Angular components with proper DI
- `@ruman/svelte` - Svelte components
- `@ruman/solid` - Solid.js components
- `@ruman/preact` - Preact components
- `@ruman/astro` - Astro components
- `@ruman/nuxt` - Nuxt.js module
- `@ruman/react-native` - React Native components (SVG-based)
- `@ruman/laravel` - Laravel Blade components
- `@ruman/static` - Optimized static SVG files
- `@ruman/webfont` - Web font versions with CSS

**Optional/Future Packages**:
- `@ruman/flutter` - Flutter/Dart icon widgets
- `@ruman/swift` - SwiftUI components
- `@ruman/android` - Android Compose components

Each package MUST:
- Follow framework conventions and best practices
- Support all 9 visual styles
- Provide TypeScript definitions
- Include framework-specific documentation
- Support tree-shaking for optimal bundle size

**Rationale**: Framework-specific packages deliver idiomatic developer experiences, ensure proper integration with framework ecosystems, and enable optimizations specific to each platform.

### V. SVG Optimization & Validation (NON-NEGOTIABLE)

**Rule**: Every SVG MUST be optimized and validated before inclusion.

**Mandatory Optimizations**:
- SVGO processing with project-specific configuration
- Removal of unnecessary metadata, comments, and editor artifacts
- Path simplification and decimal precision reduction
- Attribute cleanup (remove default values, redundant attributes)
- Consistent viewBox dimensions (0 0 24 24 standard)
- Color normalization (`currentColor` for stroke/fill inheritance)

**Validation Requirements**:
- Valid XML/SVG structure
- No embedded scripts or external references
- No raster images (PNG, JPG) embedded
- Accessibility attributes (proper `aria-label`, `role`)
- Maximum file size: 5KB per icon (optimized)
- Support for both fill and stroke customization where applicable

**Build-Time Checks**:
- Automated SVG linting in CI/CD
- Icon count validation across all 9 styles
- Duplicate icon detection
- Naming convention enforcement
- ViewBox consistency verification

**Rationale**: Optimized SVGs reduce bundle sizes, improve rendering performance, and ensure consistent behavior across browsers. Validation prevents broken icons, security issues, and accessibility problems.

### VI. Multi-Color Icon Support

**Rule**: Duotone, twotone, and bulk styles MUST support independent color customization.

**Implementation Requirements**:
- `primaryColor` prop for main icon elements
- `secondaryColor` prop for accent/background elements
- CSS custom properties for style-based theming
- Default to `currentColor` inheritance when colors not specified
- Preserve original multi-color structure in source SVGs

**Supported Styles**:
- `duotone-rounded` - Two distinct color regions
- `twotone-rounded` - Primary with semi-transparent secondary
- `bulk-rounded` - Filled areas with accent overlays

**API Example**:
```tsx
<Home primaryColor="#3B82F6" secondaryColor="#93C5FD" />
```

**Rationale**: Multi-color support enables rich visual hierarchies, brand color integration, and semantic color coding while maintaining single-icon simplicity.

### VII. Type Safety & Developer Experience

**Rule**: All packages MUST provide complete TypeScript definitions with strict typing.

**Type Safety Requirements**:
- Exported icon name types (string literals union)
- Component prop interfaces with JSDoc documentation
- Generic types for framework-specific extensions
- Strict null checking compatibility
- No `any` types in public APIs

**Developer Experience Requirements**:
- IntelliSense support for icon names across all IDEs
- Autocomplete for icon props and style variants
- Runtime prop validation in development mode
- Clear error messages for invalid icons or props
- Tree-shaking support (import only used icons)

**Documentation Standards**:
- README per package with quickstart examples
- API reference with all props documented
- Migration guides between versions
- Framework-specific best practices
- Troubleshooting guides

**Rationale**: TypeScript provides compile-time safety, improves IDE experience, catches errors early, and serves as living documentation. Excellent DX reduces friction and accelerates adoption.

### VIII. Tree-Shaking & Bundle Optimization

**Rule**: All packages MUST support tree-shaking to minimize production bundle sizes.

**Build Output Requirements**:
- ES modules format for tree-shaking
- CommonJS format for legacy compatibility
- UMD bundle for CDN usage
- Individual icon files for direct imports
- Side-effect free package.json declaration

**Import Strategies**:
```typescript
// Named imports (tree-shakeable)
import { Home, Settings } from '@ruman/react/icons/stroke-rounded';

// Direct imports (guaranteed tree-shaking)
import Home from '@ruman/react/icons/stroke-rounded/Home';

// Style-specific barrel exports
import * as StrokeRounded from '@ruman/react/icons/stroke-rounded';
```

**Bundle Size Targets**:
- Single icon: <5KB (optimized, gzipped)
- 10 icons: <30KB (optimized, gzipped)
- Full package: Must support partial imports
- Zero-icon cost: If no icons imported, zero bytes added

**Rationale**: Tree-shaking ensures developers pay only for icons they use, dramatically reducing production bundle sizes and improving page load performance.

### IX. Automated Testing & Quality Gates

**Rule**: All changes MUST pass comprehensive automated tests before merge.

**Test Coverage Requirements** (>80% target):
- **Unit Tests**: Component rendering, prop validation, edge cases
- **Integration Tests**: Framework integration, build output validation
- **Visual Regression Tests**: Icon rendering consistency across updates
- **Bundle Size Tests**: Detect unexpected size increases
- **Accessibility Tests**: ARIA attributes, semantic HTML, keyboard navigation
- **Cross-Browser Tests**: Chrome, Firefox, Safari, Edge compatibility

**CI/CD Quality Gates**:
- All tests passing (no exceptions)
- Linting passes (ESLint, Prettier)
- Type checking passes (TypeScript strict mode)
- Bundle size within limits
- No new accessibility violations
- Documentation builds successfully

**Manual Review Requirements**:
- New icon additions: Design consistency review
- Breaking changes: Migration guide required
- Architecture changes: Constitution compliance check

**Rationale**: Automated testing catches regressions early, ensures consistent quality, enables confident refactoring, and maintains project stability as scale increases.

### X. Semantic Versioning & Breaking Change Policy

**Rule**: All packages MUST follow strict semantic versioning (MAJOR.MINOR.PATCH).

**Version Bump Criteria**:
- **MAJOR**: Breaking API changes, icon removals, minimum framework version increases
- **MINOR**: New icons added, new framework packages, backward-compatible features
- **PATCH**: Bug fixes, performance improvements, documentation updates, icon optimizations

**Breaking Change Process**:
1. Announce breaking change in GitHub Discussions (minimum 2 weeks notice)
2. Create migration guide documenting all changes and upgrade paths
3. Provide automated migration tooling where feasible (codemods, scripts)
4. Update CHANGELOG.md with detailed breaking change notes
5. Increment MAJOR version for all affected packages

**Deprecation Policy**:
- Features deprecated MUST remain functional for 1 MAJOR version
- Deprecation warnings logged in development mode
- Deprecation documented in CHANGELOG and migration guide
- Removal only in subsequent MAJOR version

**Version Synchronization**:
- All framework packages share same MAJOR.MINOR version
- PATCH versions may differ for framework-specific fixes
- Core package version drives overall library versioning

**Rationale**: Semantic versioning provides predictable upgrade paths, prevents unexpected breakage, and enables automated dependency updates. Clear deprecation policy gives users time to migrate.

### XI. Branch-Based Development & Merge Safety (NON-NEGOTIABLE)

**Rule**: All major work MUST be developed in dedicated feature branches and merged only after verification.

**Branching Requirements**:
- Create a new branch for every significant feature, bug fix, or package update
- Branch naming convention: `{type}/{short-description}` (e.g., `feature/react-package`, `fix/svg-optimization`, `release/v1.2.0`)
- Main branch (`main` or `master`) MUST always remain stable and deployable
- No direct commits to main branch (except emergency hotfixes with proper approval)

**Branch Types**:
- `feature/*` - New features, packages, or capabilities
- `fix/*` - Bug fixes and error corrections
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring without behavior changes
- `test/*` - Test additions or improvements
- `release/*` - Release preparation branches
- `hotfix/*` - Emergency production fixes

**Merge Criteria** (ALL must be satisfied):
1. **All automated tests passing** - No exceptions, all CI/CD checks green
2. **Code review approved** - Minimum 1 maintainer approval (2 for architecture changes)
3. **Build succeeds** - All packages build without errors or warnings
4. **Documentation updated** - README, CHANGELOG, API docs reflect changes
5. **Manual verification** - Feature tested locally and works as expected
6. **No merge conflicts** - Branch must be up-to-date with main
7. **Constitution compliance** - Changes align with all core principles

**Merge Process**:
1. Push feature branch to remote repository
2. Open Pull Request with clear description and rationale
3. Automated CI/CD checks run (tests, linting, build, bundle size)
4. Request review from maintainer(s)
5. Address review feedback and update PR
6. Ensure all merge criteria satisfied
7. Maintainer performs merge (squash merge preferred for clean history)
8. Delete feature branch after successful merge

**Protection Rules**:
- Main branch MUST have branch protection enabled
- Require status checks to pass before merging
- Require pull request reviews before merging
- Dismiss stale pull request approvals when new commits pushed
- Require linear history (squash or rebase merge)

**Exceptions**:
- Emergency hotfixes: Streamlined review process (1 maintainer approval, critical tests only)
- Documentation typos: Can use fast-track review for minor fixes
- Automated bot commits: Dependabot, version bumps (pre-approved automation only)

**Rationale**: Branch-based development isolates work-in-progress from stable code, enables parallel development, facilitates code review, and ensures main branch reliability. This practice prevents breaking changes from impacting users and maintains project stability.

## Technical Architecture Standards

### Source Management

**Directory Structure**:
```
/icons/{style-name}/{icon-name}.svg
```

Example:
```
/icons/stroke-rounded/home.svg
/icons/solid-rounded/home.svg
/icons/duotone-rounded/home.svg
```

**Naming Conventions**:
- Icon files: `kebab-case` (e.g., `user-profile.svg`)
- Component names: `PascalCase` (e.g., `<UserProfile />`)
- Package names: `@ruman/{framework}` (all lowercase)
- Style identifiers: `kebab-case` (e.g., `stroke-rounded`)

**Metadata System**:
- `icons/metadata.json`: Centralized icon catalog
- Per-icon metadata: name, tags, categories, aliases, style availability
- Automated metadata generation from SVG files
- Search index built at build time

**Metadata Example**:
```json
{
  "home": {
    "name": "home",
    "categories": ["Buildings", "Navigation"],
    "tags": ["house", "main", "homepage", "dashboard"],
    "aliases": ["house", "residence"],
    "styles": ["bulk-rounded", "duotone-rounded", "solid-rounded", ...]
  }
}
```

### Build System Architecture

**Build Tools**:
- **Bundler**: Rollup or Vite for package builds
- **Monorepo**: Turborepo or Nx for parallel builds and caching
- **Package Manager**: pnpm for efficient disk usage and fast installs
- **TypeScript**: Latest stable version with strict mode
- **Testing**: Vitest for unit tests, Playwright for E2E/visual tests

**Build Pipeline**:
1. **SVG Optimization**: SVGO processing, validation
2. **Metadata Generation**: Extract icon data, build search index
3. **Component Generation**: Create framework-specific components from SVGs
4. **Type Generation**: Generate TypeScript definitions
5. **Bundle Creation**: ES modules, CommonJS, UMD outputs
6. **Testing**: Run all test suites
7. **Documentation**: Build API docs and examples
8. **Publishing**: Version bumping, changelog, npm publish

**Build Performance Targets**:
- Full monorepo build: <5 minutes
- Single package build: <30 seconds
- Watch mode rebuild: <2 seconds
- Test execution: <2 minutes

### Package Structure Standards

Each package MUST include:
- `package.json` with proper exports, types, dependencies
- `README.md` with installation, usage, API reference
- `CHANGELOG.md` following Keep a Changelog format
- `LICENSE` file (MIT license)
- `dist/` directory with build outputs (ES, CJS, UMD)
- `types/` directory with TypeScript definitions
- `src/` directory with source code (published for source maps)

**Package.json Requirements**:
```json
{
  "name": "@ruman/{framework}",
  "version": "X.Y.Z",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./types/index.d.ts"
    },
    "./icons/*": {
      "import": "./dist/icons/*.mjs",
      "require": "./dist/icons/*.cjs",
      "types": "./types/icons/*.d.ts"
    }
  },
  "sideEffects": false,
  "license": "MIT"
}
```

## Quality & Performance Standards

### Performance Benchmarks

**Bundle Size Limits**:
- Single icon component: <5KB (optimized, gzipped)
- Core package (all icons): <500KB (optimized, gzipped)
- Framework wrapper overhead: <10KB per package
- Tree-shaken single icon import: <3KB

**Runtime Performance**:
- Icon render time: <16ms (60fps target)
- Icon switching (React): <8ms (no unnecessary re-renders)
- Initial package load: <100ms on 3G connection

**Build Performance**:
- SVG optimization: <10 seconds for all 39,000+ icons
- Single package build: <30 seconds
- Full monorepo build: <5 minutes
- Incremental rebuild: <2 seconds

### Accessibility Requirements

**ARIA Standards**:
- Decorative icons: `aria-hidden="true"` and `role="img"`
- Semantic icons: `aria-label` with descriptive text
- Interactive icons: Proper `role` and keyboard support
- Focus indicators: Visible focus states for interactive icons

**HTML Semantics**:
- Use semantic HTML elements where applicable
- Proper heading hierarchy in documentation
- Landmarks for major sections
- Skip links for keyboard navigation

**Testing Requirements**:
- Automated a11y testing with axe-core
- Manual testing with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing
- Color contrast validation (WCAG AA minimum)

### Browser & Platform Compatibility

**Browser Support**:
- Chrome: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Edge: Last 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

**Framework Version Support**:
- React: 16.8+ (Hooks), 17.x, 18.x
- Vue: 3.x (Composition API)
- Angular: 12+
- Svelte: 3.x, 4.x
- Others: Latest stable major version

**Node.js Requirements**:
- Build tools: Node.js 18+ (LTS)
- Package consumption: No Node.js requirement (browser-only packages)

## Development Workflow & Processes

### Contribution Process

**New Icon Submissions**:
1. Open issue using "New Icon Request" template
2. Community voting on icon requests (👍 reactions)
3. Design review by maintainers (consistency, quality)
4. Create all 9 style variants
5. Optimize SVGs using project SVGO config
6. Run validation scripts
7. Open PR with all 9 variants
8. Automated tests pass
9. Manual design review
10. Merge and include in next MINOR release

**Code Contributions**:
1. Fork repository and create feature branch
2. Make changes following code style guide
3. Write/update tests (maintain >80% coverage)
4. Update documentation
5. Run `pnpm test` and `pnpm lint` locally
6. Open PR using provided template
7. Address review feedback
8. Automated CI/CD checks pass
9. Maintainer review and approval
10. Merge to main branch

**Issue Reporting**:
- Use issue templates (bug report, feature request, icon request)
- Search existing issues before creating new ones
- Provide reproduction steps for bugs
- Include environment details (browser, framework version, package version)

### Release Process

**Release Cadence**:
- PATCH releases: As needed for critical bugs (within 48 hours)
- MINOR releases: Monthly (first Monday of each month)
- MAJOR releases: Annually or when breaking changes accumulated

**Release Checklist**:
1. Run full test suite across all packages
2. Update CHANGELOG.md for all modified packages
3. Bump versions using changesets
4. Create Git tags for release
5. Build all packages in production mode
6. Publish to npm registry (@ruman scope)
7. Create GitHub release with notes
8. Update documentation website
9. Announce release (GitHub Discussions, Twitter, Discord)

**Hotfix Process**:
1. Create hotfix branch from latest release tag
2. Apply minimal fix
3. Test thoroughly
4. Increment PATCH version
5. Publish hotfix release
6. Backport fix to main branch

### Versioning Strategy

**Changesets Workflow**:
- All PRs MUST include changeset file
- Changesets describe changes and version bump type
- Automated version bumping and changelog generation
- Synchronized versions across related packages

**Pre-release Versions**:
- `alpha`: Experimental features, API unstable
- `beta`: Feature complete, API stable, testing phase
- `rc`: Release candidate, final testing before stable

**Version Synchronization**:
- Core and all framework packages share MAJOR.MINOR version
- PATCH versions may differ for framework-specific fixes
- Breaking changes bump MAJOR for all affected packages

## Governance

### Amendment Process

This constitution is the authoritative source of truth for project governance, architecture decisions, and development standards.

**Amendment Procedure**:
1. Propose amendment via GitHub Discussion with rationale
2. Community discussion period (minimum 2 weeks)
3. Maintainer review and feedback
4. Formal vote by core maintainers (majority approval required)
5. Update constitution with new version number
6. Document changes in constitution change log
7. Update all affected templates, documentation, and tooling
8. Announce amendment in release notes and community channels

**Amendment Version Bumping**:
- **MAJOR**: Fundamental principle changes, removed principles, backward-incompatible governance changes
- **MINOR**: New principles added, expanded guidance, new sections
- **PATCH**: Clarifications, typo fixes, non-semantic refinements, formatting improvements

### Compliance & Review

**Constitution Compliance**:
- All PRs MUST be reviewed for constitution compliance
- Architecture Decision Records (ADRs) MUST reference relevant principles
- Breaking changes MUST justify any principle violations
- New features MUST align with core principles

**Review Gates**:
- Code review: 1 maintainer approval required
- Architecture changes: 2 maintainer approvals required
- Breaking changes: Community discussion + 2 maintainer approvals
- Constitution amendments: Community discussion + majority maintainer vote

**Enforcement**:
- Automated checks for technical standards (linting, testing, bundle size)
- Manual review for design decisions and architecture alignment
- Community reporting of violations via GitHub issues
- Maintainer discretion for edge cases and exceptional circumstances

### Project Maintenance

**Maintainer Responsibilities**:
- Review and merge PRs in timely manner (<7 days for non-trivial PRs)
- Respond to issues and discussions (<48 hours for critical bugs)
- Participate in architecture decisions and governance discussions
- Maintain project infrastructure (CI/CD, documentation website, npm packages)
- Foster welcoming and inclusive community

**Long-term Support**:
- Current MAJOR version: Full support (features, bugs, security)
- Previous MAJOR version: Security fixes only (12 months)
- Older versions: Community support only (no official patches)

**Deprecation & Sunset**:
- Framework packages deprecated when framework EOL announced
- 6-month notice period before package deprecation
- Security updates continue for 12 months post-deprecation
- Clear migration path provided to alternative packages

### Runtime Development Guidance

For day-to-day development guidance, reference materials, and detailed technical specifications, consult:

- **Primary Reference**: `.claude/CLAUDE.md` - Comprehensive development guide
- **Architecture Decisions**: `docs/architecture/` - ADRs and design documents
- **API Documentation**: `docs/api/` - Detailed API references per package
- **Contributing Guide**: `CONTRIBUTING.md` - Step-by-step contribution instructions

This constitution establishes the "why" and "what"; the guidance files provide the "how".

**Version**: 1.1.0 | **Ratified**: 2025-11-17 | **Last Amended**: 2025-11-17
