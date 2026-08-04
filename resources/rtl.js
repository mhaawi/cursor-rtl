(function () {
    var LOG = '[Cursor RTL]';
    if (typeof window.__cursorRtlScanAll === 'function') {
        window.__cursorRtlScanAll();
        console.log(LOG, 're-inject: refreshed');
        return;
    }

    var RTL_RE = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0870-\u089F\u08A0-\u08FF\uFB1D-\uFB4F\uFB50-\uFDFF\uFE70-\uFEFE]/g;
    var LAT_LETTER_RE = /[A-Za-z\u00C0-\u024F]/g;

    function removeOldStyles() {
        document.querySelectorAll('style[data-cursor-rtl]').forEach(function (s) {
            s.remove();
        });
    }
    removeOldStyles();

    var style = document.createElement('style');
    style.setAttribute('data-cursor-rtl', 'true');
    style.textContent = [
        /* Prompt placeholders flip for RTL composers */
        '.aislash-editor-placeholder { right: 15px !important; left: auto !important; }',

        /* Base: plaintext so mixed Arabic/English/numbers follow natural bidi */
        '.aislash-editor-input p, .aislash-editor-input-readonly p,',
        '.ui-prompt-input-editor__input, .ui-prompt-input-editor__input > p,',
        '.ui-prompt-input-tiptap-readonly__content, .ui-prompt-input-tiptap-readonly__content > p,',
        '.markdown-root p, .markdown-root li, .markdown-root h1, .markdown-root h2, .markdown-root h3,',
        '.markdown-root h4, .markdown-root h5, .markdown-root h6, .markdown-root blockquote,',
        '.markdown-lexical-editor-container p, .markdown-lexical-editor-container li,',
        '.markdown-lexical-editor-container h1, .markdown-lexical-editor-container h2,',
        '.markdown-lexical-editor-container h3, .markdown-lexical-editor-container h4,',
        '.markdown-lexical-editor-container h5, .markdown-lexical-editor-container h6,',
        '.markdown-lexical-editor-container blockquote,',
        '.markdown-lexical-editor-paragraph, .markdown-lexical-editor-listitem,',
        '.markdown-lexical-editor-listitem-checked, .markdown-lexical-editor-listitem-unchecked,',
        '.markdown-lexical-editor-h1, .markdown-lexical-editor-h2, .markdown-lexical-editor-h3,',
        '.markdown-lexical-editor-h4, .markdown-lexical-editor-h5, .markdown-lexical-editor-h6,',
        '.markdown-lexical-editor-list-ul, .markdown-lexical-editor-list-ol,',
        '.markdown-lexical-editor-content-editable, .markdown-lexical-editor-root,',
        '.composer-human-message p,',
        '[class*="glass-chat"] p, [class*="glass-chat"] li,',
        '[class*="glass-chat"] [class*="markdown-lexical-editor"] {',
        '  unicode-bidi: plaintext !important; text-align: start !important; }',

        /* When we set dir, keep plaintext mixing (numbers/symbols/English islands) */
        '.markdown-root p[dir], .markdown-root li[dir], .markdown-root h1[dir],',
        '.markdown-root h2[dir], .markdown-root h3[dir], .markdown-root h4[dir],',
        '.markdown-root h5[dir], .markdown-root h6[dir], .markdown-root blockquote[dir],',
        '.markdown-lexical-editor-container p[dir], .markdown-lexical-editor-container li[dir],',
        '.markdown-lexical-editor-paragraph[dir], .markdown-lexical-editor-listitem[dir],',
        '.markdown-lexical-editor-listitem-checked[dir], .markdown-lexical-editor-listitem-unchecked[dir],',
        '.markdown-lexical-editor-h1[dir], .markdown-lexical-editor-h2[dir],',
        '.markdown-lexical-editor-h3[dir], .markdown-lexical-editor-h4[dir],',
        '.markdown-lexical-editor-h5[dir], .markdown-lexical-editor-h6[dir],',
        '.markdown-lexical-editor-list-ul[dir], .markdown-lexical-editor-list-ol[dir],',
        '.markdown-lexical-editor-content-editable[dir], .markdown-lexical-editor-root[dir],',
        '.composer-human-message p[dir],',
        '.aislash-editor-input p[dir], .aislash-editor-input-readonly p[dir],',
        '.ui-prompt-input-editor__input[dir], .ui-prompt-input-editor__input > p[dir],',
        '.ui-prompt-input-tiptap-readonly__content[dir], .ui-prompt-input-tiptap-readonly__content > p[dir],',
        '[class*="glass-chat"] p[dir], [class*="glass-chat"] li[dir] {',
        '  unicode-bidi: plaintext !important; text-align: start !important; }',

        /* LTR islands inside RTL paragraphs */
        '[dir="rtl"] a, [dir="rtl"] code, [dir="rtl"] kbd, [dir="rtl"] samp,',
        '[dir="rtl"] .ui-prompt-input-mention-chip,',
        '[dir="rtl"] .ui-prompt-input-command-chip,',
        '[dir="rtl"] .markdown-lexical-editor-link,',
        '[dir="rtl"] .markdown-lexical-editor-text-code {',
        '  unicode-bidi: isolate !important; direction: ltr !important; }',

        '[dir="rtl"] strong, [dir="rtl"] em, [dir="rtl"] b, [dir="rtl"] i {',
        '  unicode-bidi: isolate !important; }',

        '.composer-rendered-message .composer-human-message div:has(> div > .aislash-editor-input-readonly),',
        '.composer-rendered-message .composer-human-message div:has(> div > .aislash-editor-input) {',
        '  flex-grow: 1 !important; }',

        '.markdown-root ul, .markdown-root ol, .markdown-lexical-editor-container ul, .markdown-lexical-editor-container ol,',
        '.markdown-lexical-editor-list-ul, .markdown-lexical-editor-list-ol {',
        '  padding-inline-start: 20px !important; padding-inline-end: 0 !important; }',

        /* Code always LTR */
        'code, pre, .markdown-code-outer-container, .cursor-code-block-content, .monaco-editor,',
        '.markdown-lexical-editor-code-block {',
        '  direction: ltr !important; text-align: left !important; unicode-bidi: isolate !important; }',
        '.markdown-root code { display: inline-block; direction: ltr; unicode-bidi: isolate; }',

        '.markdown-table-container { direction: ltr !important; overflow-x: auto !important; max-width: 100% !important; }',
        '.markdown-root table th, .markdown-root table td, .markdown-lexical-editor-container table th,',
        '.markdown-lexical-editor-container table td { unicode-bidi: plaintext !important; text-align: start !important; }'
    ].join('\n');
    document.head.appendChild(style);

    var DIR_SELECTOR = [
        '.markdown-root p', '.markdown-root li', '.markdown-root h1', '.markdown-root h2',
        '.markdown-root h3', '.markdown-root h4', '.markdown-root h5', '.markdown-root h6',
        '.markdown-root blockquote', '.markdown-root ul', '.markdown-root ol',
        '.markdown-root table th', '.markdown-root table td',
        '.markdown-lexical-editor-container p', '.markdown-lexical-editor-container li',
        '.markdown-lexical-editor-container h1', '.markdown-lexical-editor-container h2',
        '.markdown-lexical-editor-container h3', '.markdown-lexical-editor-container h4',
        '.markdown-lexical-editor-container h5', '.markdown-lexical-editor-container h6',
        '.markdown-lexical-editor-container blockquote', '.markdown-lexical-editor-container ul',
        '.markdown-lexical-editor-container ol', '.markdown-lexical-editor-container table th',
        '.markdown-lexical-editor-container table td',
        '.markdown-lexical-editor-paragraph',
        '.markdown-lexical-editor-listitem',
        '.markdown-lexical-editor-listitem-checked',
        '.markdown-lexical-editor-listitem-unchecked',
        '.markdown-lexical-editor-h1', '.markdown-lexical-editor-h2', '.markdown-lexical-editor-h3',
        '.markdown-lexical-editor-h4', '.markdown-lexical-editor-h5', '.markdown-lexical-editor-h6',
        '.markdown-lexical-editor-list-ul', '.markdown-lexical-editor-list-ol',
        '.markdown-lexical-editor-content-editable',
        '.markdown-lexical-editor-root',
        '.composer-human-message p',
        '.aislash-editor-input p', '.aislash-editor-input-readonly p',
        '.ui-prompt-input-editor__input', '.ui-prompt-input-editor__input > p',
        '.ui-prompt-input-tiptap-readonly__content', '.ui-prompt-input-tiptap-readonly__content > p',
        '.composer-rendered-message table th', '.composer-rendered-message table td',
        '[class*="glass-chat"] [class*="markdown-lexical-editor-paragraph"]',
        '[class*="glass-chat"] [class*="markdown-lexical-editor-listitem"]',
        '[class*="glass-chat"] [class*="markdown-lexical-editor-h"]',
        '[class*="glass-chat"] p', '[class*="glass-chat"] li'
    ].join(', ');

    var CODE_EXCLUDE = 'code, pre, .markdown-code-outer-container, .cursor-code-block-content, .markdown-lexical-editor-code-block';

    function isExcluded(el) {
        if (!el) return true;
        if (el.closest(CODE_EXCLUDE)) return true;
        if (el.closest('.monaco-editor')) return true;
        return false;
    }

    function countRtlChars(text) {
        return (String(text).match(RTL_RE) || []).length;
    }

    function countLatinLetters(text) {
        var stripped = String(text)
            .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, ' ')
            .replace(/https?:\/\/\S+/gi, ' ')
            .replace(/\b[A-Za-z]:\\[^\s]+/g, ' ')
            .replace(/\/(?:[\w.-]+\/)+[\w.-]*/g, ' ')
            .replace(/\bv?\d+(?:\.\d+){1,3}\b/gi, ' ')
            .replace(/`[^`]+`/g, ' ');
        return (stripped.match(LAT_LETTER_RE) || []).length;
    }

    function isRtlCodePoint(cp) {
        return (
            (cp >= 0x0590 && cp <= 0x05ff) ||
            (cp >= 0x0600 && cp <= 0x06ff) ||
            (cp >= 0x0700 && cp <= 0x074f) ||
            (cp >= 0x0750 && cp <= 0x077f) ||
            (cp >= 0x0780 && cp <= 0x07bf) ||
            (cp >= 0x07c0 && cp <= 0x07ff) ||
            (cp >= 0x0870 && cp <= 0x089f) ||
            (cp >= 0x08a0 && cp <= 0x08ff) ||
            (cp >= 0xfb1d && cp <= 0xfb4f) ||
            (cp >= 0xfb50 && cp <= 0xfdff) ||
            (cp >= 0xfe70 && cp <= 0xfefe)
        );
    }

    function isLtrLetterCodePoint(cp) {
        return (
            (cp >= 0x41 && cp <= 0x5a) ||
            (cp >= 0x61 && cp <= 0x7a) ||
            (cp >= 0xc0 && cp <= 0x24f)
        );
    }

    function getFirstStrongDir(text) {
        var value = String(text || '');
        for (var i = 0; i < value.length; ) {
            var cp = value.codePointAt(i);
            i += cp > 0xffff ? 2 : 1;
            if (isRtlCodePoint(cp)) return 'rtl';
            if (isLtrLetterCodePoint(cp)) return 'ltr';
        }
        return null;
    }

    function getTextDir(text) {
        var value = String(text || '').replace(/\s+/g, ' ').trim();
        if (!value) return 'ltr';

        var rtlChars = countRtlChars(value);
        var latinChars = countLatinLetters(value);
        if (rtlChars === 0) return 'ltr';
        if (latinChars === 0) return 'rtl';

        var first = getFirstStrongDir(value);
        if (first === 'rtl') {
            return latinChars > rtlChars * 3 ? 'ltr' : 'rtl';
        }
        if (first === 'ltr') {
            return rtlChars >= latinChars ? 'rtl' : 'ltr';
        }
        return rtlChars >= latinChars ? 'rtl' : 'ltr';
    }

    function getElementText(el) {
        if (!el) return '';
        if (typeof el.value === 'string') return el.value;
        return el.textContent || '';
    }

    function getListDir(el) {
        var items = el.querySelectorAll(
            ':scope > li, :scope > .markdown-lexical-editor-listitem, ' +
            ':scope > .markdown-lexical-editor-listitem-checked, ' +
            ':scope > .markdown-lexical-editor-listitem-unchecked'
        );
        if (items.length === 0) return getTextDir(getElementText(el));
        var rtl = 0, ltr = 0;
        for (var i = 0; i < items.length; i++) {
            if (getTextDir(getElementText(items[i])) === 'rtl') rtl++;
            else ltr++;
        }
        return rtl > ltr ? 'rtl' : 'ltr';
    }

    function getTableDir(el) {
        var cells = el.querySelectorAll(':scope th, :scope td');
        if (cells.length === 0) return getTextDir(getElementText(el));
        var rtl = 0, ltr = 0;
        for (var i = 0; i < cells.length; i++) {
            if (getTextDir(getElementText(cells[i])) === 'rtl') rtl++;
            else ltr++;
        }
        return rtl > ltr ? 'rtl' : 'ltr';
    }

    function getDesiredDir(el) {
        if (el.matches && el.matches('ol, ul, .markdown-lexical-editor-list-ul, .markdown-lexical-editor-list-ol')) {
            return getListDir(el);
        }
        if (el.matches && el.matches('table')) return getTableDir(el);
        return getTextDir(getElementText(el));
    }

    function applyDir(el) {
        if (isExcluded(el)) return;
        var text = getElementText(el).replace(/\s+/g, ' ').trim();
        if (!text) return;
        var desired = getDesiredDir(el);
        if (el.getAttribute('dir') !== desired) {
            el.setAttribute('dir', desired);
        }
    }

    function scanRoot(root) {
        try {
            var els = root.querySelectorAll(DIR_SELECTOR);
            for (var i = 0; i < els.length; i++) {
                applyDir(els[i]);
            }
        } catch (e) {}
    }

    function walkShadows(root, fn) {
        fn(root);
        var all = root.querySelectorAll('*');
        for (var i = 0; i < all.length; i++) {
            var sr = all[i].shadowRoot;
            if (sr) walkShadows(sr, fn);
        }
    }

    function scanAll() {
        scanRoot(document);
        try {
            walkShadows(document.documentElement, scanRoot);
        } catch (e) {}
    }

    window.__cursorRtlScanAll = scanAll;
    window.__cursorRtlGetTextDir = getTextDir;

    var scanTimer = null;
    var observedRoots = new WeakSet();

    function scheduleScan() {
        if (scanTimer) return;
        scanTimer = setTimeout(function () {
            scanTimer = null;
            scanAll();
        }, 120);
    }

    function attachObserver(root) {
        if (!root || observedRoots.has(root)) return;
        observedRoots.add(root);
        new MutationObserver(function () {
            scheduleScan();
        }).observe(root, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    attachObserver(document.documentElement);
    document.querySelectorAll('*').forEach(function (el) {
        if (el.shadowRoot) attachObserver(el.shadowRoot);
    });

    window.addEventListener('focus', scheduleScan);
    document.addEventListener('visibilitychange', scheduleScan);
    document.addEventListener('input', scheduleScan, true);
    document.addEventListener('keyup', scheduleScan, true);

    scanAll();
    setTimeout(scanAll, 500);
    setTimeout(scanAll, 2000);
    setTimeout(scanAll, 5000);

    console.log(
        '%c RTL Active ',
        'background:#00695c;color:#fff;font-size:13px;padding:3px 8px;border-radius:4px;'
    );
})();
