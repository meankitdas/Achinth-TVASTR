import os

content = (
    "export const colors = {\n"
    "  background: {\n"
    "    primary: '#ffffff',\n"
    "    secondary: '#f1f5ff',\n"
    "    elevated: '#ffffff',\n"
    "    panel: '#eeece7',\n"
    "  },\n"
    "  text: {\n"
    "    primary: '#212121',\n"
    "    secondary: '#616161',\n"
    "    muted: '#93939f',\n"
    "  },\n"
    "  telemetry: {\n"
    "    primary: '#1863dc',\n"
    "    secondary: '#4c6ee6',\n"
    "    muted: '#071829',\n"
    "  },\n"
    "  process: {\n"
    "    primary: '#003c33',\n"
    "    secondary: '#75758a',\n"
    "  },\n"
    "  signal: {\n"
    "    warning: '#b45309',\n"
    "    glow: '#ff7759',\n"
    "    danger: '#b30000',\n"
    "  },\n"
    "  border: {\n"
    "    subtle: 'rgba(0, 0, 0, 0.05)',\n"
    "    default: 'rgba(0, 0, 0, 0.10)',\n"
    "    strong: 'rgba(0, 0, 0, 0.15)',\n"
    "  },\n"
    "}\n"
    "\n"
    "export const semantic = {\n"
    "  brand: '#1863dc',\n"
    "  alert: '#b45309',\n"
    "  danger: '#b30000',\n"
    "}\n"
)

target = os.path.join(os.path.dirname(__file__), "..", "src", "design", "colors.js")
with open(target, "w") as f:
    f.write(content)

print("wrote", os.path.abspath(target))
