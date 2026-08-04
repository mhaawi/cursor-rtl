import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function getAppOutDir(): string {
    const appRoot = vscode.env.appRoot;

    const candidates = [
        path.join(appRoot, 'out'),
        path.join(appRoot, 'resources', 'app', 'out'),
        path.join(path.dirname(appRoot), 'out'),
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return candidates[0];
}

export function getMainJsPath(): string {
    return path.join(getAppOutDir(), 'main.js');
}

export function validatePaths(): { valid: boolean; mainJsPath: string; error?: string } {
    const mainJsPath = getMainJsPath();

    if (!fs.existsSync(mainJsPath)) {
        return {
            valid: false,
            mainJsPath,
            error: `main.js not found at: ${mainJsPath}`,
        };
    }

    try {
        fs.accessSync(mainJsPath, fs.constants.R_OK);
    } catch {
        return {
            valid: false,
            mainJsPath,
            error: `No read permission for: ${mainJsPath}`,
        };
    }

    return { valid: true, mainJsPath };
}
