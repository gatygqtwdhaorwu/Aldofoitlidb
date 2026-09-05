@echo off
REM انقر مرتين على هذا الملف لتشغيل الموقع محليًا بشكل صحيح على ويندوز
cd /d "%~dp0"
echo Starting local server...
echo Open your browser at: http://localhost:8080
python -m http.server 8080
pause
