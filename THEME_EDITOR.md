# Tvastr Website Theme Editor

Complete guide to the centralized design token system and visual theme editor.

---

## Overview

The Tvastr Theme Editor is a desktop application built with Python Tkinter that provides a visual interface for editing the website's color scheme. It reads and writes to `src/design/colors.js`, the single source of truth for all website colors.

**Key Features:**
- ✅ Visual color picker with live preview
- ✅ Sidebar category navigation
- ✅ Helpful descriptions for each color
- ✅ Export/import themes as JSON
- ✅ Real-time hex validation
- ✅ Industrial dark UI design

---

## Design Token Architecture

### The Token Flow

```
src/design/colors.js
        ↓
   (imported by)
        ↓
tailwind.config.js
        ↓
   (generates)
        ↓
Tailwind utility classes
(bg-*, text-*, border-*)
        ↓
   (used in)
        ↓
React components
```

**How It Works:**
1. `colors.js` exports color objects
2. `tailwind.config.js` imports these colors and maps them to Tailwind utilities
3. Components use Tailwind classes like `text-telemetry-primary` or `bg-signal-warning`
4. CSS variables in `src/index.css` provide fallback for non-Tailwind contexts

---

## File Structure: `src/design/`

The `src/design/` directory contains all centralized design tokens for the marketing website.

```
src/design/
├── colors.js        # 🎨 Single source of truth for colors (18 colors)
├── typography.js    # 📝 Font sizes, weights, line heights
├── spacing.js       # 📏 Consistent spacing values
├── shadows.js       # 🌑 Shadow presets
├── gradients.js     # 🌈 Gradient presets
└── index.js         # 📦 Unified export
```

### 1. `colors.js` (Editable via Theme Editor)

The most important file — contains 18 colors organized into 6 categories:

```javascript
export const colors = {
  background: {
    primary: '#0a0a0b',      // Main page background
    secondary: '#111113',    // Subtle section backgrounds
    elevated: '#1a1a1e',     // Cards and raised surfaces
    panel: '#222228',        // Sidebar and panel backgrounds
  },
  text: {
    primary: '#e2e4ea',      // Headings and important text
    secondary: '#c0c4ce',    // Body text and paragraphs
    muted: '#6b7080',        // Captions and subtle labels
  },
  telemetry: {
    primary: '#4f8cff',      // Main accent for links & buttons
    secondary: '#3b7aed',    // Hover states and variants
    muted: '#2563c4',        // Subdued accent elements
  },
  process: {
    primary: '#5bc4cc',      // Process diagrams main color
    secondary: '#4aafb8',    // Process diagram accents
  },
  signal: {
    warning: '#f59e0b',      // Alerts and warning indicators
    glow: '#fbbf24',         // Highlight and emphasis
    danger: '#ef4444',       // Errors and critical alerts
  },
  border: {
    subtle: 'rgba(142,147,161,0.12)',    // Faint dividers
    default: 'rgba(142,147,161,0.20)',   // Standard card borders
    strong: 'rgba(142,147,161,0.35)',    // Prominent borders
  },
}

// Semantic helpers for common use cases
export const semantic = {
  brand: '#4f8cff',        // Same as telemetry.primary
  alert: '#f59e0b',        // Same as signal.warning
  danger: '#ef4444',       // Same as signal.danger
}
```

**Usage in Tailwind:**
- `text-telemetry-primary` → `#4f8cff`
- `bg-signal-warning` → `#f59e0b`
- `border-border-default` → `rgba(142,147,161,0.20)`

---

### 2. `typography.js`

Font sizing and weight tokens for consistent typography:

```javascript
export const typography = {
  hero: {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: '800',              // Extrabold
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
    fontWeight: '700',              // Bold
    lineHeight: '1.15',
    letterSpacing: '-0.01em',
  },
  eyebrow: {
    fontSize: '0.6875rem',
    fontWeight: '600',              // Semibold
    letterSpacing: '0.2em',
    textTransform: 'uppercase',     // ALL CAPS
  },
  body: {
    fontSize: '1rem',
    fontWeight: '400',              // Regular
    lineHeight: '1.6',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: '500',              // Medium
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
}
```

**Where Used:**
- `hero` → Main page headlines ("Persistent Manufacturing Intelligence")
- `sectionTitle` → Section headings (h2 elements)
- `eyebrow` → Small labels above titles ("THE PROBLEM", "ARCHITECTURE")
- `body` → Paragraphs and descriptions
- `caption` → Footer text, metadata

---

### 3. `spacing.js`

Consistent spacing for sections, cards, and grids:

```javascript
export const spacing = {
  section: {
    y: '5rem',         // Vertical padding (mobile)
    yMd: '9rem',       // Vertical padding (desktop)
    x: '1.5rem',       // Horizontal padding (mobile)
    xMd: '3rem',       // Horizontal padding (tablet)
    xLg: '4rem',       // Horizontal padding (desktop)
  },
  card: {
    padding: '1.25rem',      // Card internal padding (mobile)
    paddingMd: '1.5rem',     // Card internal padding (desktop)
    gap: '1rem',             // Space between card elements
  },
  grid: {
    gap: '1rem',             // Grid gap (mobile)
    gapMd: '1.5rem',         // Grid gap (tablet)
    gapLg: '2rem',           // Grid gap (desktop)
  },
}
```

---

### 4. `shadows.js`

Shadow presets for depth and elevation:

```javascript
export const shadows = {
  panel: '0 1px 3px rgba(0,0,0,0.3)',              // Subtle card shadow
  elevated: '0 4px 12px rgba(0,0,0,0.35)',         // Modal/dropdown shadow
  overlay: '0 8px 24px rgba(0,0,0,0.5)',           // Heavy overlay shadow
  glow: '0 0 8px rgba(79,140,255,0.06)',           // Telemetry blue glow
  signalGlow: '0 0 8px rgba(245,158,11,0.08)',     // Amber warning glow
}
```

---

### 5. `gradients.js`

Pre-defined gradient presets:

```javascript
export const gradients = {
  telemetry: 'linear-gradient(135deg, #4f8cff 0%, #2563c4 100%)',
  process: 'linear-gradient(135deg, #5bc4cc 0%, #3a8f97 100%)',
  signal: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
  heroRadial: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,140,255,0.03) 0%, transparent 70%)',
  fadeToBase: 'linear-gradient(to bottom, transparent 0%, #0a0a0b 100%)',
}
```

**Where Used:**
- `heroRadial` → Subtle blue glow behind hero section
- `fadeToBase` → Smooth transitions between sections
- `telemetry`/`process`/`signal` → Text gradients and accent elements

---

### 6. `index.js`

Unified export for all design tokens:

```javascript
export { colors, semantic } from './colors'
export { typography } from './typography'
export { spacing } from './spacing'
export { shadows } from './shadows'
export { gradients } from './gradients'
```

**Usage in Components:**
```javascript
import { colors, typography, spacing } from '@/design'
```

---

## Color Categories Explained

### 🎨 Background (4 colors)
**What it affects:** Page backgrounds, cards, panels, sidebars

- **Primary** — Main dark page background (`#0a0a0b`)
- **Secondary** — Slightly lighter sections for subtle distinction
- **Elevated** — Card backgrounds and raised surfaces
- **Panel** — Sidebar and modal backgrounds

**Examples:** Hero section background, feature cards, navigation sidebar

---

### 📝 Text (3 colors)
**What it affects:** All text content across the site

- **Primary** — Headlines, titles, important text (`#e2e4ea` light gray)
- **Secondary** — Body paragraphs, descriptions (`#c0c4ce` medium gray)
- **Muted** — Captions, metadata, subtle labels (`#6b7080` dim gray)

**Examples:** Page titles, feature descriptions, footer text

---

### 🔗 Telemetry (3 colors)
**What it affects:** Marketing website accent color (links, buttons, highlights)

- **Primary** — Main brand accent (`#4f8cff` blue)
- **Secondary** — Hover states, pressed states
- **Muted** — Subdued accent for less emphasis

**Examples:** CTA buttons, navigation links, icon accents, PORTAL button

---

### ⚙️ Process (2 colors)
**What it affects:** Process diagrams, analytics visualizations

- **Primary** — Main process color (`#5bc4cc` cyan)
- **Secondary** — Process diagram accents

**Examples:** Conveyor belt animations, flow diagrams, system architecture visuals

---

### ⚠️ Signal (3 colors)
**What it affects:** Alerts, warnings, errors, status indicators

- **Warning** — Alert indicators (`#f59e0b` amber) — **Portal pages use this as accent**
- **Glow** — Emphasis and highlights (`#fbbf24` bright amber)
- **Danger** — Error states, critical alerts (`#ef4444` red)

**Examples:** Error messages, alert banners, validation indicators, portal accent color

---

### 📐 Border (3 colors)
**What it affects:** Card edges, dividers, separators

- **Subtle** — Very faint borders (`rgba(142,147,161,0.12)`)
- **Default** — Standard card borders (`rgba(142,147,161,0.20)`)
- **Strong** — Prominent borders for emphasis (`rgba(142,147,161,0.35)`)

**Examples:** Feature card borders, section dividers, input field borders

---

## Using the Theme Editor

### Installation & Launch

**Requirements:**
- Python 3.11+
- Tkinter (usually included with Python)

**Launch Command:**
```bash
python tools/theme_editor.py
```

---

### Interface Walkthrough

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR: Tvastr Website Theme Editor    [Export][Import][Reset][Save] │
├──────────┬──────────────────────────────────────┬──────────────┤
│          │                                      │              │
│ SIDEBAR  │        EDITOR PANEL                  │   PREVIEW    │
│          │                                      │              │
│ • Backgr │  Background Colors                   │   ┌────────┐ │
│ • Text   │  Page backgrounds, cards, surfaces   │   │ TVASTR │ │
│ • Teleme │                                      │   └────────┘ │
│ • Proces │  ┌──────────────┐ ┌──────────────┐   │              │
│ • Signal │  │  Primary     │ │  Secondary   │   │   Hero Text  │
│ • Border │  │  #0a0a0b     │ │  #111113     │   │              │
│          │  │  [████████]  │ │  [████████]  │   │   Cards      │
│          │  │  Pick Color  │ │  Pick Color  │   │              │
│          │  └──────────────┘ └──────────────┘   │              │
│          │                                      │              │
└──────────┴──────────────────────────────────────┴──────────────┘
```

---

### Step-by-Step Usage

#### 1. **Select a Category**
Click a category in the left sidebar:
- Background
- Text
- Telemetry
- Process
- Signal
- Border

The editor panel shows all colors in that category.

---

#### 2. **Edit a Color**

**Method A: Color Picker**
1. Click the large color swatch (square preview)
2. Use the system color picker to select a new color
3. The swatch and hex field update instantly

**Method B: Type Hex Code**
1. Click in the hex input field
2. Type a 6-digit hex code (e.g., `#4f8cff`)
3. Press **Enter** to apply
4. Invalid codes show a warning

---

#### 3. **Preview Changes**
The right panel shows a live preview of how colors look together:
- Navbar with logo and navigation
- Hero section with title text
- Sample cards with different accents

---

#### 4. **Save Theme**
Click **Save** in the top toolbar:
- Writes changes to `src/design/colors.js`
- Shows confirmation message
- Updates become the new baseline

---

#### 5. **Reset Changes**
Click **Reset** to revert all unsaved edits back to the last saved state.

---

### Export / Import Themes

#### Export Theme
1. Click **Export** button
2. Choose a save location
3. Saves as `.json` file with all color values

**Example JSON:**
```json
{
  "background.primary": "#0a0a0b",
  "text.primary": "#e2e4ea",
  "telemetry.primary": "#4f8cff",
  ...
}
```

---

#### Import Theme
1. Click **Import** button
2. Select a `.json` theme file
3. Colors update instantly in the editor
4. Click **Save** to persist changes

**Use Cases:**
- Share themes with team members
- Test alternative color schemes
- Quick theme switching
- Backup before major changes

---

## Technical Implementation

### How the Editor Works

1. **Parse colors.js** → Reads the file, extracts hex values using regex
2. **Build UI** → Creates Tkinter widgets for each color
3. **User edits** → Updates internal color dictionary
4. **Save** → Writes back to `colors.js` preserving file structure

### Key Python Components

```python
# Parse colors from JavaScript file
def parse_colors_file(filepath):
    # Regex matches: key: '#hexval'
    # Returns: {'background.primary': '#0a0a0b', ...}

# Save colors back to file
def save_colors_file(filepath, color_map):
    # Uses regex replacement to update hex values in-place
    # Preserves comments, formatting, structure
```

### Color Validation

All hex codes are validated with regex:
```python
if re.match(r'^#[0-9a-fA-F]{6}$', value):
    # Valid hex code
```

Only standard 6-digit hex codes are supported (no 3-digit or 8-digit).

---

## Integration with Tailwind CSS

### How Colors Flow to Components

**1. Define in `colors.js`:**
```javascript
telemetry: { primary: '#4f8cff' }
```

**2. Import in `tailwind.config.js`:**
```javascript
import { colors } from './src/design/colors.js'

export default {
  theme: {
    extend: {
      colors: {
        telemetry: colors.telemetry,  // Maps to Tailwind utilities
      }
    }
  }
}
```

**3. Use in Components:**
```jsx
<button className="bg-telemetry-primary text-white">
  Click Me
</button>
```

**4. Tailwind Generates:**
```css
.bg-telemetry-primary { background-color: #4f8cff; }
.text-telemetry-primary { color: #4f8cff; }
.border-telemetry-primary { border-color: #4f8cff; }
```

---

## CSS Variables (Fallback)

For non-Tailwind contexts, colors are also defined as CSS custom properties in `src/index.css`:

```css
:root {
  --bg-primary: #0a0a0b;
  --text-primary: #e2e4ea;
  --telemetry-primary: #4f8cff;
  /* ... */
}
```

**Usage in inline styles:**
```jsx
<div style={{ background: 'var(--bg-primary)' }}>
  Content
</div>
```

**Why Both?**
- **Tailwind** → Preferred for components (type-safe, autocomplete)
- **CSS Variables** → Fallback for dynamic styles, animations, third-party components

---

## Troubleshooting

### Theme Editor Won't Launch

**Error:** `ModuleNotFoundError: No module named 'tkinter'`

**Solution (Windows):**
```bash
# Tkinter usually comes with Python
# If missing, reinstall Python with "tcl/tk and IDLE" checked
```

**Solution (macOS):**
```bash
brew install python-tk
```

**Solution (Linux):**
```bash
sudo apt-get install python3-tk
```

---

### Colors Not Updating on Website

**Issue:** Saved colors in theme editor, but website still shows old colors.

**Solution:**
1. **Restart dev server:** Vite needs to rebuild Tailwind config
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache:** Hard refresh (`Ctrl+Shift+R`)

3. **Check file saved:** Verify `src/design/colors.js` has new values

---

### Invalid Hex Code Error

**Issue:** Typed a color but got "Invalid hex color" warning.

**Common Mistakes:**
- ❌ `4f8cff` (missing #)
- ❌ `#4f8` (too short, need 6 digits)
- ❌ `#4f8cffaa` (too long, 8-digit not supported)
- ✅ `#4f8cff` (correct format)

---

### Preview Not Matching Website

**Issue:** Live preview colors look different from actual website.

**Explanation:** The preview is simplified and doesn't reflect all website complexities (gradients, opacity, hover states, etc.). It's meant to show general color relationships, not pixel-perfect accuracy.

**Solution:** Always test on the actual website after saving (`npm run dev`).

---

## Best Practices

### 1. Test Before Committing
```bash
# 1. Edit colors in theme editor
# 2. Save
# 3. Restart dev server
npm run dev
# 4. Browse all pages (Home, Technology, About, Portal)
# 5. Verify readability and contrast
# 6. Commit if satisfied
```

---

### 2. Export Backup Before Major Changes
```bash
# Click Export button → Save as backup_YYYY-MM-DD.json
# If changes don't work, Import the backup
```

---

### 3. Maintain Contrast Ratios
- **Text Primary on Background Primary:** Minimum 7:1 contrast (WCAG AAA)
- **Text Secondary on Background Primary:** Minimum 4.5:1 contrast (WCAG AA)
- **Accent Colors:** Should be clearly distinguishable from background

**Check contrast:** https://webaim.org/resources/contrastchecker/

---

### 4. Semantic Consistency
- **Telemetry** = Marketing accent (use for CTAs, links, highlights)
- **Signal.Warning** = Portal accent + alerts (amber for attention-grabbing)
- **Signal.Danger** = Errors only (red for critical issues)

**Don't mix these accidentally** — telemetry is for "click here" actions, signal is for "pay attention" alerts.

---

### 5. Document Custom Changes
If you create a custom theme variant:
```json
// themes/dark-mode-custom.json
{
  "background.primary": "#000000",
  "telemetry.primary": "#6ea3ff",
  "signal.warning": "#ffb347"
}
```

Add a note in this document or create a `themes/README.md` explaining the use case.

---

## Summary

The Tvastr Theme Editor provides a user-friendly interface for managing the website's visual identity. By centralizing colors in `src/design/colors.js` and editing them through a dedicated tool, you ensure:

✅ **Consistency** — One source of truth for all colors  
✅ **Efficiency** — No hunting through files to find hex codes  
✅ **Safety** — Validation prevents invalid colors  
✅ **Portability** — Export/import themes for easy sharing  
✅ **Maintainability** — Clear structure, well-documented  

**Remember:** The theme editor only modifies `colors.js`. Other design tokens (typography, spacing, shadows, gradients) are edited manually in their respective files.

---

## Quick Reference

| File | Purpose | Editable Via Tool |
|------|---------|-------------------|
| `src/design/colors.js` | All colors | ✅ Yes (Theme Editor) |
| `src/design/typography.js` | Font sizes/weights | ❌ No (edit manually) |
| `src/design/spacing.js` | Spacing values | ❌ No (edit manually) |
| `src/design/shadows.js` | Shadow presets | ❌ No (edit manually) |
| `src/design/gradients.js` | Gradient presets | ❌ No (edit manually) |
| `src/design/index.js` | Unified export | ❌ No (auto-export) |
| `tailwind.config.js` | Tailwind integration | ❌ No (imports colors.js) |
| `src/index.css` | CSS variables | ❌ No (manually synced) |

---

## Support

**Issues?** Check the troubleshooting section above.

**Feature Requests?** The editor can be extended to support:
- Typography editing
- Spacing presets
- Gradient builder
- Real-time preview updates
- Theme templates

**Contact:** Open an issue or discuss with the development team.

---

**Last Updated:** May 18, 2026  
**Version:** 1.0.0
