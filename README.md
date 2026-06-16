# Premium Worker Registration Form

فۆڕمی پێشکەوتووی تۆمارکردنی زانیاری کرێکار بە زمانی کوردی/RTL. ئەم پڕۆژەیە static ـە و بۆ کارکردن پێویستی بە backend نییە.

## تایبەتمەندییەکان

- Login screen بە session timer
- ٨ بەشی ڕێکخراو بۆ زانیاری کەسی، وێنە، ناونیشان، کار، خوێندن، تەندروستی، پەیوەندیی پێویست و بەڵگەنامەکان
- Step navigation و progress bar
- Assessment panel پێش PDF
- Preview screen پێش ناردن
- PDF generation بە QR
- WhatsApp handoff
- File upload و photo preview
- Premium visual layer لە `form-pro.css`
- Autosave، draft restore، Export JSON و shortcut ـەکان لە `form-pro.js`

## فایلە سەرەکییەکان

```text
index.html
styles.css
form-pro.css
app.js
form-pro.js
vendor/
assets/
```

## Shortcut ـەکان

- `Ctrl + S` یان `Cmd + S`: پاشەکەوتکردنی draft
- `Ctrl + Enter` یان `Cmd + Enter`: پێشبینینی فۆڕم

## تێبینی گرنگ

ئەم فۆڕمە بە شێوەی static کار دەکات. زانیارییەکانی draft لە browser ـی بەکارهێنەر و بە `localStorage` پاشەکەوت دەکرێن، بۆیە ئەگەر لەسەر ئامێری گشتی بەکاربهێنرێت، پێویستە دوای تەواوبوون draft پاک بکرێتەوە.

## پێش deploy

- ژمارەی WhatsApp لە `app.js` پشتڕاست بکەوە.
- font و vendor files لە `assets/` و `vendor/` هەبن.
- PDF و QR لە mobile و desktop تاقی بکەوە.
- فۆڕمێکی تەواو پڕبکەرەوە و export/PDF/WhatsApp تاقی بکەوە.
