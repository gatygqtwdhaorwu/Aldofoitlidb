# ALDO FOOTLOCKER static GitHub Pages build

This build preserves the original frontend and replaces the unavailable server-function calls with static JSON under `api/`.

Phone: +39 3500990297


## طريقة التشغيل الصحيحة محليًا (مهم جدًا)

لا تفتح `index.html` بالنقر المزدوج مباشرة — الموقع يستخدم fetch() لجلب بيانات من مجلد `api/`،
والمتصفحات تمنع هذا عند الفتح المباشر عبر file:// (فتظهر الواجهة ثم تختفي).

بدلاً من ذلك:
- **ماك/لينكس:** انقر مرتين على `تشغيل-الموقع-محليًا.command` ثم افتح http://localhost:8080
- **ويندوز:** انقر مرتين على `run-local.bat` ثم افتح http://localhost:8080
- أو يدويًا من Terminal داخل مجلد الموقع: `python3 -m http.server 8080`

## النشر على GitHub Pages (الطريقة الأساسية المخصصة لهذا الملف)
1. أنشئ مستودع جديد على GitHub وارفع كل هذه الملفات (بما فيها مجلد .github)
2. من إعدادات المستودع → Pages → Source: GitHub Actions
3. الموقع سينشر تلقائيًا ويعمل مباشرة بدون أي مشاكل
