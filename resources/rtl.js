(function () {
    var LOG = '[Cursor RTL]';
    if (typeof window.__cursorRtlScanAll === 'function') {
        window.__cursorRtlScanAll();
        console.log(LOG, 're-inject: refreshed');
        return;
    }

    // RTL script Unicode ranges
    var RTL_RE = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0870-\u089F\u08A0-\u08FF\uFB1D-\uFB4F\uFB50-\uFDFF\uFE70-\uFEFE]/g;

    function removeOldStyles() {
        document.querySelectorAll('style[data-cursor-rtl]').forEach(function (s) {
            s.remove();
        });
    }
    removeOldStyles();

    var style = document.createElement('style');
    style.setAttribute('data-cursor-rtl', 'true');
    style.textContent = [
        '.aislash-editor-placeholder { right: 15px !important; left: auto !important; }',
        '.aislash-editor-input p, .aislash-editor-input-readonly p,',
        '.ui-prompt-input-editor__input, .ui-prompt-input-editor__input > p,',
        '.ui-prompt-input-tiptap-readonly__content, .ui-prompt-input-tiptap-readonly__content > p {',
        '  unicode-bidi: plaintext !important; text-align: start !important; }',
        '.composer-rendered-message .composer-human-message div:has(> div > .aislash-editor-input-readonly),',
        '.composer-rendered-message .composer-human-message div:has(> div > .aislash-editor-input) {',
        '  flex-grow: 1 !important; }',
        '.markdown-root ul, .markdown-root ol, .markdown-lexical-editor-container ul, .markdown-lexical-editor-container ol {',
        '  padding-inline-start: 20px !important; padding-inline-end: 0 !important; }',
        '.markdown-root strong, .markdown-root em, .markdown-lexical-editor-container strong, .markdown-lexical-editor-container em {',
        '  unicode-bidi: isolate !important; }',
        'code, pre, .markdown-code-outer-container, .cursor-code-block-content, .monaco-editor {',
        '  direction: ltr !important; text-align: left !important; unicode-bidi: plaintext !important; }',
        '.markdown-root code, .markdown-lexical-editor-code-block { display: inline-block; direction: ltr; }',
        '.markdown-root p, .markdown-root li, .markdown-root h1, .markdown-root h2, .markdown-root h3,',
        '.markdown-root h4, .markdown-root h5, .markdown-root h6, .markdown-root blockquote,',
        '.markdown-lexical-editor-container p, .markdown-lexical-editor-container li,',
        '.markdown-lexical-editor-container h1, .markdown-lexical-editor-container h2,',
        '.markdown-lexical-editor-container h3, .markdown-lexical-editor-container h4,',
        '.markdown-lexical-editor-container h5, .markdown-lexical-editor-container h6,',
        '.markdown-lexical-editor-container blockquote {',
        '  unicode-bidi: plaintext !important; text-align: start !important; }',
        '.markdown-root p[dir="rtl"], .markdown-root li[dir="rtl"], .markdown-root h1[dir="rtl"],',
        '.markdown-root h2[dir="rtl"], .markdown-root h3[dir="rtl"], .markdown-root h4[dir="rtl"],',
        '.markdown-root h5[dir="rtl"], .markdown-root h6[dir="rtl"], .markdown-root blockquote[dir="rtl"],',
        '.markdown-lexical-editor-container p[dir="rtl"], .markdown-lexical-editor-container li[dir="rtl"],',
        '.composer-human-message p[dir="rtl"], .composer-human-message div[dir="rtl"],',
        '.aislash-editor-input p[dir="rtl"], .aislash-editor-input-readonly p[dir="rtl"],',
        '.ui-prompt-input-editor__input[dir="rtl"], .ui-prompt-input-editor__input > p[dir="rtl"] {',
        '  unicode-bidi: isolate !important; text-align: start !important; }',
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
        '.composer-human-message p', '.composer-human-message div',
        '.aislash-editor-input p', '.aislash-editor-input-readonly p',
        '.ui-prompt-input-editor__input', '.ui-prompt-input-editor__input > p',
        '.ui-prompt-input-tiptap-readonly__content', '.ui-prompt-input-tiptap-readonly__content > p',
        '.composer-rendered-message table th', '.composer-rendered-message table td'
    ].join(', ');

    var CODE_EXCLUDE = 'code, pre, .markdown-code-outer-container, .cursor-code-block-content, .markdown-lexical-editor-code-block';

    function isExcluded(el) {
        if (!el) return true;
        if (el.closest(CODE_EXCLUDE)) return true;
        if (el.closest('.monaco-editor')) return true;
        return false;
    }

    function hasRtlScript(text) {
        RTL_RE.lastIndex = 0;
        return RTL_RE.test(text || '');
    }

    function countRtlChars(text) {
        return (text.match(RTL_RE) || []).length;
    }

    function countLatinWords(text) {
        var tokens = text.match(/[A-Za-z][A-Za-z0-9._/\\:-]*/g) || [];
        var score = 0;
        for (var i = 0; i < tokens.length; i++) {
            var t = tokens[i];
            if (/[._/\\:]/.test(t)) score += 0.25;
            else if (/^[A-Z0-9-]{2,}$/.test(t)) score += 0.5;
            else score += 1;
        }
        return score;
    }

    function getTextDir(text) {
        var value = text || '';
        var rtlCount = countRtlChars(value);
        if (rtlCount === 0) return 'ltr';
        var latinScore = countLatinWords(value);
        if (latinScore === 0) return 'rtl';
        return rtlCount * 1.5 >= latinScore ? 'rtl' : 'ltr';
    }

    function getElementText(el) {
        if (!el) return '';
        if (typeof el.value === 'string') return el.value;
        return el.textContent || '';
    }

    function getListDir(el) {
        var items = el.querySelectorAll(':scope > li');
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
        if (el.matches && el.matches('ol, ul')) return getListDir(el);
        if (el.matches && el.matches('table')) return getTableDir(el);
        return getTextDir(getElementText(el));
    }

    function applyDir(el) {
        if (isExcluded(el)) return;
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

    var scanTimer = null;
    var observedRoots = new WeakSet();

    function scheduleScan() {
        if (scanTimer) return;
        scanTimer = setTimeout(function () {
            scanTimer = null;
            scanAll();
        }, 150);
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

    scanAll();
    setTimeout(scanAll, 500);
    setTimeout(scanAll, 2000);

    console.log(
        '%c RTL Active ',
        'background:#00695c;color:#fff;font-size:13px;padding:3px 8px;border-radius:4px;'
    );
})();
