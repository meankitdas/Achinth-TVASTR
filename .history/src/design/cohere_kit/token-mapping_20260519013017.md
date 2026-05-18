# Cohere_Kit → Theme_Token mapping

This document is the canonical mapping from the Cohere_Kit source tokens
(committed at `src/design/cohere_kit/DESIGN.md`) to the Theme_Token
destinations exposed by `src/design/colors.js` (`colors.*` and `semantic.*`).
It is the source of truth for the hex/rgba values that task 2.3 will write
in place into `colors.js` while preserving the token shape (Req 1.3, 3.4,
16.5).

The schema mirrors `design.md` § Cohere_Kit → Theme_Token mapping. Hex
values are 6-digit; border tokens are `rgba()` so `tools/theme_editor.py`
parses them per its existing token contract (Req 2.7, 20.x).

## Provenance

- Cohere kit source: `src/design/cohere_kit/DESIGN.md` (`getdesign@0.6.20`,
  kit `cohere`, version `alpha`, generated 2026-05-18T19:53:32Z; see
  `README.md` for the exact CLI invocation).
- Spec sources: `requirements.md` Req 1.1, 1.2, 1.7, 2.1–2.7;
  `design.md` § Components and Interfaces > Token system upgrades and
  § Data Models > Cohere_Kit token mapping.
- Executable sketch: `src/design/cohere_kit/mapping.js` exports
  `COHERE_TO_THEME_TOKEN`, an object literal whose keys are dotted Cohere
  source paths and whose values are dotted Theme_Token destination paths
  (or arrays of paths when a Cohere source feeds two Theme_Tokens).

## Mapping table

| Cohere source token       | Cohere kit value (DESIGN.md)      | Hex (or rgba)         | Theme_Token destination                             | Reasoning                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | --------------------------------- | --------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cohere.surface.canvas`   | `colors.canvas`                   | `#ffffff`             | `colors.background.primary`                         | Dominant page background. CIE relative luminance 1.0 ∈ [0.85, 1.0] (Req 2.1).                                                                                                                                                                                                                                                                                                                                                |
| `cohere.surface.muted`    | `colors.pale-blue`                | `#f1f5ff`             | `colors.background.secondary`                       | Subtle section break wash (Cohere's blog/CTA pale surface). Distinct from canvas; documented as a "muted" surface step.                                                                                                                                                                                                                                                                                                      |
| `cohere.surface.elevated` | `colors.canvas`                   | `#ffffff`             | `colors.background.elevated`                        | Card / raised surface. In Cohere, cards (`hero-photo-card`, `capability-card`, `contact-form-card`) are pure white over warmer stone or wash sections, so elevated equals the canvas. Documented kit-shape deviation: `primary == elevated` (acceptable, see Notes).                                                                                                                                                         |
| `cohere.surface.panel`    | `colors.soft-stone`               | `#eeece7`             | `colors.background.panel`                           | Sidebar / heavy panel. Soft-stone is Cohere's warm neutral surface for product cards and stone bands; serves as a denser panel surface than `secondary`.                                                                                                                                                                                                                                                                     |
| `cohere.text.primary`     | `colors.ink`                      | `#212121`             | `colors.text.primary`                               | Default body text. Contrast vs `#ffffff` ≈ 16.10 ≥ 7.0 (Req 2.2).                                                                                                                                                                                                                                                                                                                                                            |
| `cohere.text.secondary`   | `colors.body-muted`               | `#616161`             | `colors.text.secondary`                             | Secondary copy. Contrast vs `#ffffff` ≈ 6.29 ≥ 4.5 (Req 2.3). Picked over `slate` (#75758a, ≈ 4.55) for additional headroom.                                                                                                                                                                                                                                                                                                 |
| `cohere.text.muted`       | `colors.muted`                    | `#93939f`             | `colors.text.muted`                                 | Metadata / de-emphasized labels. Contrast vs `#ffffff` ≈ 3.02 ≥ 3.0 (Req 2.4); only valid at 18.66 px bold or 24 px regular or larger.                                                                                                                                                                                                                                                                                       |
| `cohere.brand.primary`    | `colors.action-blue`              | `#1863dc`             | `colors.telemetry.primary` **and** `semantic.brand` | Brand_Color anchor (Req 1.2, 7.2). Cohere's `colors.primary` (`#17171c`) is a near-black UI anchor, not a chromatic brand accent; we adopt `action-blue` (Cohere's editorial-link / secondary-emphasis color) as the Tvastr brand. Contrast vs `#ffffff` ≈ 5.47 ≥ 4.5 (Req 2.5).                                                                                                                                             |
| `cohere.brand.muted`      | `colors.focus-blue`               | `#4c6ee6`             | `colors.telemetry.secondary`                        | Hover / pressed brand state. Contrast vs `#ffffff` ≈ 4.49 — narrowly below the 4.5 small-text threshold; permissible because this token is rendered as a transient hover/pressed accent over the primary, not as standalone interactive label text (Req 2.5 applies to the primary only). Documented borderline.                                                                                                             |
| `cohere.brand.deep`       | `colors.dark-navy`                | `#071829`             | `colors.telemetry.muted`                            | Subdued brand accent. Cohere's deepest blue tone; used where the brand needs a near-black presentation (e.g., dense UI cards) without leaving the blue family.                                                                                                                                                                                                                                                               |
| `cohere.process.primary`  | `colors.deep-green`               | `#003c33`             | `colors.process.primary`                            | Process / flow-diagram strokes (Req 13.2). Deep-green is Cohere's enterprise-band color and the closest semantic to "industrial process". Contrast vs `#ffffff` ≈ 12.0 ≥ 3.0 (Req 2.6 if rendered as graphical indicator).                                                                                                                                                                                                   |
| `cohere.process.muted`    | `colors.slate`                    | `#75758a`             | `colors.process.secondary`                          | Process accent. The Cohere kit has no green tone scale, so we pick the closest tertiary-muted neutral (`slate`, used for "research separators and tertiary text"). Documented deviation; suitable for desaturated process accents.                                                                                                                                                                                           |
| `cohere.signal.warning`   | (no exact kit equivalent)         | `#b45309`             | `colors.signal.warning` **and** `semantic.alert`    | **Documented deviation.** Cohere's only warm anchors (`coral` `#ff7759` and `coral-soft` `#ffad9b`) both fail Req 2.6 ≥ 3.0 contrast against `#ffffff` (`coral` ≈ 2.62). Adopt `#b45309` (Tailwind's amber 700; matches the design.md placeholder for `cohere.signal.warning`) so portal Tier_Badge ACTIVE state and warning indicators meet the graphical-contrast threshold. Contrast vs `#ffffff` ≈ 5.95 ≥ 3.0 (Req 2.6). |
| `cohere.signal.glow`      | `colors.coral`                    | `#ff7759`             | `colors.signal.glow`                                | Emphasis / halo accent. Used in non-text decorative contexts (e.g., highlight ring, taxonomy chip outline) where Req 2.6's graphical-indicator contrast does not bind. Returns the Cohere coral palette to the kit deviation in `signal.warning`.                                                                                                                                                                            |
| `cohere.signal.danger`    | `colors.error`                    | `#b30000`             | `colors.signal.danger` **and** `semantic.danger`    | Errors only (Req 2.6, 22.3). Contrast vs `#ffffff` ≈ 7.19 ≥ 3.0.                                                                                                                                                                                                                                                                                                                                                             |
| `cohere.border.subtle`    | `colors.card-border` (`#f2f2f2`)  | `rgba(0, 0, 0, 0.05)` | `colors.border.subtle`                              | Softest containment line. Encoded as `rgba()` per Req 2.7. α(subtle) = 0.05.                                                                                                                                                                                                                                                                                                                                                 |
| `cohere.border.default`   | `colors.border-light` (`#e5e7eb`) | `rgba(0, 0, 0, 0.10)` | `colors.border.default`                             | Standard utility rule. α(default) = 0.10 > α(subtle).                                                                                                                                                                                                                                                                                                                                                                        |
| `cohere.border.strong`    | `colors.hairline` (`#d9d9dd`)     | `rgba(0, 0, 0, 0.15)` | `colors.border.strong`                              | List rules / heavier section dividers. α(strong) = 0.15 > α(default), satisfying α(subtle) < α(default) < α(strong) (Req 2.7).                                                                                                                                                                                                                                                                                               |

## Notes

### Brand anchor: `action-blue` over Cohere's `primary`

Cohere's own `colors.primary` (`#17171c`) is a near-black UI anchor (used for
primary CTA fills, dark footer, and deep agent-console panels), not a
chromatic brand accent. Mapping it to `colors.telemetry.primary` /
`semantic.brand` would conflict with `Forge_Core` requirements that the
emissive accent reads as a brand color (Req 7.2) and with the Light_Theme
contract that the brand anchor is renderable as both interactive label text
and a semantic accent (Req 1.2, 12.4). We therefore adopt `action-blue`
(`#1863dc`) — Cohere's editorial-link and secondary-emphasis color — as the
Tvastr brand anchor. It satisfies Req 2.5 (≥ 4.5 contrast vs `#ffffff` for
small text) and registers as enterprise-AI in tone.

### Documented kit deviations

1. **`cohere.surface.elevated → colors.background.elevated`**: both equal
   `#ffffff` because Cohere stages elevation by alternating the white canvas
   with surrounding stone / wash bands rather than darkening the card. The
   `colors` token shape preserves the `elevated` key (Req 1.3, 3.4) but the
   value is identical to `primary`.
2. **`cohere.process.muted → colors.process.secondary`**: the Cohere kit has
   no green tone scale. We pick `slate` (`#75758a`) — semantically the
   closest "tertiary muted" neutral in the kit — and document that future
   iterations may diversify if process diagrams need a stronger secondary
   stroke.
3. **`cohere.signal.warning → colors.signal.warning` / `semantic.alert`**:
   the only warm anchors in the Cohere kit (`coral` and `coral-soft`) fail
   Req 2.6's 3.0 graphical-indicator contrast. We deviate to `#b45309`
   (Tailwind's amber 700, also the design.md placeholder for this slot) so
   Tier_Badge ACTIVE and signal-warning indicators in the portal meet the
   contrast threshold. `coral` itself is preserved as `colors.signal.glow`
   for non-binding decorative emphasis.
4. **`cohere.brand.muted → colors.telemetry.secondary`**: `focus-blue`
   (`#4c6ee6`) computes to ≈ 4.49 contrast vs `#ffffff`, narrowly below the
   4.5 small-text threshold. Acceptable because this token is the hover /
   pressed accent layered over the primary, never used as standalone
   interactive label text. If a Theme_Editor save lowers contrast further,
   the Theme_Token contract checker (task 2.4 / 11.3) will flag it.

### Dual mappings

Three Cohere sources fan out to two Theme_Tokens because the Light_Theme
contract reuses brand / alert / danger across both `colors.*` and
`semantic.*`:

- `cohere.brand.primary` → `colors.telemetry.primary`, `semantic.brand`
  (Req 1.2, 7.2).
- `cohere.signal.warning` → `colors.signal.warning`, `semantic.alert`.
- `cohere.signal.danger` → `colors.signal.danger`, `semantic.danger`.

In `mapping.js` these are encoded as arrays of dotted destination paths so
the mapping is mechanically traversable. The design.md sketch records the
same fan-out via inline comments; the array form is a faithful refinement.

### Excluded Cohere tokens

The following Cohere kit values are intentionally **not** mapped into
`colors.*` or `semantic.*` because they have no direct Theme_Token slot and
are referenced (if at all) as raw values from component implementations
rather than through the token system:

- `colors.cohere-black` (`#000000`) — announcement-bar surface; not a
  Theme_Token concern.
- `colors.primary` (`#17171c`) — Cohere's near-black UI anchor (see "Brand
  anchor" note above).
- `colors.deep-green` is reused for `process.primary`; it is not separately
  mapped to a "feature band" token because the Theme_Token shape has no
  feature-band slot.
- `colors.dark-navy` is mapped to `telemetry.muted` only; it is not
  separately mapped to a "navy band" token for the same reason.
- `colors.pale-green` (`#edfce9`) — North-page wash; no current Theme_Token
  slot.
- `colors.coral-soft` (`#ffad9b`) — taxonomy-chip outline; no current
  Theme_Token slot.
- `colors.form-focus` (`#9b60aa`) — form input focus border; not surfaced
  via the token system today (focus uses `colors.telemetry.primary`).
- `colors.on-primary`, `colors.on-dark` (`#ffffff`) — duplicate of canvas;
  consumed implicitly by component foreground rules.
