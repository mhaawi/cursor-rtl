(function () {
    var fs = require('fs');
    var path = require('path');
    var os = require('os');

    var LOG = '[Cursor RTL Loader]';
    var EXT_PREFIX = /^malek-yaseen\.cursor-rtl-\d/;
    var LOCAL_RTL = 'cursor-rtl.js';

    function log() {
        var args = Array.prototype.slice.call(arguments);
        console.warn.apply(console, [LOG].concat(args));
    }

    var electron;
    try {
        electron = require('electron');
    } catch (e) {
        log('FATAL: require("electron") failed:', e.message);
        return;
    }

    function findRtlScript() {
        try {
            var localPath = path.join(__dirname, LOCAL_RTL);
            if (fs.existsSync(localPath)) return localPath;
        } catch (e) {}

        var extDir = '';
        for (var i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === '--extensions-dir' && process.argv[i + 1]) {
                extDir = process.argv[i + 1];
                break;
            }
            if (process.argv[i].startsWith('--extensions-dir=')) {
                extDir = process.argv[i].slice('--extensions-dir='.length);
                break;
            }
        }
        if (!extDir) {
            extDir = path.join(os.homedir(), '.cursor', 'extensions');
        }

        try {
            var entries = fs.readdirSync(extDir);
            var dirs = entries
                .filter(function (d) { return EXT_PREFIX.test(d); })
                .sort();
            if (dirs.length === 0) return '';

            for (var j = dirs.length - 1; j >= 0; j--) {
                var rtlPath = path.join(extDir, dirs[j], 'resources', 'rtl.js');
                if (fs.existsSync(rtlPath)) return rtlPath;
            }
            return '';
        } catch (e) {
            log('findRtlScript error:', e.message);
            return '';
        }
    }

    function isWorkbenchUrl(url) {
        if (typeof url !== 'string' || !url) return false;
        return (
            url.indexOf('workbench.html') !== -1 ||
            url.indexOf('workbench-dev.html') !== -1
        );
    }

    function isRuntimeAlive(wc) {
        return wc.executeJavaScript('typeof window.__cursorRtlScanAll === "function"');
    }

    function inject(wc, label) {
        if (!wc || wc.isDestroyed()) return;
        if (wc.__cursorRtlInjecting) return;

        var url = '';
        try { url = wc.getURL(); } catch (e) { return; }
        if (!isWorkbenchUrl(url)) {
            if (url && !wc.__cursorRtlSkipLogged) {
                wc.__cursorRtlSkipLogged = true;
                log(label, 'skip non-workbench url:', String(url).slice(0, 160));
            }
            return;
        }

        if (wc.__cursorRtlInjectedUrl === url) {
            isRuntimeAlive(wc).then(function (alive) {
                if (!alive) {
                    wc.__cursorRtlInjectedUrl = '';
                    inject(wc, label + '-revive');
                }
            }).catch(function () {
                wc.__cursorRtlInjectedUrl = '';
                inject(wc, label + '-revive');
            });
            return;
        }

        var rtlPath = findRtlScript();
        if (!rtlPath) {
            log(label, 'rtl.js not found');
            return;
        }

        wc.__cursorRtlInjecting = true;
        var script = fs.readFileSync(rtlPath, 'utf-8');
        wc.executeJavaScript(script)
            .then(function () { return isRuntimeAlive(wc); })
            .then(function (alive) {
                wc.__cursorRtlInjecting = false;
                wc.__cursorRtlInjectedUrl = alive ? url : '';
                log(label, alive ? 'injected OK' : 'injection unverified', String(url).slice(0, 120));
            })
            .catch(function (err) {
                wc.__cursorRtlInjecting = false;
                wc.__cursorRtlInjectedUrl = '';
                log(label, 'inject error:', err && err.message);
            });
    }

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
        wc.on('did-navigate-in-page', function () {
            inject(wc, 'nav[' + labelId + ']');
        });

        [250, 1000, 3000, 8000].forEach(function (delay) {
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

    function sweepAllWebContents(reason) {
        try {
            if (!electron.webContents || !electron.webContents.getAllWebContents) return;
            electron.webContents.getAllWebContents().forEach(function (wc) {
                setupWebContents(wc, reason + ':' + wc.id);
                inject(wc, 'sweep[' + reason + ':' + wc.id + ']');
            });
        } catch (e) {
            log('sweep error:', e.message);
        }
    }

    electron.app.on('browser-window-created', function (_ev, win) {
        setupWindow(win);
    });

    electron.app.on('web-contents-created', function (_ev, wc) {
        setupWebContents(wc, wc.id);
    });

    function onReady() {
        try {
            electron.BrowserWindow.getAllWindows().forEach(setupWindow);
        } catch (e) {
            log('getAllWindows error:', e.message);
        }
        sweepAllWebContents('ready');
        [2000, 5000, 12000].forEach(function (delay) {
            setTimeout(function () { sweepAllWebContents('t' + delay); }, delay);
        });
    }

    if (electron.app.isReady()) {
        onReady();
    } else {
        electron.app.once('ready', onReady);
    }

    log('loader ready');
})();
