/**
 * Direction helpers shared by resources/rtl.js (mirrored for Node tests).
 * Keep in sync with getTextDir logic in resources/rtl.js.
 */
const RTL_RE = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0870-\u089F\u08A0-\u08FF\uFB1D-\uFB4F\uFB50-\uFDFF\uFE70-\uFEFE]/g;
const LAT_LETTER_RE = /[A-Za-z\u00C0-\u024F]/g;

function countRtlChars(text) {
  return (String(text).match(RTL_RE) || []).length;
}

function countLatinLetters(text) {
  // Neutralize technical LTR islands so they don't dominate Arabic sentences.
  const stripped = String(text)
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
  const value = String(text || '');
  for (let i = 0; i < value.length; ) {
    const cp = value.codePointAt(i);
    i += cp > 0xffff ? 2 : 1;
    if (isRtlCodePoint(cp)) return 'rtl';
    if (isLtrLetterCodePoint(cp)) return 'ltr';
  }
  return null;
}

function getTextDir(text) {
  const value = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!value) return 'ltr';

  const rtlChars = countRtlChars(value);
  const latinChars = countLatinLetters(value);
  if (rtlChars === 0) return 'ltr';
  if (latinChars === 0) return 'rtl';

  const first = getFirstStrongDir(value);
  if (first === 'rtl') {
    // Rare: Arabic starter but English dominates heavily
    return latinChars > rtlChars * 3 ? 'ltr' : 'rtl';
  }
  if (first === 'ltr') {
    // Common: English token then Arabic sentence → prefer RTL when Arabic is substantial
    return rtlChars >= latinChars ? 'rtl' : 'ltr';
  }
  return rtlChars >= latinChars ? 'rtl' : 'ltr';
}

module.exports = { getTextDir, getFirstStrongDir, countRtlChars, countLatinLetters };
