const fs = require('fs');
const path = require('path');

const out = 'D:/Users/user/AppData/Local/Programs/cursor/resources/app/out';
const mainJsPath = path.join(out, 'main.js');
const PATCH_LINE =
  'import{createRequire}from"module";try{createRequire(import.meta.url)("./cursor-rtl-loader.cjs")}catch(e){console.error("[Cursor RTL] error loading loader:",e)}';
const PATCH_MARKER = 'cursor-rtl-loader.cjs';
const BACKUP_PREFIX = 'main.js.rtl-backup-';

function formatTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    'T' +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

let content = fs.readFileSync(mainJsPath, 'utf-8');
if (!content.includes('Copyright (C) Microsoft Corporation')) {
  throw new Error('missing copyright signature');
}
if (content.includes(PATCH_LINE) || content.includes(PATCH_MARKER)) {
  console.log('ALREADY_PATCHED');
  process.exit(0);
}

const backupPath = path.join(out, BACKUP_PREFIX + formatTimestamp());
fs.copyFileSync(mainJsPath, backupPath);
console.log('BACKUP', backupPath);

const lines = content.split('\n');
const existingIndex = lines.findIndex((line) =>
  line.startsWith('import{createRequire')
);
if (existingIndex !== -1) {
  lines[existingIndex] = PATCH_LINE;
  fs.writeFileSync(mainJsPath, lines.join('\n'), 'utf-8');
  console.log('REPLACED_EXISTING_IMPORT');
} else {
  const copyrightEnd = content.indexOf('*/');
  if (copyrightEnd === -1) throw new Error('no copyright end');
  const insertPos = copyrightEnd + 2;
  const patched =
    content.substring(0, insertPos) +
    '\n' +
    PATCH_LINE +
    content.substring(insertPos);
  fs.writeFileSync(mainJsPath, patched, 'utf-8');
  console.log('INSERTED_AFTER_COPYRIGHT');
}

content = fs.readFileSync(mainJsPath, 'utf-8');
console.log('VERIFY', content.includes(PATCH_MARKER));
console.log('LOADER', fs.existsSync(path.join(out, 'cursor-rtl-loader.cjs')));
