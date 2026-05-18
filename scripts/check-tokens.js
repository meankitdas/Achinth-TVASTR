#!/usr/bin/env node
/**
 * check-tokens.js
 *
 * CI guardrail (Light_Theme Industrial Redesign — task 11.2 / Property 12):
 *   Asserts that `src/index.css` `:root` is a byte-equal projection of the
 *   Theme_Tokens declared in `src/design/colors.js`.
 *
 *   For every Theme_Token leaf (`colors.<group>.<key>` and `semantic.<key>`):
 *     1. Exactly one matching `--<group>-<key>` (or `--semantic-<key>`) CSS
 *        custom-property declaration MUST exist in `src/index.css`.
 *     2. The declared value MUST byte-equal the JS literal — no whitespace,
 *        case, or formatting drift permitted.
 *     3. The total Theme_Token count MUST equal EXPECTED_TOKEN_COUNT, so any
 *        accidental addition or removal trips the check.
 *
 *   Exits non-zero with a per-token diagnostic on any failure; exits 0 with
 *   a one-line summary on success.
 *
 *   Wired as the `check:tokens` npm script and the `prebuild` hook so
 *   `pnpm build` fails fast on theme drift.
 *
 *   Requirements: 2.8, 2.9, 16.2, 16.4
 *   Design: §Testing Strategy > Visual regression and build checks
 *           (Theme integrity check); §Property 12.
 */
import { readFile } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";

const ROOT = process.cwd();

// Documented expected count of Theme_Tokens (background:4 + text:3 +
// telemetry:3 + process:2 + signal:3 + border:3 + semantic:3 = 21).
// Bump this constant deliberately whenever the token surface changes.
const EXPECTED_TOKEN_COUNT = 21;

// Map JS object keys to their CSS-variable prefix.
const COLOR_PREFIX = {
  background: "bg",
  text: "text",
  telemetry: "telemetry",
  process: "process",
  signal: "signal",
  border: "border",
};

const colorsModule = await import(
  pathToFileURL(join(ROOT, "src/design/colors.js")).href
);
const { colors, semantic } = colorsModule;

/**
 * Flatten one level of an object into [cssVarName, value] pairs.
 */
function flatten(obj, prefix) {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === "object") {
      // Token contract is one level deep; nested objects indicate drift.
      throw new Error(
        `Unexpected nested token at ${prefix}.${key}; check src/design/colors.js shape.`,
      );
    }
    out.push([`--${prefix}-${key}`, value]);
  }
  return out;
}

const expectedVars = [];
for (const [group, prefix] of Object.entries(COLOR_PREFIX)) {
  if (!colors[group]) {
    throw new Error(
      `colors.${group} is missing from src/design/colors.js; cannot project to CSS.`,
    );
  }
  expectedVars.push(...flatten(colors[group], prefix));
}
expectedVars.push(...flatten(semantic, "semantic"));

if (expectedVars.length !== EXPECTED_TOKEN_COUNT) {
  console.error(
    `check:tokens — token count drift: expected ${EXPECTED_TOKEN_COUNT}, found ${expectedVars.length} in src/design/colors.js.`,
  );
  console.error(
    "Update EXPECTED_TOKEN_COUNT in scripts/check-tokens.js after a deliberate token-surface change.",
  );
  process.exit(1);
}

const cssText = await readFile(join(ROOT, "src/index.css"), "utf8");

// Match exactly `--name: <value>;` declarations. We capture the raw value
// (between `:` and the terminating `;`) and compare byte-for-byte. We
// deliberately do NOT trim or normalize.
function findDeclarations(cssSrc, name) {
  // Anchor on a non-identifier boundary before `--` so `--bg-primary` does
  // not also match `--bg-primary-foo`.
  const escaped = name.replace(/[-]/g, "\\-");
  const re = new RegExp(`(^|[^A-Za-z0-9_-])${escaped}\\s*:\\s*([^;]*?);`, "g");
  const matches = [];
  let m;
  while ((m = re.exec(cssSrc)) !== null) {
    matches.push(m[2]);
  }
  return matches;
}

const violations = [];
for (const [name, expected] of expectedVars) {
  const decls = findDeclarations(cssText, name);
  if (decls.length === 0) {
    violations.push(`Missing CSS variable ${name} (expected '${expected}').`);
    continue;
  }
  if (decls.length > 1) {
    violations.push(
      `Duplicate CSS variable ${name}: declared ${decls.length} times in src/index.css (expected exactly one).`,
    );
    continue;
  }
  const actual = decls[0];
  if (actual !== expected) {
    violations.push(
      `Mismatch ${name}: expected '${expected}' (byte-equal), got '${actual}'.`,
    );
  }
}

if (violations.length > 0) {
  console.error("check:tokens — theme integrity violations:");
  for (const v of violations) console.error(`  ${v}`);
  console.error(`\n${violations.length} offending token(s).`);
  process.exit(1);
}

console.log(
  `check:tokens ✓ all ${expectedVars.length} Theme_Tokens are byte-equal between src/design/colors.js and src/index.css.`,
);
process.exit(0);
