/**
 * SVG Parser for DGA Icons.
 * Parses SVG files into IconNode arrays — the intermediate representation
 * used by @dga-icons/core.
 *
 * An IconNode is: Array<[tagName, attributes]>
 * Example: [["path", { d: "M1 2...", fill: "currentColor" }]]
 */

import { readFile } from 'fs/promises';

/**
 * Parse an SVG file into an IconNode array.
 * Extracts child elements of the root <svg> and their attributes.
 *
 * @param {string} svgPath - Path to the SVG file
 * @returns {Promise<Array<[string, Record<string, string>]>>}
 */
export async function parseSvg(svgPath) {
  const content = await readFile(svgPath, 'utf-8');
  return parseSvgString(content);
}

/**
 * Parse SVG string content into an IconNode array.
 *
 * @param {string} svgContent - Raw SVG string
 * @returns {Array<[string, Record<string, string>]>}
 */
export function parseSvgString(svgContent) {
  const nodes = [];

  // Remove the outer <svg> wrapper — we only want child elements
  // Match everything between <svg ...> and </svg>
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!innerMatch) {
    return nodes;
  }

  const innerContent = innerMatch[1];

  // Match all self-closing or paired elements
  // Handles: <path .../>, <circle .../>, <rect .../>, <g>...</g>, etc.
  const elementRegex = /<(\w+)\s([^>]*?)\/>/g;
  let match;

  while ((match = elementRegex.exec(innerContent)) !== null) {
    const tagName = match[1];
    const attrsString = match[2].trim();
    const attrs = parseAttributes(attrsString);
    nodes.push([tagName, attrs]);
  }

  // Also handle non-self-closing elements (rare in icon SVGs but possible)
  const pairedRegex = /<(\w+)\s([^>]*?)>([\s\S]*?)<\/\1>/g;
  while ((match = pairedRegex.exec(innerContent)) !== null) {
    const tagName = match[1];
    const attrsString = match[2].trim();
    const attrs = parseAttributes(attrsString);
    // For paired elements with content, we'd need recursion
    // but icon SVGs typically only have self-closing elements
    nodes.push([tagName, attrs]);
  }

  return nodes;
}

/**
 * Parse an HTML/SVG attribute string into a key-value object.
 * Handles: fill="none" viewBox="0 0 24 24" d="M1 2..."
 *
 * @param {string} attrString
 * @returns {Record<string, string>}
 */
function parseAttributes(attrString) {
  const attrs = {};
  // Match key="value" pairs, handling values with spaces
  const attrRegex = /([\w-]+)="([^"]*)"/g;
  let match;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2];

    // Convert HTML attribute names to JSX/camelCase
    const jsxKey = htmlAttrToJsx(key);
    attrs[jsxKey] = value;
  }

  return attrs;
}

/**
 * Convert HTML/SVG attribute names to JSX-compatible names.
 *
 * @param {string} attr - HTML attribute name
 * @returns {string} JSX attribute name
 */
function htmlAttrToJsx(attr) {
  const mappings = {
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'clip-path': 'clipPath',
    'fill-opacity': 'fillOpacity',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-miterlimit': 'strokeMiterlimit',
    'stroke-opacity': 'strokeOpacity',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'font-size': 'fontSize',
    'font-family': 'fontFamily',
    'font-weight': 'fontWeight',
    'text-anchor': 'textAnchor',
    'dominant-baseline': 'dominantBaseline',
    'xlink:href': 'xlinkHref',
    'xml:space': 'xmlSpace',
    'xmlns:xlink': 'xmlnsXlink',
    'color-interpolation-filters': 'colorInterpolationFilters',
  };

  return mappings[attr] || attr;
}
