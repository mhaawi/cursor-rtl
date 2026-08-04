# Changelog

All notable changes to **Cursor RTL** are documented in this file.

## [1.1.2] - 2026-08-04

### Improved

- Smarter mixed-direction detection (Arabic + English + numbers + symbols) using first-strong character with technical-token downweighting
- Cleaner CSS for mixed RTL paragraphs: plaintext bidi, isolated LTR islands for links/code/mentions
- Broader Agents Window (Glass) selectors without over-applying `dir` on layout wrappers
- Unit tests for direction scoring (`npm run test:direction`)

## [1.1.1] - 2026-08-04

### Fixed

- Ensure Enable/Re-apply copies `rtl.js` beside Cursor `main.js` so Agents Window injection does not depend on extension path lookup
- Harden loader: `webContents` sweep, longer fallbacks, and clearer injection logs for Glass/Agents Window

## [1.1.0] - 2026-08-04

### Added

- RTL support for Cursor 3 Agents Window (Glass workspace UI)
- Injection coverage via Electron `web-contents-created`
- Lexical editor class selectors used by Agents Window chat

## [1.0.0] - 2026-06-19

### Added

- Automatic RTL text direction in Cursor Agent chat and Composer
- Per-element RTL/LTR detection for mixed content
- Code blocks remain LTR
- Status bar indicator with quick actions
- Auto re-apply patch after Cursor updates
- Safe backup of `main.js` before patching

[1.1.0]: https://github.com/mhaawi/cursor-rtl/releases/tag/v1.1.0
[1.0.0]: https://github.com/mhaawi/cursor-rtl/releases/tag/v1.0.0
