/**
 * An IconNode represents the SVG child elements of an icon.
 * Each entry is a tuple of [tagName, attributes].
 *
 * Example:
 * ```ts
 * const HomeIcon: IconNode = [
 *   ["path", { d: "M1 2...", fill: "currentColor", fillRule: "evenodd" }]
 * ];
 * ```
 */
export type IconNode = [tag: string, attrs: Record<string, string>][];
