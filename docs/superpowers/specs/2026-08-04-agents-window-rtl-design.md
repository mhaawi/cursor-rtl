# Cursor RTL on Agents Window (Glass) — Design

**Date:** 2026-08-04  
**Status:** Approved for implementation planning  
**Version target:** 1.1.0

## Problem

Cursor RTL works in classic IDE Agent chat but not in Cursor 3 **Agents Window** (Glass workspace UI).

Agents Window is not a fully separate app page: it still loads `workbench.html` with `glass: true` and the `workbench.glass.main.js` bundle. Two gaps prevent RTL there:

1. **Injection coverage** — the loader mainly hooks `browser-window-created` and may miss some Agents Window / Electron `webContents` lifecycles.
2. **DOM selectors** — `rtl.js` targets semantic tags under markdown/composer containers (`p`, `li`, headings). Glass/Lexical often uses classed nodes such as `markdown-lexical-editor-paragraph` and `markdown-lexical-editor-listitem`, so direction is never applied.

## Goals

- RTL auto-detection and alignment in Agents Window chat (messages + prompt input), matching classic Agent behavior.
- Keep existing IDE Agent/Composer RTL working unchanged.
- Code blocks remain LTR.
- No change to Enable/Disable/backup/re-apply command model; users re-apply and restart after update.

## Non-goals

- Separate Glass-only loader/script fork.
- Injecting into arbitrary BrowserViews / external URLs.
- Full UI chrome mirroring (sidebars, status bars) beyond chat text.

## Approach (selected)

Expand the existing main-process loader + shared `rtl.js` (option 1). Do not invent a parallel injection path.

## Architecture

```
main.js (patched)
  └─ cursor-rtl-loader.cjs
       ├─ browser-window-created  (existing)
       └─ web-contents-created    (new)
            └─ if URL contains workbench.html
                 └─ executeJavaScript(rtl.js)
                      ├─ classic Agent/Composer selectors (unchanged)
                      └─ Glass/Lexical selectors + CSS (new)
```

### 1. `resources/cursor-rtl-loader.cjs`

- Keep `isWorkbenchUrl(url)` filter (`workbench.html` only).
- Add `app.on('web-contents-created', ...)` and attach the same inject lifecycle (`did-start-loading`, `did-finish-load`, short fallbacks) used for BrowserWindows.
- Continue using existing inject/revive guards (`__cursorRtlInjecting`, `__cursorRtlInjectedUrl`, `__cursorRtlScanAll` alive check).
- Do **not** inject into BrowserViews whose URL is not workbench.

### 2. `resources/rtl.js`

- Preserve current `DIR_SELECTOR`, CSS rules, RTL scoring, MutationObserver, and code exclusions.
- Add Glass/Lexical targets, including at least:
  - `.markdown-lexical-editor-paragraph`
  - `.markdown-lexical-editor-listitem` (and checked/unchecked variants if needed)
  - `.markdown-lexical-editor-list-ul`, `.markdown-lexical-editor-list-ol`
  - `.markdown-lexical-editor-h1` … `.markdown-lexical-editor-h6`
  - Existing prompt classes already covered (`aislash-editor-*`, `ui-prompt-input-*`) remain
- Extend CSS for the same classes: `unicode-bidi` / `text-align: start` for detected RTL, keep `code`/`pre`/monaco LTR.
- Optional hardening: when scanning, treat list containers with Lexical list classes like existing `ul`/`ol` dir aggregation.

### 3. Packaging / docs

- Bump to `1.1.0`.
- CHANGELOG: Agents Window / Glass RTL support.
- README: note that RTL covers classic Agent and Agents Window; re-apply after update still required.

## Error handling

- Loader failures stay best-effort with console warnings (`[Cursor RTL Loader]`).
- Permission / patch failures unchanged in the extension host commands.
- If Glass DOM class names change in a future Cursor update, status remains “Active” but selectors may need another extension update (same class of risk as today).

## Testing

Manual (Cursor cannot be fully automated here):

1. Enable / Re-apply RTL, fully restart Cursor.
2. Classic Editor → Agent chat: Arabic/Hebrew messages and prompt still RTL; code LTR.
3. Open Agents Window: same checks for assistant/user messages and prompt.
4. Mixed LTR/RTL paragraphs choose direction by existing scoring.
5. After Cursor update simulation (or real update): Re-apply restores behavior in both surfaces.
6. Disable restores original `main.js` and removes loader.

## Rollout

1. Implement loader + `rtl.js` changes.
2. Lint/build/package VSIX.
3. Local install from VSIX → Re-apply → restart → verify both UIs.
4. Tag/release 1.1.0 when verified.
