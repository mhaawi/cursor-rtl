# Cursor RTL

<p align="center">
  <img src="resources/icon.png" alt="Cursor RTL" width="96" height="96">
</p>

<p align="center">
  <b>Automatic right-to-left text for Cursor Agent, Composer &amp; Agents Window</b><br>
  <b>عرض تلقائي من اليمين لليسار في محادثات Cursor</b>
</p>

<p align="center">
  <a href="#english"><img src="https://img.shields.io/badge/🇬🇧_English-0ea5e9?style=for-the-badge" alt="English"></a>
  &nbsp;
  <a href="#arabic"><img src="https://img.shields.io/badge/🇸🇦_Arabic-64748b?style=for-the-badge" alt="Arabic"></a>
</p>

<p align="center">
  <a href="https://github.com/mhaawi/cursor-rtl/releases/latest/download/cursor-rtl-1.0.0.vsix"><img src="https://img.shields.io/badge/⬇_Download_VSIX-1.0.0-22c55e?style=for-the-badge" alt="Download VSIX"></a>
  <a href="https://github.com/mhaawi/cursor-rtl/releases/latest"><img src="https://img.shields.io/badge/Releases-Latest-7c3aed?style=for-the-badge" alt="Releases"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT"></a>
</p>

---

<a id="english"></a>

# 🇬🇧 English

<p align="center">
  <a href="#en-overview">Overview</a> ·
  <a href="#en-download">Download</a> ·
  <a href="#en-install">Install</a> ·
  <a href="#en-usage">Usage</a> ·
  <a href="#en-commands">Commands</a> ·
  <a href="#en-settings">Settings</a> ·
  <a href="#en-troubleshooting">Troubleshooting</a> ·
  <a href="#en-dev">Develop</a> ·
  <a href="#arabic">العربية ←</a>
</p>

<a id="en-overview"></a>

## Overview

A **Cursor IDE** extension that automatically displays RTL text right-to-left in:

| Surface | Support |
|---|---|
| Agent (classic IDE) | ✅ |
| Composer | ✅ |
| Agents Window (Cursor 3 / Glass) | ✅ |

- Detects direction per message/paragraph
- Handles mixed Arabic + English + numbers + symbols
- Keeps **code blocks** left-to-right (LTR)

Examples:

```text
استخدم React 18 و Node.js في المشروع
API يعيد status=200 عند النجاح
user@example.com تم الإرسال
```

<a id="en-download"></a>

## Download

> **[⬇ Download cursor-rtl-1.0.0.vsix](https://github.com/mhaawi/cursor-rtl/releases/latest/download/cursor-rtl-1.0.0.vsix)**

All releases: [Releases](https://github.com/mhaawi/cursor-rtl/releases/latest)

<a id="en-install"></a>

## Install

### 1) Download the VSIX
Use the direct link above.

### 2) Install it in Cursor
1. Open Cursor
2. Open **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Click `...` at the top of the Extensions view
4. Choose **Install from VSIX...**
5. Select `cursor-rtl-1.0.0.vsix`

### 3) Enable the patch (required)
> Installing the extension alone is **not enough**. You must Enable it, then fully restart Cursor.

1. Open **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run: **`Cursor RTL: Enable`**
3. Confirm the prompt
4. **Quit Cursor completely** (all windows, including Agents Window), then reopen it

### 4) Check status

| Indicator | Meaning |
|---|---|
| `✓ RTL` | Active |
| `⊘ RTL` | Not enabled — run Enable |
| `⚠ RTL` | Re-apply needed after a Cursor update |

<a id="en-usage"></a>

## Usage

1. Open **Agent**, **Composer**, or **Agents Window**
2. Write in an RTL language (including mixed English/numbers/symbols)
3. Direction is applied automatically per paragraph
4. Code stays LTR

If RTL disappears after a Cursor update: run **`Cursor RTL: Re-apply After Update`**, then fully restart.

<a id="en-commands"></a>

## Commands

| Command | Description |
|---|---|
| `Cursor RTL: Enable` | Apply the RTL patch to Cursor files |
| `Cursor RTL: Disable` | Restore original files |
| `Cursor RTL: Status` | Show current state |
| `Cursor RTL: Re-apply After Update` | Re-apply after Cursor updates |

<a id="en-settings"></a>

## Settings

| Setting | Default | Description |
|---|---|---|
| `cursorRtl.autoReapply` | `true` | Auto re-apply after Cursor updates |
| `cursorRtl.showStatusBar` | `true` | Show status bar indicator |

## Requirements

- **Cursor IDE** (not VS Code)
- Windows, macOS, or Linux
- Administrator privileges may be required on Windows for the first Enable

<a id="en-troubleshooting"></a>

## Troubleshooting

**Permission denied (Windows)**  
Run Cursor as Administrator, then run **Enable** again.

**RTL stopped after a Cursor update**  
Run **Re-apply After Update**, then fully quit and reopen Cursor.

**Works in Agent but not in Agents Window**  
Make sure you fully restarted Cursor after Enable/Re-apply — not just Reload Window.

**Before uninstalling**  
1. Run **Disable**  
2. Restart Cursor  
3. Uninstall from Extensions

<a id="en-dev"></a>

## Build from source

```bash
git clone https://github.com/mhaawi/cursor-rtl.git
cd cursor-rtl
npm install
npm run package
```

```bash
npm run test:direction
```

## How it works

1. Backs up Cursor’s `main.js`
2. Injects a small loader into `main.js`
3. On startup, injects `rtl.js` into the workbench (including Agents Window)
4. Scans chat DOM and sets `dir="rtl"` or `dir="ltr"` per element

> **Note:** This extension modifies Cursor application files. Run **Disable** before uninstalling.

## Author & License

**Malek Yaseen** — [malek.m.yaseen@gmail.com](mailto:malek.m.yaseen@gmail.com)

[MIT](LICENSE) — Copyright (c) 2026 Malek Yaseen

<p align="center">
  <a href="#english">↑ Back to top</a> ·
  <a href="#arabic">العربية ←</a>
</p>

---

<a id="arabic"></a>

# 🇸🇦 العربية

<p align="center" dir="rtl">
  <a href="#ar-overview">نظرة عامة</a> ·
  <a href="#ar-download">التحميل</a> ·
  <a href="#ar-install">التثبيت</a> ·
  <a href="#ar-usage">الاستخدام</a> ·
  <a href="#ar-commands">الأوامر</a> ·
  <a href="#ar-settings">الإعدادات</a> ·
  <a href="#ar-troubleshooting">حل المشاكل</a> ·
  <a href="#ar-dev">للتطوير</a> ·
  <a href="#english">English →</a>
</p>

<a id="ar-overview"></a>

## نظرة عامة

إضافة لـ **Cursor IDE** تعرض نصوص الـ RTL تلقائياً من اليمين لليسار في:

| الوضع | الدعم |
|---|---|
| Agent داخل الـ IDE | ✅ |
| Composer | ✅ |
| Agents Window (Cursor 3) | ✅ |

- يضبط اتجاه كل فقرة تلقائياً
- يدعم النصوص المختلطة (عربي + إنجليزي + أرقام + رموز)
- يبقي **كتل الكود** دائماً من اليسار لليمين (LTR)

أمثلة:

```text
استخدم React 18 و Node.js في المشروع
API يعيد status=200 عند النجاح
user@example.com تم الإرسال
```

<a id="ar-download"></a>

## التحميل

> **[⬇ تحميل cursor-rtl-1.0.0.vsix](https://github.com/mhaawi/cursor-rtl/releases/latest/download/cursor-rtl-1.0.0.vsix)**

صفحة الإصدارات: [Releases](https://github.com/mhaawi/cursor-rtl/releases/latest)

<a id="ar-install"></a>

## التثبيت

### 1) حمّل ملف VSIX
من الرابط أعلاه.

### 2) ثبّت الإضافة داخل Cursor
1. افتح Cursor
2. افتح **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. اضغط `...` أعلى لوحة الإضافات
4. اختر **Install from VSIX...**
5. اختر ملف `cursor-rtl-1.0.0.vsix`

### 3) فعّل الدعم (مهم جداً)
> تثبيت الإضافة وحده **لا يكفي**. يجب تنفيذ Enable ثم إعادة تشغيل Cursor بالكامل.

1. افتح **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. نفّذ الأمر: **`Cursor RTL: تفعيل / Enable`**
3. وافق على رسالة التأكيد
4. **أغلق Cursor بالكامل** (كل النوافذ بما فيها Agents Window) ثم افتحه من جديد

### 4) تحقق من الحالة

| المؤشر | المعنى |
|---|---|
| `✓ RTL` | مفعّل ويعمل |
| `⊘ RTL` | غير مفعّل — نفّذ Enable |
| `⚠ RTL` | يحتاج إعادة تطبيق بعد تحديث Cursor |

<a id="ar-usage"></a>

## الاستخدام

1. افتح **Agent** أو **Composer** أو **Agents Window**
2. اكتب بالعربية (أو أي لغة RTL)، حتى مع كلمات إنجليزية وأرقام ورموز
3. الاتجاه يُضبط تلقائياً لكل فقرة
4. الكود يبقى LTR

إذا حدّثت Cursor واختفى RTL: نفّذ **`Cursor RTL: إعادة التطبيق / Re-apply After Update`** ثم أعد التشغيل بالكامل.

<a id="ar-commands"></a>

## الأوامر

| الأمر | الوظيفة |
|---|---|
| `Cursor RTL: تفعيل / Enable` | تفعيل وحقن الدعم في ملفات Cursor |
| `Cursor RTL: إيقاف / Disable` | إيقاف واستعادة الملفات الأصلية |
| `Cursor RTL: الحالة / Status` | عرض الحالة الحالية |
| `Cursor RTL: إعادة التطبيق / Re-apply After Update` | إعادة التطبيق بعد تحديث Cursor |

<a id="ar-settings"></a>

## الإعدادات

| الإعداد | الافتراضي | الوصف |
|---|---|---|
| `cursorRtl.autoReapply` | `true` | إعادة تطبيق تلقائية بعد تحديث Cursor |
| `cursorRtl.showStatusBar` | `true` | إظهار مؤشر الحالة في الشريط السفلي |

## المتطلبات

- **Cursor IDE** (ليست VS Code)
- Windows أو macOS أو Linux
- قد تحتاج صلاحيات مسؤول (Administrator) على Windows عند أول تفعيل

<a id="ar-troubleshooting"></a>

## حل المشاكل

**Permission denied على Windows**  
شغّل Cursor كـ Administrator ثم نفّذ **Enable** مرة أخرى.

**RTL توقف بعد تحديث Cursor**  
نفّذ **Re-apply After Update** ثم أغلق Cursor بالكامل وأعد فتحه.

**يعمل في Agent ولا يعمل في Agents Window**  
تأكد أنك أعدت تشغيل Cursor بالكامل بعد Enable/Re-apply، وليس Reload Window فقط.

**قبل حذف الإضافة**  
1. نفّذ **Disable**  
2. أعد تشغيل Cursor  
3. احذف الإضافة من Extensions

<a id="ar-dev"></a>

## البناء من المصدر

```bash
git clone https://github.com/mhaawi/cursor-rtl.git
cd cursor-rtl
npm install
npm run package
```

```bash
npm run test:direction
```

## كيف تعمل؟

1. تنشئ نسخة احتياطية من `main.js` داخل Cursor
2. تحقن loader بسيط في `main.js`
3. عند التشغيل يُحقن `rtl.js` في واجهة العمل (بما فيها Agents Window)
4. يُمسح محتوى المحادثة وتُضبط `dir="rtl"` أو `dir="ltr"` حسب كل عنصر

> **ملاحظة:** الإضافة تعدّل ملفات تطبيق Cursor. استخدم **Disable** قبل الإزالة.

## المؤلف والرخصة

**Malek Yaseen** — [malek.m.yaseen@gmail.com](mailto:malek.m.yaseen@gmail.com)

[MIT](LICENSE) — Copyright (c) 2026 Malek Yaseen

<p align="center" dir="rtl">
  <a href="#arabic">↑ العودة للأعلى</a> ·
  <a href="#english">English →</a>
</p>
