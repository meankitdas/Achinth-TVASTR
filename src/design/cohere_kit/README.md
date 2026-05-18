# Cohere_Kit

Source-of-truth artifacts produced by the `getdesign` CLI for the Cohere brand
kit. Imported once during the Light_Theme Industrial Redesign and committed
verbatim. Subsequent tasks (2.2 and beyond) author the
`Cohere_Kit → Theme_Token` mapping that adapts these values into
`src/design/colors.js` without changing the existing token shape.

Per `requirements.md` Req 1.1 and `design.md` § Components and Interfaces >
Token system upgrades, every Cohere artifact lives under this directory; no
Cohere files are scattered anywhere else under `src/`.

## Provenance

| Field       | Value                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| CLI command | `npx getdesign@latest add cohere --out src/design/cohere_kit/DESIGN.md` |
| Kit         | `cohere` (Enterprise AI platform — Cohere-design-analysis)              |
| Kit version | `alpha` (per `version:` front-matter in `DESIGN.md`)                    |
| Package     | `getdesign@0.6.20` (resolved from `latest` dist-tag)                    |
| Date (UTC)  | `2026-05-18T19:53:32Z`                                                  |
| Run from    | repository root (`/Users/ankitdas/Tvastr`)                              |

## Notes

- The CLI accepts `--out <path>` so it wrote `DESIGN.md` directly into this
  directory. Nothing was emitted at the repo root or anywhere else under
  `src/`; no relocation step was required.
- `DESIGN.md` is a markdown file with a YAML front-matter block listing the
  kit's `colors`, `typography`, `spacing`, `radii`, and component primitives.
  Treat it as the canonical Cohere reference; do not hand-edit. To refresh,
  re-run the exact CLI command above and re-derive the mapping in 2.2.
- `.gitkeep` remains from the scaffold step (task 1.2). It is harmless once
  real content exists alongside it; leave it in place to preserve the
  scaffold record.
