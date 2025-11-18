# DGA Icons - API Contracts

**Status**: Draft
**Created**: 2025-11-18
**Version**: 1.0.0

## Overview

This directory contains the formal API contracts for the DGA Icons library. These contracts define the public interfaces, data structures, and behaviors that all framework packages and build tools must adhere to.

## Contract Files

### 1. Component API Contract (`component-api.md`)
**Lines**: 844 | **Size**: ~20KB

Defines the unified icon component API across all framework packages.

**Key Sections**:
- Common Props Interface (size, color, strokeWidth, primaryColor, secondaryColor)
- TypeScript Type Definitions
- Framework-Specific Implementations (React, Vue, Svelte, Angular)
- Color Customization Behavior (single-color vs multi-color)
- Stroke Width Behavior (absolute vs relative)
- Error Handling & Browser Compatibility
- Accessibility Guidelines
- Performance Considerations

**Primary Audience**: Framework package developers, library consumers

**Usage**:
```typescript
// React example from contract
import { Home } from '@ruman/react/icons/stroke-rounded';

<Home
  size={24}
  primaryColor="#3B82F6"
  secondaryColor="#93C5FD"
/>
```

---

### 2. Package Exports Contract (`package-exports.md`)
**Lines**: 742 | **Size**: ~19KB

Defines the standard export structure for all framework packages.

**Key Sections**:
- Package Structure & Layout
- Package.json Configuration (exports, peer dependencies)
- Import Paths & Usage Patterns
- Module Formats (ESM, CJS, UMD)
- TypeScript Definitions
- Tree-Shaking Configuration
- CDN Hosting (jsDelivr, unpkg)
- Versioning & Compatibility
- Bundle Size Targets

**Primary Audience**: Package maintainers, build engineers

**Usage**:
```json
// package.json exports structure
{
  "exports": {
    "./icons/stroke-rounded": {
      "types": "./dist/types/icons/stroke-rounded/index.d.ts",
      "import": "./dist/esm/icons/stroke-rounded/index.js",
      "require": "./dist/cjs/icons/stroke-rounded/index.js"
    }
  }
}
```

---

### 3. Build API Contract (`build-api.md`)
**Lines**: 842 | **Size**: ~21KB

Defines the CLI tool and build pipeline for generating framework-specific components.

**Key Sections**:
- CLI Tool Options & Arguments
- Template System (React, Vue, Svelte, Angular templates)
- SVG Processing Pipeline (8 stages)
- Icon Metadata Schema Integration
- Performance Targets (4,300 icons in <30s)
- Error Handling & Codes
- Testing Strategy
- Programmatic API

**Primary Audience**: Build tool developers, CI/CD engineers

**Usage**:
```bash
# CLI usage from contract
build-icons \
  --output ./packages/react/src/icons/stroke-rounded \
  --template ./packages/react/scripts/exportTemplate.mts \
  --icons-dir ./icons/stroke-rounded \
  --style stroke-rounded \
  --extension .tsx
```

---

### 4. Metadata Schema (`metadata-schema.json`)
**Lines**: 488 | **Size**: ~15KB

JSON Schema defining the structure for icon metadata files.

**Key Properties**:
- Icon identification (name, displayName)
- Categorization (categories, tags, aliases)
- Style availability (9 styles boolean flags)
- Deprecation tracking
- Source attribution (designer, license, Figma URL)
- Accessibility metadata (ARIA labels, semantic meaning)
- Usage guidelines (common contexts, do-not-use)
- Analytics metrics (popularity, search/download counts)

**Primary Audience**: Metadata generators, documentation builders

**Example**:
```json
{
  "name": "home",
  "displayName": "Home",
  "categories": ["Navigation", "Interface"],
  "tags": ["house", "main", "homepage", "dashboard"],
  "styles": {
    "stroke-rounded": true,
    "solid-rounded": true,
    "duotone-rounded": true
  },
  "multiColor": false,
  "version": "0.1.0"
}
```

---

## Contract Relationships

```
┌─────────────────────────────────────────────────────────┐
│                   Icon Developer Flow                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │   SVG Files (39,000+ icons)      │
         │   + metadata-schema.json (meta)  │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │   build-api.md (build-icons)     │
         │   - Validates SVGs               │
         │   - Transforms multi-color       │
         │   - Generates components         │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │   package-exports.md             │
         │   - ESM/CJS/UMD builds           │
         │   - TypeScript definitions       │
         │   - Tree-shaking setup           │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │   component-api.md               │
         │   - Framework components         │
         │   - Props interface              │
         │   - User-facing API              │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │   Library Consumers              │
         │   (React, Vue, Svelte, etc.)     │
         └──────────────────────────────────┘
```

---

## Contract Compliance

### For Framework Package Developers

When creating a new framework package (e.g., `@ruman/solid`, `@ruman/preact`):

1. **Read `component-api.md`** - Implement all required props
2. **Read `package-exports.md`** - Set up correct package structure
3. **Create template** following `build-api.md` examples
4. **Use `metadata-schema.json`** for icon metadata validation
5. **Run compliance checklist** at end of each contract document

### For Build Tool Maintainers

When modifying `@ruman/build-icons`:

1. **Read `build-api.md`** - Understand CLI options and pipeline
2. **Validate against `metadata-schema.json`** - Ensure metadata parsing works
3. **Test template rendering** for all frameworks
4. **Verify performance targets** (4,300 icons in <30s)
5. **Update error codes** if adding new validation rules

### For Library Consumers

When using DGA Icons in your application:

1. **Read `component-api.md`** - Understand props and usage patterns
2. **Check framework-specific examples** in each contract
3. **Review error handling** for troubleshooting
4. **Follow accessibility guidelines** for ARIA attributes
5. **Reference bundle size targets** for performance optimization

---

## Versioning

All contracts follow semantic versioning:

- **MAJOR** (e.g., 1.x.x → 2.x.x): Breaking API changes
- **MINOR** (e.g., 1.1.x → 1.2.x): New features, backward-compatible
- **PATCH** (e.g., 1.1.1 → 1.1.2): Bug fixes, clarifications

**Current Version**: 1.0.0 (Draft)

**Next Review**: After Phase 1 implementation (Week 1 completion)

---

## Document Status

| Contract | Status | Last Updated | Review Required |
|----------|--------|--------------|-----------------|
| component-api.md | Draft | 2025-11-18 | After Phase 1 |
| package-exports.md | Draft | 2025-11-18 | After Phase 1 |
| build-api.md | Draft | 2025-11-18 | After Phase 1 |
| metadata-schema.json | Draft | 2025-11-18 | After Phase 1 |

---

## Validation Tools

### JSON Schema Validation

Validate icon metadata files:

```bash
# Install AJV CLI
npm install -g ajv-cli

# Validate a metadata file
ajv validate \
  -s contracts/metadata-schema.json \
  -d icons/stroke-rounded/home.json
```

### Contract Linting

Check for contract compliance:

```bash
# Run contract compliance tests
pnpm test:contracts

# Check specific package
pnpm test:contracts --package react

# Dry-run to see violations
pnpm test:contracts --dry-run
```

### TypeScript Type Checking

Verify type definitions match contracts:

```bash
# Check types across all packages
pnpm typecheck

# Check specific package
pnpm --filter @ruman/react typecheck
```

---

## Contributing

### Proposing Contract Changes

1. **Create GitHub Issue** with label `contract-change`
2. **Describe change rationale** and impact analysis
3. **Get approval** from maintainers (breaking changes require RFC)
4. **Update contract document** with version bump
5. **Update all affected packages** to comply
6. **Run compliance tests** to verify changes

### Contract Change Template

```markdown
## Contract Change Proposal

**Contract**: component-api.md
**Type**: Breaking / Non-breaking
**Version**: 1.0.0 → 2.0.0

**Motivation**:
Why is this change needed?

**Proposed Changes**:
- Add new prop: `variant?: 'primary' | 'secondary'`
- Remove deprecated prop: `oldProp`

**Impact**:
- Affects: 12 packages
- Migration: Automatic codemod available
- Timeline: 2 weeks for all packages

**Alternatives Considered**:
1. Option A: ...
2. Option B: ...
```

---

## References

**Related Documents**:
- [Feature Specification](../spec.md)
- [Research Findings](../research.md)
- [Implementation Plan](../plan.md)
- [Task List](../tasks.md)

**External Resources**:
- [Lucide Icons (Reference)](https://github.com/lucide-icons/lucide)
- [JSON Schema Specification](https://json-schema.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

**Project Links**:
- [GitHub Repository](https://github.com/rumanagency/dga-icons)
- [NPM Organization](https://www.npmjs.com/org/ruman)
- [Figma Source](https://www.figma.com/community/file/1392269191144731080)

---

## FAQ

### Q: Why are contracts separate from implementation?

**A**: Contracts define "what" (interface, behavior), implementation defines "how" (code). This separation allows:
- Multiple implementations (React, Vue, etc.) sharing same contract
- Testing implementation against contract
- Evolving implementation without breaking API
- Clear documentation for consumers

### Q: Can I extend the component API with custom props?

**A**: Yes, but only non-breaking additions. Framework-specific props (e.g., React's `ref`) are allowed. Core props (size, color, etc.) must remain consistent.

### Q: How do I validate my package complies with contracts?

**A**: Run `pnpm test:contracts --package your-package`. This runs automated compliance tests against all 4 contracts.

### Q: What if I find an error in a contract?

**A**: Create a GitHub issue with label `contract-error`. If it's a typo/clarification, we'll patch it. If it's a design flaw, we'll create an RFC for a breaking change.

### Q: Do contracts apply to experimental packages?

**A**: Experimental packages (e.g., `@ruman/experimental-xyz`) are exempt from strict contract compliance, but should follow contracts as guidelines.

---

**Maintainer**: Ruman Agency Development Team
**Contact**: hello@ruman.sa
**Last Updated**: 2025-11-18
