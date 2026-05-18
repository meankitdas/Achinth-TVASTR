/**
 * Cohere_Kit → Theme_Token mapping (executable sketch).
 *
 * Spec sources:
 *   - requirements.md Req 1.1, 1.2, 1.7
 *   - design.md § Components and Interfaces > Token system upgrades
 *   - design.md § Data Models > Cohere_Kit token mapping
 *
 * The canonical, human-readable mapping (with Cohere kit values, hex
 * resolutions, and reasoning) is `src/design/cohere_kit/token-mapping.md`.
 * This module is an executable sketch that exports the mapping as an
 * object literal so build tooling and tests can traverse it
 * mechanically (e.g., the Property 11/12 token-shape and CSS-parity
 * checks in `src/__tests__/properties/`).
 *
 * Shape:
 *   - Keys are dotted Cohere source paths (e.g., 'cohere.brand.primary').
 *   - Values are dotted Theme_Token destination paths (e.g.,
 *     'colors.telemetry.primary'), or an array of dotted paths when a
 *     single Cohere source feeds two Theme_Tokens (Req 1.2 in
 *     particular: `cohere.brand.primary` maps to BOTH
 *     `colors.telemetry.primary` and `semantic.brand`).
 *
 * The string-form sketch in design.md uses inline comments to document
 * the dual mappings; the array form here is a faithful refinement so a
 * traversal does not need to re-parse the comments.
 */

export const COHERE_TO_THEME_TOKEN = {
  "cohere.surface.canvas": "colors.background.primary",
  "cohere.surface.muted": "colors.background.secondary",
  "cohere.surface.elevated": "colors.background.elevated",
  "cohere.surface.panel": "colors.background.panel",
  "cohere.text.primary": "colors.text.primary",
  "cohere.text.secondary": "colors.text.secondary",
  "cohere.text.muted": "colors.text.muted",
  // Brand anchor — Req 1.2, 7.2. Fans out to two Theme_Tokens.
  "cohere.brand.primary": ["colors.telemetry.primary", "semantic.brand"],
  "cohere.brand.muted": "colors.telemetry.secondary",
  "cohere.brand.deep": "colors.telemetry.muted",
  "cohere.process.primary": "colors.process.primary",
  "cohere.process.muted": "colors.process.secondary",
  // Portal accent + alerts (Req 15.2). Fans out to semantic.alert.
  "cohere.signal.warning": ["colors.signal.warning", "semantic.alert"],
  "cohere.signal.glow": "colors.signal.glow",
  // Errors only (Req 2.6). Fans out to semantic.danger.
  "cohere.signal.danger": ["colors.signal.danger", "semantic.danger"],
  "cohere.border.subtle": "colors.border.subtle",
  "cohere.border.default": "colors.border.default",
  "cohere.border.strong": "colors.border.strong",
};
