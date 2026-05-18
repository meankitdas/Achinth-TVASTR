#!/usr/bin/env node
/**
 * check-bundle-size.js
 *
 * CI guardrail (Light_Theme Industrial Redesign — Req 4.7):
 *   - Builds the project (or assumes `dist/` exists when `--no-build` is passed).
 *   - Computes gzipped sizes of every JS/CSS asset under `dist/assets/`.
 *   - Compares each asset and the total against `scripts/bundle-baseline.json`
 *     (captured pre-feature in task 13.1).
 *   - Exits 1 when the total gzipped delta exceeds 90 KB.
 */
import { readFile, readdir } from "fs/promises";
import { join, extname, relative } from "path";
import { gzipSync } from "zlib";
import { execSync } from "child_process";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const ASSETS_DIR = join(DIST, "assets");
const BASELINE = join(ROOT, "scripts/bundle-baseline.json");
const MAX_DELTA_BYTES = 90 * 1024; // 90 KB gzipped

const args = process.argv.slice(2);
if (!args.includes("--no-build")) {
  console.log("Building...");
  execSync("pnpm build", { stdio: "inherit", cwd: ROOT });
}

async function walkAssets(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`check:bundle-size — assets directory not found: ${dir}`);
      console.error("Run `pnpm build` first or omit --no-build.");
      process.exit(1);
    }
    throw err;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkAssets(p)));
    } else {
      const ext = extname(e.name);
      if (ext === ".js" || ext === ".css") {
        const buf = await readFile(p);
        out.push({
          path: relative(DIST, p),
          rawBytes: buf.length,
          gzipBytes: gzipSync(buf).length,
        });
      }
    }
  }
  return out;
}

function fmtBytes(n) {
  const sign = n >= 0 ? "+" : "-";
  const abs = Math.abs(n);
  return `${sign}${abs} B (${sign}${(abs / 1024).toFixed(1)} KB)`;
}

const current = (await walkAssets(ASSETS_DIR)).sort((a, b) =>
  a.path.localeCompare(b.path),
);

const totals = current.reduce(
  (acc, a) => ({
    rawBytes: acc.rawBytes + a.rawBytes,
    gzipBytes: acc.gzipBytes + a.gzipBytes,
  }),
  { rawBytes: 0, gzipBytes: 0 },
);

const baseline = JSON.parse(await readFile(BASELINE, "utf8"));
const baselineByPath = new Map(baseline.assets.map((a) => [a.path, a]));
const currentByPath = new Map(current.map((a) => [a.path, a]));

console.log("\nPer-asset gzipped deltas (vs baseline):");
console.log(
  "  status  asset                                              delta",
);
console.log("  " + "-".repeat(72));

const allPaths = new Set([...baselineByPath.keys(), ...currentByPath.keys()]);
const sortedPaths = [...allPaths].sort();
for (const p of sortedPaths) {
  const b = baselineByPath.get(p);
  const c = currentByPath.get(p);
  let status;
  let delta;
  if (b && c) {
    status = "~";
    delta = c.gzipBytes - b.gzipBytes;
  } else if (c) {
    status = "+";
    delta = c.gzipBytes;
  } else {
    status = "-";
    delta = -b.gzipBytes;
  }
  // Hash-busted filenames change every build; print the path as captured so
  // diffs are still readable when names rotate.
  console.log(`  ${status.padEnd(6)}  ${p.padEnd(50)}  ${fmtBytes(delta)}`);
}

const totalDelta = totals.gzipBytes - baseline.totals.gzipBytes;

console.log("\nTotals:");
console.log(`  baseline gzipped: ${baseline.totals.gzipBytes} B`);
console.log(`  current  gzipped: ${totals.gzipBytes} B`);
console.log(`  delta:            ${fmtBytes(totalDelta)}`);
console.log(`  budget:           ${MAX_DELTA_BYTES} B (90 KB)`);

if (totalDelta > MAX_DELTA_BYTES) {
  console.error(
    `\n❌ check:bundle-size — total gzipped delta ${totalDelta} B exceeds 90 KB budget.`,
  );
  process.exit(1);
}

console.log("\n✓ check:bundle-size — total gzipped delta within 90 KB budget.");
process.exit(0);
