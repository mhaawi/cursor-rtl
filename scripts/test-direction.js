const assert = require('assert');
const { getTextDir } = require('./direction.js');

const cases = [
  // Pure
  ['مرحبا بالعالم', 'rtl'],
  ['Hello world', 'ltr'],
  ['12345 !!!', 'ltr'],
  ['', 'ltr'],

  // Mixed Arabic-first
  ['مرحبا hello', 'rtl'],
  ['مرحبا Hello 123!', 'rtl'],
  ['استخدم React 18 و Node.js في المشروع', 'rtl'],
  ['الملف app.tsx يحتوي على 42 خطأ', 'rtl'],
  ['النسخة v1.2.3 جاهزة (OK)', 'rtl'],
  ['أضف @user و #tag ثم ادفع', 'rtl'],

  // Mixed English-first with substantial Arabic → RTL
  ['React مكون مهم في الواجهة', 'rtl'],
  ['API يعيد status=200 عند النجاح', 'rtl'],
  ['OK تم بنجاح', 'rtl'],

  // English-dominant mixed → LTR
  ['Use the ملف only as fallback', 'ltr'],
  ['Hello world with one كلمة', 'ltr'],

  // Numbers/symbols neutrals
  ['123 مرحبا', 'rtl'],
  ['!!! Hello', 'ltr'],
  ['(2026) التحديث الجديد', 'rtl'],
  ['user@example.com تم الإرسال', 'rtl'],
  ['C:\\Users\\test\\file.ts جاهز', 'rtl'],
];

let failed = 0;
for (const [text, expected] of cases) {
  const actual = getTextDir(text);
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} | expected=${expected} actual=${actual} | ${JSON.stringify(text)}`);
  if (!ok) {
    // keep going to show full report
  }
}

console.log(`\n${cases.length - failed}/${cases.length} passed`);
if (failed) process.exit(1);
