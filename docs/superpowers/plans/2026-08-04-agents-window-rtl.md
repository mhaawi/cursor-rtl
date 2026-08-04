# Agents Window RTL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Cursor RTL work in Cursor 3 Agents Window (Glass) while keeping classic Agent chat behavior.

**Architecture:** Expand `cursor-rtl-loader.cjs` to hook `web-contents-created` (still filtered to `workbench.html`), and extend `rtl.js` selectors/CSS for Glass Lexical classed nodes. Bump to 1.1.0 and document.

**Tech Stack:** Electron main-process CJS loader, injected browser IIFE (`rtl.js`), VS Code extension TypeScript packaging via esbuild/vsce.

## Global Constraints

- Target version: `1.1.0`
- Keep Enable/Disable/backup/re-apply model unchanged
- Inject only URLs containing `workbench.html` (no arbitrary BrowserViews)
- Preserve classic Agent/Composer RTL behavior
- Code blocks stay LTR
- No automated Electron UI tests exist; verify with lint/build + string checks + manual checklist

## File Structure

| File | Responsibility |
|------|----------------|
| `resources/cursor-rtl-loader.cjs` | Main-process injection into workbench webContents |
| `resources/rtl.js` | DOM scan, `dir` attributes, RTL CSS |
| `package.json` | Version / description bump |
| `CHANGELOG.md` | 1.1.0 notes |
| `README.md` | Agents Window coverage note |

---

### Task 1: Expand loader for Agents Window webContents

**Files:**
- Modify: `resources/cursor-rtl-loader.cjs`

**Interfaces:**
- Consumes: existing `inject(wc, label)`, `setupWindow(win)`
- Produces: `setupWebContents(wc, labelId)` used for both BrowserWindow and `web-contents-created`

- [ ] **Step 1: Refactor setup helpers and add `web-contents-created`**

Replace the bottom of `resources/cursor-rtl-loader.cjs` (from `function setupWindow` through `log('loader ready')`) with:

```javascript
    function setupWebContents(wc, labelId) {
        if (!wc || wc.isDestroyed()) return;
        if (wc.__cursorRtlHooked) return;
        wc.__cursorRtlHooked = true;

        wc.on('did-start-loading', function () {
            wc.__cursorRtlInjectedUrl = '';
        });
        wc.on('did-finish-load', function () {
            inject(wc, 'inject[' + labelId + ']');
        });

        [250, 1000].forEach(function (delay) {
            setTimeout(function () {
                if (!wc.isDestroyed()) inject(wc, 'fallback[' + labelId + '@' + delay + 'ms]');
            }, delay);
        });

        if (!wc.isLoading() && !wc.isDestroyed()) {
            inject(wc, 'inject-now[' + labelId + ']');
        }
    }

    function setupWindow(win) {
        if (!win || !win.webContents) return;
        setupWebContents(win.webContents, win.id);
    }

    electron.app.on('browser-window-created', function (_ev, win) {
        setupWindow(win);
    });

    electron.app.on('web-contents-created', function (_ev, wc) {
        setupWebContents(wc, wc.id);
    });

    try {
        electron.BrowserWindow.getAllWindows().forEach(setupWindow);
    } catch (e) {
        log('getAllWindows error:', e.message);
    }

    log('loader ready');
```

Keep `isWorkbenchUrl` unchanged so non-workbench BrowserViews are skipped inside `inject`.

- [ ] **Step 2: Verify loader hooks exist**

Run (PowerShell):

```powershell
Select-String -Path "resources\cursor-rtl-loader.cjs" -Pattern "web-contents-created|__cursorRtlHooked|setupWebContents"
```

Expected: matches for all three patterns.

- [ ] **Step 3: Commit**

```powershell
git add resources/cursor-rtl-loader.cjs
git commit -m "Expand RTL loader to cover Agents Window webContents."
```

---

### Task 2: Extend `rtl.js` for Glass Lexical nodes

**Files:**
- Modify: `resources/rtl.js`

**Interfaces:**
- Consumes: existing `getDesiredDir`, `applyDir`, `DIR_SELECTOR`, style block
- Produces: Glass Lexical selectors included in `DIR_SELECTOR` and matching CSS rules

- [ ] **Step 1: Add Lexical class names to the CSS block**

Inside the `style.textContent = [...].join('\n')` array in `resources/rtl.js`, extend the plaintext rule list and the `[dir="rtl"]` rule list to include:

```css
.markdown-lexical-editor-paragraph,
.markdown-lexical-editor-listitem,
.markdown-lexical-editor-listitem-checked,
.markdown-lexical-editor-listitem-unchecked,
.markdown-lexical-editor-h1,
.markdown-lexical-editor-h2,
.markdown-lexical-editor-h3,
.markdown-lexical-editor-h4,
.markdown-lexical-editor-h5,
.markdown-lexical-editor-h6,
.markdown-lexical-editor-list-ul,
.markdown-lexical-editor-list-ol
```

Apply the same treatment already used for `.markdown-root p` / `[dir="rtl"]` variants (`unicode-bidi: plaintext|isolate` and `text-align: start`).

Also add list padding rule:

```css
.markdown-lexical-editor-list-ul,
.markdown-lexical-editor-list-ol {
  padding-inline-start: 20px !important;
  padding-inline-end: 0 !important;
}
```

- [ ] **Step 2: Add the same classes to `DIR_SELECTOR`**

Append these selectors to the `DIR_SELECTOR` array join list (same class names as Step 1).

- [ ] **Step 3: Treat Lexical list containers like `ul`/`ol` in `getDesiredDir`**

Update `getDesiredDir`:

```javascript
    function getDesiredDir(el) {
        if (el.matches && el.matches('ol, ul, .markdown-lexical-editor-list-ul, .markdown-lexical-editor-list-ol')) {
            return getListDir(el);
        }
        if (el.matches && el.matches('table')) return getTableDir(el);
        return getTextDir(getElementText(el));
    }
```

Update `getListDir` so Lexical list items are counted when semantic `li` children are absent:

```javascript
    function getListDir(el) {
        var items = el.querySelectorAll(':scope > li, :scope > .markdown-lexical-editor-listitem, :scope > .markdown-lexical-editor-listitem-checked, :scope > .markdown-lexical-editor-listitem-unchecked');
        if (items.length === 0) return getTextDir(getElementText(el));
        var rtl = 0, ltr = 0;
        for (var i = 0; i < items.length; i++) {
            if (getTextDir(getElementText(items[i])) === 'rtl') rtl++;
            else ltr++;
        }
        return rtl > ltr ? 'rtl' : 'ltr';
    }
```

- [ ] **Step 4: Verify selector strings exist**

Run:

```powershell
Select-String -Path "resources\rtl.js" -Pattern "markdown-lexical-editor-paragraph|markdown-lexical-editor-listitem|markdown-lexical-editor-list-ul"
```

Expected: multiple matches in CSS and `DIR_SELECTOR`.

- [ ] **Step 5: Commit**

```powershell
git add resources/rtl.js
git commit -m "Add Glass Lexical selectors for Agents Window RTL."
```

---

### Task 3: Version bump and docs

**Files:**
- Modify: `package.json`
- Modify: `CHANGELOG.md`
- Modify: `README.md`

- [ ] **Step 1: Bump package metadata**

In `package.json`:
- `"version": "1.1.0"`
- Update `description` to mention Agents Window / Glass

- [ ] **Step 2: Update CHANGELOG**

Prepend:

```markdown
## [1.1.0] - 2026-08-04

### Added

- RTL support for Cursor 3 Agents Window (Glass workspace UI)
- Injection coverage via Electron `web-contents-created`
- Lexical editor class selectors used by Agents Window chat

[1.1.0]: https://github.com/mhaawi/cursor-rtl/releases/tag/v1.1.0
```

Keep the existing `[1.0.0]` section.

- [ ] **Step 3: Update README**

- Overview/features: mention Agents Window in addition to Agent chat and Composer
- Usage: note both Editor Agent and Agents Window
- Badge/version if it hardcodes `1.0.0`

- [ ] **Step 4: Build and lint**

```powershell
npm run lint
npm run package
```

Expected: TypeScript emit OK; VSIX `cursor-rtl-1.1.0.vsix` produced.

- [ ] **Step 5: Commit**

```powershell
git add package.json CHANGELOG.md README.md
git commit -m "Release prep for Agents Window RTL v1.1.0."
```

Do not commit generated `cursor-rtl-1.1.0.vsix` unless the repo already tracks VSIX artifacts.

---

### Task 4: Manual verification checklist

No code changes. After local VSIX install:

- [ ] **Step 1:** Cursor RTL: Re-apply After Update → full Cursor restart
- [ ] **Step 2:** Classic Editor Agent: Arabic message + prompt RTL; fenced code LTR
- [ ] **Step 3:** Agents Window: same checks for user/assistant bubbles and prompt
- [ ] **Step 4:** Mixed LTR/RTL paragraph uses scoring (not forced all-RTL)
- [ ] **Step 5:** Disable restores non-RTL chat; status bar shows disabled

## Spec coverage self-check

| Spec requirement | Task |
|------------------|------|
| `web-contents-created` + workbench filter | Task 1 |
| Glass Lexical selectors/CSS | Task 2 |
| Keep classic Agent behavior | Tasks 1–2 (additive only) |
| Code LTR | Task 2 (existing exclusions unchanged) |
| Version/docs 1.1.0 | Task 3 |
| Manual dual-UI verification | Task 4 |
| No arbitrary BrowserView injection | Task 1 (`isWorkbenchUrl`) |
