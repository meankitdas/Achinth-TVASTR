#!/usr/bin/env python3
"""Refactor hard-coded hex literals to colors.* token references in JSX file.

Handles three kinds of occurrences:
 1. JSX attributes: `attribute="#hex"` -> `attribute={colors.x.y}`
 2. Object/style values: `key: '#hex'` or `key: "#hex"` -> `key: colors.x.y`
 3. Multi-stop gradient strings inside JS strings (special-cased pairs below).

Mapping rules (Light_Theme tokens):
  background.primary  = #ffffff
  background.secondary = #f1f5ff
  background.panel    = #eeece7
  text.primary        = #212121
  text.muted          = #93939f
  telemetry.primary   = #1863dc
  process.primary     = #003c33
  signal.warning      = #b45309
  signal.danger       = #b30000
"""
import re
import sys

path = sys.argv[1]
with open(path, "r") as f:
    src = f.read()

# 0. Special-case multi-color gradient strings BEFORE generic replacements.
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

# Hex -> token mapping (apply most-specific token for each color's intent).
mapping = {
    "#0a0a0b": "colors.background.primary",
    "#12121a": "colors.background.secondary",
    "#ffffff": "colors.background.primary",
    "#fff": "colors.background.primary",
    "#f0f9ff": "colors.background.secondary",
    "#f8fafc": "colors.background.panel",
    "#fafafa": "colors.background.panel",
    "#fef3c7": "colors.background.panel",
    "#e5e7eb": "colors.border.default",
    "#e2e8f0": "colors.border.default",
    "#bae6fd": "colors.border.default",
    "#fde68a": "colors.border.default",
    "#94a3b8": "colors.text.muted",
    "#cbd5e1": "colors.text.muted",
    "#a8a8b4": "colors.text.muted",
    "#888896": "colors.text.muted",
    "#686878": "colors.text.muted",
    "#c8c8d0": "colors.text.muted",
    "#111827": "colors.text.primary",
    "#212121": "colors.text.primary",
    "#000000": "colors.text.primary",
    "#000": "colors.text.primary",
    "#e5e5e7": "colors.text.primary",
    "#10b981": "colors.process.primary",
    "#f59e0b": "colors.signal.warning",
    "#fbbf24": "colors.signal.warning",
    "#eab308": "colors.signal.warning",
    "#ef4444": "colors.signal.danger",
}


def replace_jsx_attribute(match):
    name = match.group(1)
    hex_val = match.group(2).lower()
    token = mapping.get(hex_val)
    if token is None:
        return match.group(0)
    return f"{name}={{{token}}}"


# 1. JSX attributes `attribute="#hex"` -> `attribute={tokens.x.y}`.
#    Only matches inside opening JSX tags (heuristic: attribute name preceded by whitespace).
attr_re = re.compile(r'(\s[a-zA-Z][a-zA-Z0-9-]*)="(#[0-9A-Fa-f]{3,6})"')
src = attr_re.sub(replace_jsx_attribute, src)

# 2. Plain quoted hex literals `'#hex'` and `"#hex"` -> bare token reference.
for hex_value, token in mapping.items():
    src = src.replace(f"'{hex_value}'", token)
    src = src.replace(f'"{hex_value}"', token)

with open(path, "w") as f:
    f.write(src)

remaining = re.findall(r"#[0-9A-Fa-f]{3,6}", src)
print(f"Remaining hex literals: {len(remaining)}")
for r in remaining[:40]:
    print(f"  {r}")
