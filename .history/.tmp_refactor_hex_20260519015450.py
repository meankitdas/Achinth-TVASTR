#!/usr/bin/env python3
"""Refactor hard-coded hex literals to colors.* token references in JSX file."""
import re
import sys

path = sys.argv[1]
with open(path, "r") as f:
    src = f.read()

replacements = [
    ("'#0a0a0b'", "colors.background.primary"),
    ('"#0a0a0b"', "colors.background.primary"),
    ("'#10b981'", "colors.process.primary"),
    ('"#10b981"', "colors.process.primary"),
    ("'#f59e0b'", "colors.signal.warning"),
    ('"#f59e0b"', "colors.signal.warning"),
    ("'#fbbf24'", "colors.signal.warning"),
    ('"#fbbf24"', "colors.signal.warning"),
    ("'#eab308'", "colors.signal.warning"),
    ('"#eab308"', "colors.signal.warning"),
    ("'#ef4444'", "colors.signal.danger"),
    ('"#ef4444"', "colors.signal.danger"),
    ("'#a8a8b4'", "colors.text.muted"),
    ('"#a8a8b4"', "colors.text.muted"),
    ("'#888896'", "colors.text.muted"),
    ('"#888896"', "colors.text.muted"),
    ("'#686878'", "colors.text.muted"),
    ('"#686878"', "colors.text.muted"),
    ("'#c8c8d0'", "colors.text.muted"),
    ('"#c8c8d0"', "colors.text.muted"),
    ("'#fff'", "colors.background.primary"),
    ('"#fff"', "colors.background.primary"),
    ("'#000'", "colors.text.primary"),
    ('"#000"', "colors.text.primary"),
    ("'#e5e5e7'", "colors.text.primary"),
    ('"#e5e5e7"', "colors.text.primary"),
    ("'#12121a'", "colors.background.secondary"),
    ('"#12121a"', "colors.background.secondary"),
]

# First, special-case the gradient string before plain replacements eat individual hexes.
src = src.replace(
    "'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)'",
    "`linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.text.muted} 100%)`",
)
src = src.replace(
    '"linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)"',
    "`linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.text.muted} 100%)`",
)

for pattern, replacement in replacements:
    src = src.replace(pattern, replacement)

with open(path, "w") as f:
    f.write(src)

remaining = re.findall(r"#[0-9A-Fa-f]{3,6}", src)
print(f"Remaining hex literals: {len(remaining)}")
for r in remaining[:30]:
    print(f"  {r}")
