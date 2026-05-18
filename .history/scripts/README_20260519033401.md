# Build & CI scripts

Helper scripts and configuration that guard the Light_Theme Industrial Redesign
performance and theme-integrity budgets. Each script is wired through an npm
script in `package.json`.

## Lighthouse CI (`pnpm lhci`)

The `lhci` npm script runs `lhci autorun`, which reads `lighthouserc.json` at
the repository root and exercises the production preview against the
performance budget defined in the spec
(`.kiro/specs/light-theme-industrial-redesign/`, Requirements 19.3 / 19.6 and
design.md §Testing Strategy > Visual regression and build checks).

### What it does

1. Runs `pnpm preview` to start the Vite preview server on
   `http://localhost:4173/` and waits until the `Local: http…` line appears
   (timeout 120 s).
2. Performs **three cold loads** of `/` against the desktop preset
   (1920 × 1080, scale 1, throttling `provided`).
3. Asserts the **median** of the three runs:
   - `largest-contentful-paint` ≤ **2500 ms** (LCP ≤ 2.5 s).
   - `cumulative-layout-shift` ≤ **0.1**.
4. Uploads the report to Lighthouse CI's temporary public storage and prints
   the result URL.

### Running locally

```bash
pnpm build       # produce dist/ — preview serves from here
pnpm lhci        # spins up `pnpm preview`, runs Lighthouse, asserts budget
```

The script tears down the preview server automatically when the run finishes.
If port `4173` is already taken, stop the conflicting process before invoking
`pnpm lhci`.

### Failure semantics

Any failed assertion exits non-zero. Treat an `lhci` failure as a **release
verification failure**: the build is not eligible to ship until the regression
is investigated and the median LCP / CLS numbers fall back inside the budget,
or the budget is renegotiated through the spec.

### Configuration

All thresholds, run counts, screen emulation, and the preview command live in
`lighthouserc.json` at the repository root. Update that file (and the spec)
when adjusting the budget — do not pass overrides on the command line.

## Full verify pipeline (`pnpm verify`)

The `verify` npm script chains every gate that backs the Light_Theme
Industrial Redesign release checklist (spec
`.kiro/specs/light-theme-industrial-redesign/`, Requirements 3.5, 16.4, 19.1,
19.2, 19.3, 19.5, 19.6 and design.md §Testing Strategy > Visual regression
and build checks). The chain uses `&&`, so the script exits on the **first**
non-zero step and skips everything that follows. Run it before declaring a
release candidate ready.

### Order of execution

1. **`pnpm check:dark`** — fails if any `dark:` Tailwind variant or
   theme-switch reference (`useTheme`, `ThemeProvider`,
   `prefers-color-scheme: dark` outside intentional comparison tests) survives
   under `src/**/*.{jsx,js,ts,tsx,css,html}` (Requirement 3.5).
2. **`pnpm check:tokens`** — Theme integrity check. Walks every Theme_Token
   in `src/design/colors.js` and asserts a byte-equal `--*` CSS variable
   exists in `src/index.css` (Requirements 2.8, 2.9, 16.4 and Property 12).
   Also runs automatically as `prebuild` so step 3 wouldn't proceed without
   it, but the explicit invocation gives a clean fail-fast signal in CI logs.
3. **`pnpm build`** — `vite build`. Produces `dist/` for the bundle-size and
   Lighthouse steps, and surfaces any Tailwind, type, or import errors.
4. **`pnpm check:bundle-size`** — sums the gzipped sizes of every
   `.js`/`.css` asset in `dist/`, compares against
   `scripts/bundle-baseline.json`, and fails the build if the JS delta
   exceeds 120 KB, the CSS delta exceeds 30 KB, or the combined `gsap` +
   `framer-motion` JS contribution exceeds 90 KB gzipped (Requirements 4.7,
   19.1, 19.2, 19.5).
5. **`pnpm test`** — `vitest run`. Executes every unit and property suite
   under `src/__tests__/unit/` and `src/__tests__/properties/`.
6. **`pnpm test:e2e`** — `playwright test`. Drives the integration suites
   under `src/__tests__/integration/` against the production preview server
   on `http://localhost:4173/`. Requires Chromium installed via
   `pnpm exec playwright install chromium` and an unused port `4173`.
7. **`pnpm lhci`** — `lhci autorun`. Performs three cold loads of `/` on the
   Desktop_Reference_Device profile and asserts LCP ≤ 2.5 s and CLS ≤ 0.1 on
   the median run (Requirements 19.3, 19.6). Spins up its own preview
   server.

### Expected output

Each step prints its own progress, then a one-line summary. A successful
run looks roughly like this (sizes and timings vary):

```text
$ pnpm verify
> pnpm check:dark
check:dark — scanned 142 files, 0 violations
> pnpm check:tokens
check:tokens — 38 Theme_Tokens verified against src/index.css
> pnpm build
vite v5.x building for production...
✓ built in 4.32s
> pnpm check:bundle-size
check:bundle-size — JS delta +84.1 KB / 120 KB, CSS delta +6.8 KB / 30 KB,
                    gsap+framer-motion 73.4 KB / 90 KB — OK
> pnpm test
Test Files  N passed (N)
     Tests  N passed (N)
> pnpm test:e2e
N passed (Xs)
> pnpm lhci
Asserting on category 'performance' for 3 URL(s)...
All assertions passed.
```

### Failure semantics

The chain stops at the first non-zero exit. Re-run the failing step in
isolation (e.g., `pnpm check:bundle-size`) to iterate on the fix without
re-paying for the upstream steps. After the failing step is green, run
`pnpm verify` end-to-end again so the full gate is exercised before merge.

If `pnpm test:e2e` or `pnpm lhci` cannot run in the current environment
(headless Chromium unavailable, port `4173` occupied, sandbox restrictions),
run the preceding steps manually and document the deferred steps in the PR
description.
