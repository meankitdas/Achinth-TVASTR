#!/usr/bin/env python3
"""Refactor hard-coded hex literals to colors.* token references in JSX file.

Mapping rules (Light_Theme tokens):
  background.primary  = #ffffff
  background.secondary = #f1f5ff (light blue panel)
  background.elevated = #ffffff
  background.panel    = #eeece7
  text.primary        = #212121
  text.secondary      = #616161
  text.muted          = #93939f
  telemetry.primary   = #1863dc
  telemetry.muted     = #071829
  process.primary     = #003c33
  signal.warning      = #b45309
  signal.glow         = #ff7759
  signal.danger       = #b30000
  border.subtle/default/strong = rgba(0,0,0,0.05/0.10/0.15)
"""
import re
import sys

path = sys.argv[1]
with open(path, "r") as f:
    src = f.read()

# Special-case multi-color gradient strings BEFORE plain replacements run.
gradient_pairs = [
    (
        "'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)'",
        "`linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.text.muted} 100%)`",
    ),
    (
        '"linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)"',
        "`linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.text.muted} 100%)`",
    ),
    (
        "'linear-gradient(135deg, #ffffff 0%, #a8a8b4 100%)'",
        "`linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.text.muted} 100%)`",
    ),
    (
        '"linear-gradient(135deg, #ffffff 0%, #a8a8b4 100%)"',
        "`linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.text.muted} 100%)`",
    ),
    (
        "'linear-gradient(to bottom, #0a0a0b 0%, #12121a 100%)'",
        "`linear-gradient(to bottom, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`",
    ),
    (
        '"linear-gradient(to bottom, #0a0a0b 0%, #12121a 100%)"',
        "`linear-gradient(to bottom, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`",
    ),
]
for src_str, dst in gradient_pairs:
    src = src.replace(src_str, dst)

# Quoted hex → JS token reference. Each entry maps an exact-quoted string to a JS expression.
mapping = [
    # Backgrounds
    ("#0a0a0b", "colors.background.primary"),
    ("#12121a", "colors.background.secondary"),
    ("#ffffff", "colors.background.primary"),
    ("#fff", "colors.background.primary"),
    # Light tinted panels and elevated surfaces
    ("#f0f9ff", "colors.background.secondary"),
    ("#f8fafc", "colors.background.panel"),
    ("#fafafa", "colors.background.panel"),
    ("#fef3c7", "colors.background.panel"),
    # Borders and dividers
    ("#e5e7eb", "colors.border.default"),
    ("#e2e8f0", "colors.border.default"),
    ("#bae6fd", "colors.border.default"),
    ("#fde68a", "colors.border.default"),
    # Muted slate/grey text and strokes
    ("#94a3b8", "colors.text.muted"),
    ("#cbd5e1", "colors.text.muted"),
    ("#a8a8b4", "colors.text.muted"),
    ("#888896", "colors.text.muted"),
    ("#686878", "colors.text.muted"),
    ("#c8c8d0", "colors.text.muted"),
    # Primary text / dark
    ("#111827", "colors.text.primary"),
    ("#212121", "colors.text.primary"),
    ("#000000", "colors.text.primary"),
    ("#000", "colors.text.primary"),
    ("#e5e5e7", "colors.text.primary"),
    # Process accent (green)
    ("#10b981", "colors.process.primary"),
    # Signal warning (amber/orange/yellow tones)
    ("#f59e0b", "colors.signal.warning"),
    ("#fbbf24", "colors.signal.warning"),
    ("#eab308", "colors.signal.warning"),
    # Signal danger (red)
    ("#ef4444", "colors.signal.danger"),
]

# Apply both single-quoted and double-quoted variants.
for hex_value, token in mapping:
    src = src.replace(f"'{hex_value}'", token)
    src = src.replace(f'"{hex_value}"', token)

with open(path, "w") as f:
    f.write(src)

remaining = re.findall(r"#[0-9A-Fa-f]{3,6}", src)
print(f"Remaining hex literals: {len(remaining)}")
for r in remaining[:40]:
    print(f"  {r}")
