# Contributing to DGA Icons

Thank you for your interest in contributing to DGA Icons! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Icon Contributions](#icon-contributions)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dga-icons.git`
3. Add upstream remote: `git remote add upstream https://github.com/rumanagency/dga-icons.git`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 22.x or later
- PNPM 10.11.0 or later

### Installation

```bash
pnpm install
pnpm build
```

### Running Tests

```bash
pnpm test
pnpm type-check
pnpm lint
```

## Project Structure

```
dga-icons/
├── packages/          # Framework-specific packages
│   ├── icons/        # Core TypeScript library
│   ├── react/        # React package
│   ├── vue/          # Vue package
│   └── ...
├── tools/            # Build tools and utilities
│   ├── build-helpers/
│   ├── build-icons/
│   └── rollup-plugins/
├── icons/            # Source SVG files (9 styles)
└── .github/          # GitHub workflows and templates
```

## Making Changes

### Branch Naming

- Feature branches: `feature/description` or `feat/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(react): add primaryColor prop for duotone icons
fix(vue): resolve tree-shaking issue in production builds
docs(readme): update installation instructions
```

### Code Style

- Follow the existing code style
- Run `pnpm lint` before committing
- Use TypeScript for new code
- Add JSDoc comments for public APIs

## Testing

### Unit Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm type-check
```

### Package-Specific Tests

```bash
pnpm test --filter=@ruman/react
```

## Submitting Changes

1. **Ensure all tests pass:**
   ```bash
   pnpm test
   pnpm type-check
   pnpm lint
   pnpm build
   ```

2. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat(scope): your message"
   ```

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request:**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template
   - Submit for review

### Pull Request Guidelines

- **Title**: Use conventional commit format
- **Description**: Explain what and why (not how)
- **Tests**: Include tests for new features
- **Documentation**: Update docs if needed
- **Changesets**: Add changeset for version bump

## Icon Contributions

### Adding New Icons

Icon designs come from HugeIcons and are distributed by the Saudi Digital Government Authority. We do not accept custom icon designs.

However, you can contribute by:
- Reporting missing icons from the HugeIcons set
- Fixing SVG optimization issues
- Improving icon metadata and categorization

### Icon Metadata

Icons are organized with metadata in `icons/metadata.json`. When adding metadata:

```json
{
  "icon-name": {
    "categories": ["Category1", "Category2"],
    "tags": ["tag1", "tag2", "tag3"],
    "multiColor": true,
    "colorCount": 2
  }
}
```

## Questions?

- Open an issue for bug reports or feature requests
- Start a discussion for questions or ideas
- Check existing issues and discussions first

## Attribution

When contributing, please note:

- Icon designs: HugeIcons (https://hugeicons.com)
- Distributed by: Saudi Digital Government Authority (https://dga.gov.sa)
- Library development: Ruman Agency (https://ruman.sa)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to DGA Icons!
