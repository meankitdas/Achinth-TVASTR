/**
 * @file src/design/clipPaths.js
 * @description CSS `clip-path` builders for the Light_Theme Industrial
 * redesign — chamfered "machined" corners on cards and impact-grid tiles.
 *
 * Exports:
 *   - {@link machinedCorner}  — generic chamfer builder. Given a corner size
 *     in pixels and a list of corner codes, returns a CSS
 *     `polygon(...)` string suitable for the `clip-path` property.
 *   - {@link cardClipPath}    — top-right notch with a 12 px chamfer. Card
 *     chamfers must lie in the closed interval [8, 16] px (Requirements 6.5,
 *     Property 14).
 *   - {@link tileClipPath}    — top-right notch with a 16 px chamfer. Impact
 *     tile chamfers must lie in the closed interval [8, 24] px
 *     (Requirements 14.6).
 *
 * The polygon walks the rectangle clockwise starting at the top-left,
 * replacing each chamfered corner with a 45° two-vertex notch and leaving
 * unchamfered corners as a single right-angle vertex. The output is a pure
 * CSS string — this module performs no DOM mutation and has no runtime
 * dependencies.
 *
 * Design references:
 *   - design.md § Components and Interfaces > Industrial decor layer
 *     (`src/design/clipPaths.js`)
 *   - design.md § Property 14
 */

/**
 * @typedef {('tl'|'tr'|'bl'|'br')} CornerCode
 *   Two-letter corner code: top-left, top-right, bottom-left, bottom-right.
 */

/**
 * Build a `clip-path: polygon(...)` string with the listed corners chamfered
 * by `size` pixels. Unlisted corners remain right-angled.
 *
 * The polygon is emitted clockwise starting at the top-left corner, so each
 * chamfered corner contributes two vertices and each square corner contributes
 * one. The returned string is suitable as the value of a CSS `clip-path`
 * property (e.g. `style={{ clipPath: machinedCorner(12, ['tr']) }}`).
 *
 * Chamfer-size bounds (asserted by Property 14's test in phase 12):
 *   - Card surfaces (ProductCard family, UpgradeBanner): `size` ∈ [8, 16] px.
 *   - SystemImpactGrid tiles:                            `size` ∈ [8, 24] px.
 * The function itself does not enforce these bounds — callers are responsible
 * for passing a value within their consumer's range.
 *
 * @param {number} size - Chamfer length in pixels.
 * @param {CornerCode[]} [corners=['tr']] - Corners to chamfer; defaults to
 *   the top-right corner only (the canonical "machined notch" silhouette).
 * @returns {string} A CSS `polygon(...)` string for `clip-path`.
 */
export function machinedCorner(size, corners = ["tr"]) {
  const has = (c) => corners.includes(c);
  const vertices = [];

  // top-left
  if (has("tl")) {
    vertices.push(`0 ${size}px`, `${size}px 0`);
  } else {
    vertices.push("0 0");
  }

  // top-right
  if (has("tr")) {
    vertices.push(`calc(100% - ${size}px) 0`, `100% ${size}px`);
  } else {
    vertices.push("100% 0");
  }

  // bottom-right
  if (has("br")) {
    vertices.push(`100% calc(100% - ${size}px)`, `calc(100% - ${size}px) 100%`);
  } else {
    vertices.push("100% 100%");
  }

  // bottom-left
  if (has("bl")) {
    vertices.push(`${size}px 100%`, `0 calc(100% - ${size}px)`);
  } else {
    vertices.push("0 100%");
  }

  return `polygon(${vertices.join(", ")})`;
}

/**
 * Card clip-path — 12 px chamfer on the top-right corner.
 *
 * Applied to every card surface in the ProductCard family
 * (`ProductCard`, `LockedProductCard`, `ProductDownloadCard`,
 * `RollbackVersionCard`) as well as `UpgradeBanner`.
 *
 * Chamfer bound: 12 px ∈ [8, 16] px (Requirements 6.5, Property 14).
 *
 * @type {string}
 */
export const cardClipPath = machinedCorner(12, ["tr"]);

/**
 * Tile clip-path — 16 px chamfer on the top-right corner.
 *
 * Applied to every tile rendered by `SystemImpactGrid`.
 *
 * Chamfer bound: 16 px ∈ [8, 24] px (Requirements 14.6).
 *
 * @type {string}
 */
export const tileClipPath = machinedCorner(16, ["tr"]);
