// One-shot helper to compute scripts/bundle-baseline.json from the current dist/.
// Usage (after `pnpm build`):
//   node scripts/_capture-baseline.mjs
//
// Walks dist/ for every .js and .css asset, computes raw and gzipped sizes
// (zlib.gzipSync default level), and writes a sorted, parseable JSON document
// at scripts/bundle-baseline.json. The bundle-size diff (task 11.3) reads it.

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, relative, sep, posix } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(here, "..");
const distRoot = join(repoRoot, "dist");
const baselinePath = join(here, "bundle-baseline.json");

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function toPosix(p) {
  return p.split(sep).join(posix.sep);
}

const ASSET_RE = /\.(?:js|css)$/i;

const files = walk(distRoot)
  .filter((f) => ASSET_RE.test(f))
  .sort();

const assets = [];
let totalRaw = 0;
let totalGzip = 0;

for (const file of files) {
  const buf = readFileSync(file);
  const gz = gzipSync(buf);
  const rel = toPosix(relative(distRoot, file));
  assets.push({
    path: rel,
    rawBytes: buf.length,
    gzipBytes: gz.length,
  });
  totalRaw += buf.length;
  totalGzip += gz.length;
}

assets.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const viteVersion =
  (pkg.devDependencies && pkg.devDependencies.vite) ||
  (pkg.dependencies && pkg.dependencies.vite) ||
  null;

const baseline = {
  capturedAt: new Date().toISOString(),
  node: process.version,
  viteVersion,
  totals: {
    rawBytes: totalRaw,
    gzipBytes: totalGzip,
  },
  assets,
};

writeFileSync(baselinePath, JSON.stringify(baseline, null, 2) + "\n", "utf8");

// Sanity-check before exit: parseable + totals match the per-asset sums.
const reread = JSON.parse(readFileSync(baselinePath, "utf8"));
const sumRaw = reread.assets.reduce((n, a) => n + a.rawBytes, 0);
const sumGz = reread.assets.reduce((n, a) => n + a.gzipBytes, 0);
if (sumRaw !== reread.totals.rawBytes || sumGz !== reread.totals.gzipBytes) {
  console.error("Baseline totals do not match per-asset sums");
  process.exit(1);
}
console.log(
  `Wrote ${baselinePath} — ${reread.assets.length} assets, ` +
    `${reread.totals.rawBytes} bytes raw, ${reread.totals.gzipBytes} bytes gzipped.`,
);
