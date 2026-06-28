/**
 * Utility helpers for DGA Icons code generation.
 * Handles naming conventions, file paths, and common operations.
 */

/**
 * Convert kebab-case icon name to PascalCase component name.
 * Handles edge cases: numbers at start, special characters.
 *
 * Examples:
 *   "home-01"         → "Home01"
 *   "arrow-down-01"   → "ArrowDown01"
 *   "3d-rotate"       → "Icon3dRotate"
 *   "c++"             → "IconCPlusPlus"
 *   "re:"             → "IconRe"
 *   "4k"              → "Icon4k"
 */
export function toPascalCase(kebab) {
  // Handle special characters first
  let cleaned = kebab
    .replace(/\+\+/g, '-plus-plus')
    .replace(/\+/g, '-plus')
    .replace(/:/g, '')
    .replace(/\./g, '-dot-')
    .replace(/#/g, '-hash-')
    .replace(/@/g, '-at-');

  // Split by hyphens and capitalize each part
  const parts = cleaned.split('-').filter(Boolean);

  let result = parts
    .map((part) => {
      // Keep numbers as-is, capitalize letters
      if (/^\d/.test(part)) {
        // Starts with number — keep as-is
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');

  // If result starts with a digit, prefix with "Icon"
  if (/^\d/.test(result)) {
    result = 'Icon' + result;
  }

  // If result is empty somehow, fallback
  if (!result) {
    result = 'IconUnknown';
  }

  return result;
}

/**
 * Convert PascalCase back to kebab-case (for CSS classes, file references).
 */
export function toKebabCase(pascal) {
  return pascal
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Get all style directory names.
 */
export const ALL_STYLES = [
  'stroke-rounded',
  'solid-rounded',
  'bulk-rounded',
  'duotone-rounded',
  'twotone-rounded',
  'solid-sharp',
  'solid-standard',
  'stroke-sharp',
  'stroke-standard',
];

export const DEFAULT_STYLE = 'stroke-rounded';

/**
 * Check if a name is a valid JavaScript identifier.
 */
export function isValidIdentifier(name) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}
