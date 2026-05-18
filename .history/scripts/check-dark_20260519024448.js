#!/usr/bin/env node
/**
 * check-dark.js
 *
 * CI guardrail (Light_Theme Industrial Redesign):
 *   - Greps `src/**\/*.{js,jsx,ts,tsx,css,html}` for `dark:` Tailwind variants
 *     and `prefers-color-scheme: dark` references.
 *   - Skips `src/__tests__/` (tests legitimately reference these patterns to
 *     prove the dark-scheme no-op behaviour).
 *   - Allow-lists intentional comparison comments (lines beginning with `//`
 *     or `*` that explicitly say "render the same as Light_Theme") because
 *     design.md permits them as documentation.
 *   - Exits 1 (and prints `<file>:<line>: <text>` for every offender) on any
 *     real match; exits 0 when the tree is clean.
 */
import { readdir, readFile } from "fs/promises";
import { join, extname, relative } from "path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const EXCLUDE_DIRS = new Set(["__tests__", "node_modules"]);
const VALID_EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".css", ".html"]);
const PATTERNS = [
  { name: "dark:", regex: /\bdark:/ },
  { name: "prefers-color-scheme: dark", regex: /prefers-color-scheme:\s*dark/ },
];
const INTENTIONAL_COMMENT = /render the same as Light_Theme/i;

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      files.push(...(await walk(path)));
    } else if (entry.isFile() && VALID_EXT.has(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

function isAllowedComment(line) {
  const trimmed = line.trim();
  const isCommentLine = trimmed.startsWith("//") || trimmed.startsWith("*");
  return isCommentLine && INTENTIONAL_COMMENT.test(line);
}

const files = await walk(SRC);
const violations = [];

for (const file of files) {
  const text = await readFile(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const { regex } of PATTERNS) {
      if (regex.test(line)) {
        if (isAllowedComment(line)) return;
        violations.push(`${relative(ROOT, file)}:${idx + 1}: ${line.trim()}`);
        return;
      }
    }
  });
}

if (violations.length > 0) {
  console.error("check:dark — found dark-theme references in src/:");
  for (const v of violations) console.error(`  ${v}`);
  console.error(`\n${violations.length} offending location(s).`);
  process.exit(1);
}

console.log(
  `check:dark ✓ no dark-theme references found in ${files.length} files.`,
);
process.exit(0);
