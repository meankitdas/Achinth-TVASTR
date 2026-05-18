"""
Tvastr Website Theme Editor

Improved industrial-style Tkinter theme editor for website-only visual tokens.

Features:
- Sidebar category navigation
- Large live preview panel
- Card-based color controls
- Modern industrial UI styling
- Theme export/import
- Color picker support
- Centralized editing for src/design/colors.js

Usage:
python tools/theme_editor.py
"""

import tkinter as tk
from tkinter import colorchooser, messagebox, filedialog
import re
import os
import json

COLORS_FILE = os.path.join(
    os.path.dirname(__file__), '..', 'src', 'design', 'colors.js'
)

# -----------------------------
# UI COLORS
# -----------------------------

BG = '#0b0d10'
BG_SIDEBAR = '#111418'
BG_PANEL = '#161a20'
BG_CARD = '#1b2129'
BG_INPUT = '#232b35'
BG_HOVER = '#283240'

TEXT = '#e2e8f0'
TEXT_SECONDARY = '#94a3b8'
TEXT_MUTED = '#64748b'

ACCENT = '#4f8cff'
ACCENT_HOVER = '#3b7aed'

BORDER = '#2d3748'
BORDER_ACTIVE = '#4f8cff'

SUCCESS = '#22c55e'
WARNING = '#f59e0b'
DANGER = '#ef4444'

FONT = 'Inter'
MONO = 'JetBrains Mono'


# -----------------------------
# PARSER
# -----------------------------


def parse_colors_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    colors = {}
    current_group = None

    for line in content.split('\n'):
        group_match = re.match(r"\s+(\w+):\s*\{", line)
        if group_match:
            current_group = group_match.group(1)
            continue

        if current_group:
            color_match = re.match(
                r"\s+(\w+):\s*'(#[0-9a-fA-F]{6})'",
                line
            )

            if color_match:
                key = color_match.group(1)
                value = color_match.group(2)
                path = f"{current_group}.{key}"
                colors[path] = value

    return colors



def save_colors_file(filepath, color_map):
    with open(filepath, 'r') as f:
        content = f.read()

    for path, new_value in color_map.items():
        group, key = path.split('.')

        pattern = rf"(\s+{key}:\s*)'#[0-9a-fA-F]{{6}}'"
        replacement = rf"\g<1>'{new_value}'"

        content = re.sub(pattern, replacement, content, count=1)

    with open(filepath, 'w') as f:
        f.write(content)


# -----------------------------
# MAIN APP
# -----------------------------


class ThemeEditor:

    def __init__(self, root):
        self.root = root
        self.root.title('Tvastr Website Theme Editor')
        self.root.geometry('1180x760')
        self.root.configure(bg=BG)
        self.root.minsize(1100, 700)

        self.colors = parse_colors_file(COLORS_FILE)
        self.original_colors = dict(self.colors)

        self.entries = {}
        self.swatches = {}
        self.category_frames = {}
        self.preview_widgets = {}  # Store preview widgets for dynamic updates

        self.active_category = None

        self._build_layout()
        self._build_sidebar()
        self._build_editor()
        self._build_preview()
        self._populate_categories()

    # -----------------------------
    # LAYOUT
    # -----------------------------

    def _build_layout(self):

        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_columnconfigure(2, weight=1)
        self.root.grid_rowconfigure(1, weight=1)

        # Topbar
        self.topbar = tk.Frame(
            self.root,
            bg=BG_PANEL,
            height=64,
            highlightthickness=1,
            highlightbackground=BORDER
        )
        self.topbar.grid(row=0, column=0, columnspan=3, sticky='ew')

        self.title = tk.Label(
            self.topbar,
            text='Tvastr Website Theme Editor',
            font=(FONT, 16, 'bold'),
            fg=TEXT,
            bg=BG_PANEL
        )
        self.title.pack(side='left', padx=24)

        self.actions = tk.Frame(self.topbar, bg=BG_PANEL)
        self.actions.pack(side='right', padx=20)

        self._toolbar_button('Export', self._export_theme)
        self._toolbar_button('Import', self._import_theme)
        self._toolbar_button('Reset', self._reset)
        self._toolbar_button('Save', self._save, primary=True)

        # Sidebar
        self.sidebar = tk.Frame(
            self.root,
            bg=BG_SIDEBAR,
            width=180,
            highlightthickness=1,
            highlightbackground=BORDER
        )
        self.sidebar.grid(row=1, column=0, sticky='ns')
        self.sidebar.grid_propagate(False)

        # Editor
        self.editor_container = tk.Frame(self.root, bg=BG)
        self.editor_container.grid(row=1, column=1, sticky='nsew')

        # Preview
        self.preview_container = tk.Frame(
            self.root,
            bg=BG_PANEL,
            width=360,
            highlightthickness=1,
            highlightbackground=BORDER
        )
        self.preview_container.grid(row=1, column=2, sticky='nsew')

    # -----------------------------
    # TOOLBAR
    # -----------------------------

    def _toolbar_button(self, text, command, primary=False):

        bg = ACCENT if primary else BG_INPUT
        fg = BG if primary else TEXT

        btn = tk.Button(
            self.actions,
            text=text,
            command=command,
            bg=bg,
            fg=fg,
            activebackground=ACCENT_HOVER if primary else BG_HOVER,
            activeforeground=TEXT,
            relief='flat',
            padx=18,
            pady=8,
            cursor='hand2',
            font=(FONT, 10, 'bold'),
            highlightthickness=0,
            bd=0
        )

        btn.pack(side='left', padx=6)

    # -----------------------------
    # SIDEBAR
    # -----------------------------

    def _build_sidebar(self):

        heading = tk.Label(
            self.sidebar,
            text='CATEGORIES',
            font=(FONT, 10, 'bold'),
            fg=TEXT_SECONDARY,
            bg=BG_SIDEBAR,
            anchor='w'
        )
        heading.pack(fill='x', padx=18, pady=(24, 12))

        self.sidebar_buttons = {}

    def _populate_categories(self):

        groups = []

        for path in self.colors.keys():
            group = path.split('.')[0]
            if group not in groups:
                groups.append(group)

        for group in groups:
            self._sidebar_button(group)
            self._create_category(group)

        if groups:
            self._show_category(groups[0])

    def _sidebar_button(self, group):

        btn = tk.Button(
            self.sidebar,
            text=group.capitalize(),
            font=(FONT, 10),
            fg=TEXT,
            bg=BG_SIDEBAR,
            activebackground=BG_HOVER,
            activeforeground=TEXT,
            relief='flat',
            anchor='w',
            padx=18,
            pady=12,
            cursor='hand2',
            bd=0,
            command=lambda g=group: self._show_category(g)
        )

        btn.pack(fill='x', padx=10, pady=2)
        self.sidebar_buttons[group] = btn

    def _show_category(self, group):

        self.active_category = group

        for g, frame in self.category_frames.items():
            frame.pack_forget()

        for g, btn in self.sidebar_buttons.items():
            if g == group:
                btn.configure(bg=ACCENT, fg=BG)
            else:
                btn.configure(bg=BG_SIDEBAR, fg=TEXT)

        self.category_frames[group].pack(fill='both', expand=True)

    # -----------------------------
    # EDITOR
    # -----------------------------

    def _build_editor(self):

        self.canvas = tk.Canvas(
            self.editor_container,
            bg=BG,
            highlightthickness=0
        )

        self.scrollbar = tk.Scrollbar(
            self.editor_container,
            orient='vertical',
            command=self.canvas.yview,
            bg=BG_PANEL,
            troughcolor=BG,
            activebackground=ACCENT,
            relief='flat'
        )

        self.scrollable_frame = tk.Frame(self.canvas, bg=BG)

        self.scrollable_frame.bind(
            '<Configure>',
            lambda e: self.canvas.configure(
                scrollregion=self.canvas.bbox('all')
            )
        )

        self.canvas.create_window(
            (0, 0),
            window=self.scrollable_frame,
            anchor='nw'
        )

        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        self.canvas.pack(side='left', fill='both', expand=True)
        self.scrollbar.pack(side='right', fill='y')

    def _create_category(self, group):

        frame = tk.Frame(self.scrollable_frame, bg=BG)
        self.category_frames[group] = frame

        # Category-specific descriptions
        descriptions = {
            'background': 'Page backgrounds, cards, and surface colors',
            'text': 'All text colors: titles, paragraphs, and labels',
            'telemetry': 'Marketing website accents, links, and CTA buttons',
            'process': 'Process flow diagrams and analytics visualizations',
            'signal': 'Warnings, alerts, and error indicators',
            'border': 'Card edges, dividers, and separators'
        }

        title = tk.Label(
            frame,
            text=f'{group.capitalize()} Colors',
            font=(FONT, 18, 'bold'),
            fg=TEXT,
            bg=BG,
            anchor='w'
        )
        title.pack(fill='x', padx=24, pady=(24, 4))

        subtitle = tk.Label(
            frame,
            text=descriptions.get(group, 'Adjust visual colors for the website.'),
            font=(FONT, 10),
            fg=TEXT_MUTED,
            bg=BG,
            anchor='w'
        )
        subtitle.pack(fill='x', padx=24, pady=(0, 24))

        grid = tk.Frame(frame, bg=BG)
        grid.pack(fill='both', expand=True, padx=20)

        grid.grid_columnconfigure(0, weight=1)
        grid.grid_columnconfigure(1, weight=1)

        row = 0
        col = 0

        for path, value in self.colors.items():
            if path.startswith(group + '.'):
                card = self._create_color_card(grid, path, value)
                card.grid(row=row, column=col, sticky='nsew', padx=10, pady=10)

                col += 1
                if col > 1:
                    col = 0
                    row += 1

    def _create_color_card(self, parent, path, value):

        key = path.split('.')[1]
        group = path.split('.')[0]

        # Helpful descriptions for each color
        usage_hints = {
            'background.primary': 'Main page background',
            'background.secondary': 'Subtle section backgrounds',
            'background.elevated': 'Cards and raised surfaces',
            'background.panel': 'Sidebar and panel backgrounds',
            'text.primary': 'Headings and important text',
            'text.secondary': 'Body text and paragraphs',
            'text.muted': 'Captions and subtle labels',
            'telemetry.primary': 'Main accent for links & buttons',
            'telemetry.secondary': 'Hover states and variants',
            'telemetry.muted': 'Subdued accent elements',
            'process.primary': 'Process diagrams main color',
            'process.secondary': 'Process diagram accents',
            'signal.warning': 'Alerts and warning indicators',
            'signal.glow': 'Highlight and emphasis',
            'signal.danger': 'Errors and critical alerts',
            'border.subtle': 'Faint dividers',
            'border.default': 'Standard card borders',
            'border.strong': 'Prominent borders'
        }

        card = tk.Frame(
            parent,
            bg=BG_CARD,
            highlightthickness=1,
            highlightbackground=BORDER,
            padx=18,
            pady=18
        )

        label = tk.Label(
            card,
            text=key.replace('_', ' ').title(),
            font=(FONT, 11, 'bold'),
            fg=TEXT,
            bg=BG_CARD,
            anchor='w'
        )
        label.pack(fill='x')

        # Usage hint
        hint_text = usage_hints.get(path, '')
        if hint_text:
            hint = tk.Label(
                card,
                text=hint_text,
                font=(FONT, 9),
                fg=TEXT_MUTED,
                bg=BG_CARD,
                anchor='w'
            )
            hint.pack(fill='x', pady=(2, 0))

        preview = tk.Frame(
            card,
            bg=value,
            height=48,
            highlightthickness=1,
            highlightbackground=BORDER
        )
        preview.pack(fill='x', pady=14)

        preview.bind(
            '<Button-1>',
            lambda e, p=path: self._pick_color(p)
        )

        self.swatches[path] = preview

        entry = tk.Entry(
            card,
            font=(MONO, 10),
            fg=TEXT,
            bg=BG_INPUT,
            insertbackground=TEXT,
            relief='flat',
            highlightthickness=1,
            highlightbackground=BORDER,
            bd=0
        )

        entry.insert(0, value)
        entry.pack(fill='x', pady=(0, 12), ipady=8)

        entry.bind(
            '<Return>',
            lambda e, p=path: self._update_from_entry(p)
        )

        self.entries[path] = entry

        btn = tk.Button(
            card,
            text='Pick Color',
            command=lambda p=path: self._pick_color(p),
            bg=BG_INPUT,
            fg=TEXT,
            activebackground=BG_HOVER,
            activeforeground=TEXT,
            relief='flat',
            cursor='hand2',
            pady=8,
            bd=0,
            font=(FONT, 9, 'bold')
        )

        btn.pack(fill='x')

        return card

    # -----------------------------
    # PREVIEW
    # -----------------------------

    def _build_preview(self):

        heading = tk.Label(
            self.preview_container,
            text='LIVE PREVIEW',
            font=(FONT, 11, 'bold'),
            fg=TEXT_SECONDARY,
            bg=BG_PANEL,
            anchor='w'
        )
        heading.pack(fill='x', padx=20, pady=(20, 16))

        self.preview_card = tk.Frame(
            self.preview_container,
            bg='#111113',
            highlightthickness=1,
            highlightbackground=BORDER
        )
        self.preview_card.pack(fill='both', expand=True, padx=20, pady=(0, 20))

        # Navbar
        navbar = tk.Frame(self.preview_card, bg='#0a0a0b', height=58)
        navbar.pack(fill='x')
        navbar.pack_propagate(False)

        logo = tk.Label(
            navbar,
            text='TVASTR',
            font=(FONT, 12, 'bold'),
            fg=WARNING,
            bg='#0a0a0b'
        )
        logo.pack(side='left', padx=16)

        nav_btn = tk.Label(
            navbar,
            text='Technology',
            font=(FONT, 10),
            fg=ACCENT,
            bg='#0a0a0b'
        )
        nav_btn.pack(side='right', padx=16)

        # Hero
        hero = tk.Frame(self.preview_card, bg='#111113')
        hero.pack(fill='x', padx=18, pady=18)

        hero_title = tk.Label(
            hero,
            text='Persistent Manufacturing Intelligence',
            font=(FONT, 18, 'bold'),
            fg=TEXT,
            bg='#111113',
            justify='left',
            wraplength=280,
            anchor='w'
        )
        hero_title.pack(fill='x')

        hero_sub = tk.Label(
            hero,
            text='Inspection, traceability, and process intelligence.',
            font=(FONT, 10),
            fg=TEXT_SECONDARY,
            bg='#111113',
            justify='left',
            wraplength=280,
            anchor='w'
        )
        hero_sub.pack(fill='x', pady=(8, 0))

        # Sample cards
        cards = tk.Frame(self.preview_card, bg='#111113')
        cards.pack(fill='both', expand=True, padx=18, pady=10)

        self._preview_stat_card(cards, 'Telemetry', ACCENT)
        self._preview_stat_card(cards, 'Process', '#5bc4cc')
        self._preview_stat_card(cards, 'Alert', WARNING)

    def _preview_stat_card(self, parent, title, color):

        card = tk.Frame(
            parent,
            bg='#1a1a1e',
            highlightthickness=1,
            highlightbackground=BORDER,
            pady=14
        )
        card.pack(fill='x', pady=8)

        dot = tk.Frame(card, bg=color, width=12, height=12)
        dot.pack(side='left', padx=14)
        dot.pack_propagate(False)

        label = tk.Label(
            card,
            text=title,
            font=(FONT, 10, 'bold'),
            fg=TEXT,
            bg='#1a1a1e'
        )
        label.pack(side='left')

    # -----------------------------
    # ACTIONS
    # -----------------------------

    def _pick_color(self, path):

        current = self.colors[path]

        result = colorchooser.askcolor(
            color=current,
            title=f'Pick color for {path}'
        )

        if result[1]:
            self.colors[path] = result[1]

            self.entries[path].delete(0, tk.END)
            self.entries[path].insert(0, result[1])

            self.swatches[path].configure(bg=result[1])

    def _update_from_entry(self, path):

        value = self.entries[path].get().strip()

        if re.match(r'^#[0-9a-fA-F]{6}$', value):
            self.colors[path] = value
            self.swatches[path].configure(bg=value)
        else:
            messagebox.showwarning(
                'Invalid Color',
                f'{value} is not a valid hex color.'
            )

    def _save(self):

        for path, entry in self.entries.items():
            value = entry.get().strip()

            if re.match(r'^#[0-9a-fA-F]{6}$', value):
                self.colors[path] = value

        save_colors_file(COLORS_FILE, self.colors)

        self.original_colors = dict(self.colors)

        messagebox.showinfo(
            'Saved',
            'Theme colors saved successfully.'
        )

    def _reset(self):

        self.colors = dict(self.original_colors)

        for path, value in self.colors.items():
            self.entries[path].delete(0, tk.END)
            self.entries[path].insert(0, value)
            self.swatches[path].configure(bg=value)

    def _export_theme(self):

        path = filedialog.asksaveasfilename(
            defaultextension='.json',
            filetypes=[('JSON Files', '*.json')]
        )

        if path:
            with open(path, 'w') as f:
                json.dump(self.colors, f, indent=2)

            messagebox.showinfo('Exported', 'Theme exported successfully.')

    def _import_theme(self):

        path = filedialog.askopenfilename(
            filetypes=[('JSON Files', '*.json')]
        )

        if not path:
            return

        with open(path, 'r') as f:
            imported = json.load(f)

        for path_key, value in imported.items():
            if path_key in self.colors:
                self.colors[path_key] = value

                self.entries[path_key].delete(0, tk.END)
                self.entries[path_key].insert(0, value)

                self.swatches[path_key].configure(bg=value)


# -----------------------------
# ENTRY
# -----------------------------


if __name__ == '__main__':

    root = tk.Tk()

    app = ThemeEditor(root)

    root.mainloop()
