# Cursor RTL

<p align="center">
  <strong>عرض تلقائي للنصوص من اليمين لليسار في محادثة Cursor</strong><br>
  <strong>Automatic right-to-left text display in Cursor chat</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version"></a>
</p>

---

## Overview

**Cursor RTL** automatically detects RTL (right-to-left) text in Agent chat and Composer, and applies proper text direction — while keeping code blocks in LTR.

## Features

- Automatic RTL detection per message element
- Mixed RTL + LTR content in the same conversation
- Code blocks always stay LTR
- Status bar indicator (`✓ RTL`)
- Auto re-apply after Cursor updates
- Safe backup before modifying Cursor files

## Requirements

- **Cursor IDE** (not VS Code)
- Windows, macOS, or Linux
- Administrator privileges may be required on Windows during first enable

## Installation

1. Download [`cursor-rtl-1.0.0.vsix`](https://github.com/malek-yaseen/cursor-rtl/releases/latest)
2. Cursor → **Extensions** (`Ctrl+Shift+X`) → `...` → **Install from VSIX...**
3. Command Palette → **Cursor RTL: Enable**
4. **Restart Cursor completely**

### Build from source

```bash
git clone https://github.com/malek-yaseen/cursor-rtl.git
cd cursor-rtl
npm install
npm run package
```

## Usage

After enabling and restarting:

1. Open Agent chat or Composer
2. Write in any RTL language
3. Text automatically aligns right-to-left

### Status Bar

| Indicator | Meaning |
|-----------|---------|
| `✓ RTL` | Active |
| `⊘ RTL` | Not enabled |
| `⚠ RTL` | Re-apply needed after Cursor update |

## Commands

| Command | Description |
|---------|-------------|
| `Cursor RTL: Enable` | Apply RTL patch |
| `Cursor RTL: Disable` | Restore original files |
| `Cursor RTL: Status` | Check current state |
| `Cursor RTL: Re-apply After Update` | Re-apply after Cursor update |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `cursorRtl.autoReapply` | `true` | Auto re-apply after Cursor updates |
| `cursorRtl.showStatusBar` | `true` | Show status bar indicator |

## How It Works

1. Creates a backup of Cursor's `main.js`
2. Injects a one-line loader into `main.js`
3. Loader injects `rtl.js` into the workbench on startup
4. `rtl.js` scans chat DOM and sets `dir="rtl"` or `dir="ltr"` per element

> **Note:** This extension modifies Cursor application files. Use **Disable** before uninstalling.

## Troubleshooting

**Permission denied (Windows)** — Run Cursor as Administrator, then **Enable** again.

**RTL stopped after Cursor update** — Run **Re-apply After Update**, or enable `cursorRtl.autoReapply`.

## Uninstall

1. **Cursor RTL: Disable**
2. Restart Cursor
3. Uninstall from Extensions panel

## Development

```bash
npm install
npm run watch
npm run lint
npm run package
```

## Author

**Malek Yaseen** — [malek.m.yaseen@gmail.com](mailto:malek.m.yaseen@gmail.com)

## License

[MIT](LICENSE) — Copyright (c) 2026 Malek Yaseen
