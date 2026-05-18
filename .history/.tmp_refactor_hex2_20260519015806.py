#!/usr/bin/env python3
"""Second pass: convert template-style strings containing a hex (e.g. '1px solid #e2e8f0')
into JS template literals referencing colors.* tokens."""
import re
import sys

path = sys.argv[1]
with open(path, "r") as f:
    src = f.read()

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

# Replace any quoted string that contains at least one hex literal with a JS template
# literal of the same content, replacing each `#hex` with `${colors.x.y}`.
hex_re = re.compile(r"#[0-9A-Fa-f]{3,6}")
str_re = re.compile(r'(["\'])([^"\']*#[0-9A-Fa-f]{3,6}[^"\']*)\1')


def replace_string_literal(match):
    content = match.group(2)
    # Walk through hex matches and substitute with template-literal placeholders.
    new_content = ""
    last = 0
    for m in hex_re.finditer(content):
        new_content += content[last : m.start()]
        token = mapping.get(m.group(0).lower())
        if token is None:
            return match.group(0)  # Bail out untouched if any hex unknown.
        new_content += "${" + token + "}"
        last = m.end()
    new_content += content[last:]
    return "`" + new_content + "`"


src = str_re.sub(replace_string_literal, src)

with open(path, "w") as f:
    f.write(src)

remaining = re.findall(r"#[0-9A-Fa-f]{3,6}", src)
print(f"Remaining hex literals: {len(remaining)}")
for r in remaining[:40]:
    print(f"  {r}")
