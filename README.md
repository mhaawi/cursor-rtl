# Cursor RTL

<p align="center">
  <img src="resources/icon.png" alt="Cursor RTL" width="96" height="96">
</p>

<p align="center">
  <b>عرض تلقائي من اليمين لليسار في محادثات Cursor</b><br>
  <b>Automatic right-to-left text for Cursor Agent, Composer &amp; Agents Window</b>
</p>

<p align="center">
  <a href="https://github.com/mhaawi/cursor-rtl/releases/latest/download/cursor-rtl-1.1.2.vsix"><img src="https://img.shields.io/badge/⬇_Download_VSIX-1.1.2-0ea5e9?style=for-the-badge" alt="Download VSIX"></a>
  <a href="https://github.com/mhaawi/cursor-rtl/releases/latest"><img src="https://img.shields.io/badge/Releases-Latest-22c55e?style=for-the-badge" alt="Releases"></a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/Version-1.1.2-green.svg" alt="Version"></a>
  <img src="https://img.shields.io/badge/Cursor-Agent%20%7C%20Composer%20%7C%20Agents%20Window-7c3aed.svg" alt="Surfaces">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-64748b.svg" alt="Platform">
</p>

---

## رابط التحميل المباشر / Direct download

**أحدث إصدار:**

> **[⬇ تحميل cursor-rtl-1.1.2.vsix](https://github.com/mhaawi/cursor-rtl/releases/latest/download/cursor-rtl-1.1.2.vsix)**

صفحة الإصدارات: [Releases](https://github.com/mhaawi/cursor-rtl/releases/latest)

---

## ماذا تفعل الإضافة؟ / What it does

Cursor RTL يكتشف تلقائياً النصوص العربية/العبرية وغيرها من لغات RTL داخل:

| الوضع / Mode | الدعم |
|---|---|
| Agent (IDE) | ✅ |
| Composer | ✅ |
| Agents Window (Cursor 3 / Glass) | ✅ |

ويضبط اتجاه الفقرة بشكل صحيح مع الإبقاء على **كتل الكود LTR**.

يدعم أيضاً النصوص المختلطة مثل:

`استخدم React 18 و Node.js في المشروع`  
`API يعيد status=200 عند النجاح`  
`user@example.com تم الإرسال`

---

## التثبيت خطوة بخطوة / Install

### 1) حمّل ملف VSIX
من الرابط المباشر أعلاه:  
[cursor-rtl-1.1.2.vsix](https://github.com/mhaawi/cursor-rtl/releases/latest/download/cursor-rtl-1.1.2.vsix)

### 2) ثبّته داخل Cursor
1. افتح Cursor
2. اذهب إلى **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. اضغط `...` أعلى قائمة الإضافات
4. اختر **Install from VSIX...**
5. اختر ملف `cursor-rtl-1.1.2.vsix`

### 3) فعّل الدعم (مهم جداً)
تثبيت الإضافة وحده لا يكفي.

1. افتح **Command Palette**  
   - Windows/Linux: `Ctrl+Shift+P`  
   - macOS: `Cmd+Shift+P`
2. نفّذ: **`Cursor RTL: Enable`** (أو **تفعيل**)
3. وافق على رسالة التأكيد
4. **أغلق Cursor بالكامل** (كل النوافذ بما فيها Agents Window) ثم افتحه من جديد

### 4) تحقق من الحالة
في شريط الحالة أسفل Cursor يجب أن ترى:

| المؤشر | المعنى |
|---|---|
| `✓ RTL` | مفعّل ويعمل |
| `⊘ RTL` | غير مفعّل — نفّذ Enable |
| `⚠ RTL` | يحتاج إعادة تطبيق بعد تحديث Cursor |

---

## الاستخدام / Usage

بعد التفعيل وإعادة التشغيل:

1. افتح **Agent** أو **Composer** أو **Agents Window**
2. اكتب بالعربية (أو أي لغة RTL)، حتى مع كلمات إنجليزية وأرقام ورموز
3. الاتجاه يُضبط تلقائياً لكل فقرة
4. الكود يبقى من اليسار لليمين

> إذا حدّثت Cursor واختفى RTL: نفّذ **`Cursor RTL: Re-apply After Update`** ثم أعد التشغيل.

---

## الأوامر / Commands

| الأمر | الوظيفة |
|---|---|
| `Cursor RTL: Enable` | تفعيل وحقن الدعم في ملفات Cursor |
| `Cursor RTL: Disable` | إيقاف واستعادة الملفات الأصلية |
| `Cursor RTL: Status` | عرض الحالة الحالية |
| `Cursor RTL: Re-apply After Update` | إعادة التطبيق بعد تحديث Cursor |

---

## الإعدادات / Settings

| الإعداد | الافتراضي | الوصف |
|---|---|---|
| `cursorRtl.autoReapply` | `true` | إعادة تطبيق تلقائية بعد تحديث Cursor |
| `cursorRtl.showStatusBar` | `true` | إظهار مؤشر الحالة |

---

## المتطلبات / Requirements

- **Cursor IDE** (ليست VS Code)
- Windows / macOS / Linux
- قد تحتاج صلاحيات مسؤول (Administrator) على Windows عند أول تفعيل

---

## استكشاف الأخطاء / Troubleshooting

**Permission denied (Windows)**  
شغّل Cursor كـ Administrator ثم نفّذ **Enable** مرة أخرى.

**RTL توقف بعد تحديث Cursor**  
نفّذ **Re-apply After Update** ثم أعد التشغيل بالكامل.

**يعمل في Agent ولا يعمل في Agents Window**  
تأكد أنك أعدت تشغيل Cursor بالكامل بعد Enable/Re-apply، وليس Reload Window فقط.

**قبل إلغاء التثبيت**  
نفّذ **Disable** أولاً، ثم أعد التشغيل، ثم احذف الإضافة.

---

## البناء من المصدر / Build from source

```bash
git clone https://github.com/mhaawi/cursor-rtl.git
cd cursor-rtl
npm install
npm run package
```

سيُنشأ ملف `cursor-rtl-*.vsix` جاهز للتثبيت.

اختبار اتجاه النصوص المختلطة:

```bash
npm run test:direction
```

---

## كيف تعمل؟ / How it works

1. تنشئ نسخة احتياطية من `main.js` في Cursor
2. تحقن loader بسيط في `main.js`
3. عند التشغيل يُحقن `rtl.js` في واجهة العمل (بما فيها Agents Window)
4. يُمسح DOM وتُضبط `dir="rtl"` أو `dir="ltr"` حسب محتوى كل عنصر

> **ملاحظة:** الإضافة تعدّل ملفات تطبيق Cursor. استخدم **Disable** قبل الإزالة.

---

## المؤلف / Author

**Malek Yaseen** — [malek.m.yaseen@gmail.com](mailto:malek.m.yaseen@gmail.com)

## الرخصة / License

[MIT](LICENSE) — Copyright (c) 2026 Malek Yaseen
