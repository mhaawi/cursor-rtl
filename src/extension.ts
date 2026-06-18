import * as vscode from 'vscode';
import * as fs from 'fs';
import { validatePaths, getMainJsPath, getAppOutDir } from './paths';
import {
    isPatched,
    hasBackups,
    applyPatch,
    removePatch,
    copyLoader,
    getDryRunSummary,
    handlePermissionError,
} from './patcher';

let statusBarItem: vscode.StatusBarItem;
let fileWatcher: fs.FSWatcher | undefined;

type PatchState = 'on' | 'off' | 'update-needed';

function getPatchState(mainJsPath: string): PatchState {
    if (!fs.existsSync(mainJsPath)) {
        return 'off';
    }
    if (isPatched(mainJsPath)) {
        return 'on';
    }
    if (hasBackups(mainJsPath)) {
        return 'update-needed';
    }
    return 'off';
}

function updateStatusBar(state: PatchState): void {
    const config = vscode.workspace.getConfiguration('cursorRtl');
    if (!config.get<boolean>('showStatusBar', true)) {
        statusBarItem.hide();
        return;
    }

    switch (state) {
        case 'on':
            statusBarItem.text = '$(check) RTL';
            statusBarItem.backgroundColor = undefined;
            statusBarItem.tooltip = 'RTL is active. Click for options.';
            break;
        case 'off':
            statusBarItem.text = '$(circle-slash) RTL';
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            statusBarItem.tooltip = 'RTL is not enabled. Click to enable.';
            break;
        case 'update-needed':
            statusBarItem.text = '$(warning) RTL';
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            statusBarItem.tooltip = 'Cursor was updated — re-apply RTL patch.';
            break;
    }

    statusBarItem.show();
}

async function promptRestart(action: string): Promise<void> {
    const choice = await vscode.window.showInformationMessage(
        `${action} Please restart Cursor to apply changes.`,
        'Quit Cursor',
        'Later'
    );
    if (choice === 'Quit Cursor') {
        await vscode.commands.executeCommand('workbench.action.quit');
    }
}

async function showQuickPick(): Promise<void> {
    const mainJsPath = getMainJsPath();
    const state = getPatchState(mainJsPath);

    const items: vscode.QuickPickItem[] = [];

    if (state === 'on') {
        items.push(
            { label: '$(circle-slash) Disable RTL', description: 'إيقاف دعم RTL' },
            { label: '$(info) Check Status', description: 'عرض الحالة' }
        );
    } else {
        items.push(
            { label: '$(check) Enable RTL', description: 'تفعيل دعم RTL' },
            { label: '$(info) Check Status', description: 'عرض الحالة' }
        );
    }

    if (state === 'update-needed' || state === 'off') {
        items.unshift({
            label: '$(refresh) Re-apply After Update',
            description: 'إعادة التطبيق بعد تحديث Cursor',
        });
    }

    const picked = await vscode.window.showQuickPick(items, {
        placeHolder: 'Cursor RTL',
    });

    if (!picked) return;

    if (picked.label.includes('Enable')) {
        await vscode.commands.executeCommand('cursorRtl.enable');
    } else if (picked.label.includes('Disable')) {
        await vscode.commands.executeCommand('cursorRtl.disable');
    } else if (picked.label.includes('Re-apply')) {
        await vscode.commands.executeCommand('cursorRtl.reapply');
    } else if (picked.label.includes('Status')) {
        await vscode.commands.executeCommand('cursorRtl.status');
    }
}

async function enableCommand(context: vscode.ExtensionContext): Promise<void> {
    const validation = validatePaths();
    if (!validation.valid) {
        vscode.window.showErrorMessage(`Cursor RTL: ${validation.error}`);
        return;
    }

    const mainJsPath = validation.mainJsPath;
    const outDir = getAppOutDir();
    const detail = getDryRunSummary(mainJsPath).map((a) => `• ${a}`).join('\n');

    const confirm = await vscode.window.showWarningMessage(
        'Enable RTL for Cursor?\n\nسيتم تعديل ملفات Cursor لتفعيل عرض RTL تلقائياً.',
        { modal: true, detail },
        'Enable'
    );

    if (confirm !== 'Enable') return;

    try {
        copyLoader(outDir, context.extensionPath);
        applyPatch(mainJsPath);
        updateStatusBar('on');
        setupFileWatcher(mainJsPath, context);
        await promptRestart('RTL patch applied successfully!');
    } catch (err) {
        vscode.window.showErrorMessage(`Cursor RTL: ${handlePermissionError(err)}`);
    }
}

async function disableCommand(): Promise<void> {
    const validation = validatePaths();
    if (!validation.valid) {
        vscode.window.showErrorMessage(`Cursor RTL: ${validation.error}`);
        return;
    }

    const confirm = await vscode.window.showWarningMessage(
        'Disable RTL and restore original main.js?',
        { modal: true },
        'Disable'
    );

    if (confirm !== 'Disable') return;

    try {
        removePatch(validation.mainJsPath);
        updateStatusBar('off');
        await promptRestart('RTL patch removed.');
    } catch (err) {
        vscode.window.showErrorMessage(`Cursor RTL: ${handlePermissionError(err)}`);
    }
}

async function statusCommand(): Promise<void> {
    const validation = validatePaths();
    if (!validation.valid) {
        vscode.window.showErrorMessage(`Cursor RTL: ${validation.error}`);
        return;
    }

    const state = getPatchState(validation.mainJsPath);

    switch (state) {
        case 'on':
            vscode.window.showInformationMessage(
                'Cursor RTL: Active — RTL text displays automatically.'
            );
            break;
        case 'off':
            vscode.window.showInformationMessage(
                'Cursor RTL: Not enabled. Use "Enable" command to activate.'
            );
            break;
        case 'update-needed': {
            const choice = await vscode.window.showWarningMessage(
                'Cursor was updated and the RTL patch needs to be re-applied.',
                'Re-apply Now'
            );
            if (choice === 'Re-apply Now') {
                await vscode.commands.executeCommand('cursorRtl.reapply');
            }
            break;
        }
    }
}

async function reapplyCommand(context: vscode.ExtensionContext): Promise<void> {
    const validation = validatePaths();
    if (!validation.valid) {
        vscode.window.showErrorMessage(`Cursor RTL: ${validation.error}`);
        return;
    }

    try {
        copyLoader(getAppOutDir(), context.extensionPath);
        applyPatch(validation.mainJsPath);
        updateStatusBar('on');
        setupFileWatcher(validation.mainJsPath, context);
        await promptRestart('RTL patch re-applied successfully!');
    } catch (err) {
        vscode.window.showErrorMessage(`Cursor RTL: ${handlePermissionError(err)}`);
    }
}

function refreshLoader(context: vscode.ExtensionContext): void {
    try {
        copyLoader(getAppOutDir(), context.extensionPath);
    } catch {
        // non-critical
    }
}

function setupFileWatcher(
    mainJsPath: string,
    context: vscode.ExtensionContext
): void {
    if (fileWatcher) {
        fileWatcher.close();
    }

    try {
        fileWatcher = fs.watch(mainJsPath, (eventType) => {
            if (eventType !== 'change') return;

            setTimeout(async () => {
                const state = getPatchState(mainJsPath);
                if (state !== 'update-needed' && state !== 'off') return;

                updateStatusBar('update-needed');

                const config = vscode.workspace.getConfiguration('cursorRtl');
                if (config.get<boolean>('autoReapply', true)) {
                    await reapplyCommand(context);
                    return;
                }

                const choice = await vscode.window.showWarningMessage(
                    'Cursor was updated and RTL was removed. Re-apply?',
                    'Re-apply',
                    'Dismiss'
                );
                if (choice === 'Re-apply') {
                    await vscode.commands.executeCommand('cursorRtl.reapply');
                }
            }, 1000);
        });
    } catch {
        // fs.watch may fail on some platforms
    }
}

export function activate(context: vscode.ExtensionContext): void {
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = 'cursorRtl.quickPick';
    context.subscriptions.push(statusBarItem);

    context.subscriptions.push(
        vscode.commands.registerCommand('cursorRtl.quickPick', showQuickPick),
        vscode.commands.registerCommand('cursorRtl.enable', () => enableCommand(context)),
        vscode.commands.registerCommand('cursorRtl.disable', disableCommand),
        vscode.commands.registerCommand('cursorRtl.status', statusCommand),
        vscode.commands.registerCommand('cursorRtl.reapply', () => reapplyCommand(context))
    );

    const mainJsPath = getMainJsPath();
    const state = getPatchState(mainJsPath);
    updateStatusBar(state);

    if (state === 'on') {
        refreshLoader(context);
    }

    if (fs.existsSync(mainJsPath) && (state === 'on' || state === 'update-needed')) {
        setupFileWatcher(mainJsPath, context);
    }

    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('cursorRtl.showStatusBar')) {
            updateStatusBar(getPatchState(mainJsPath));
        }
    }, null, context.subscriptions);
}

export function deactivate(): void {
    if (fileWatcher) {
        fileWatcher.close();
        fileWatcher = undefined;
    }
}
