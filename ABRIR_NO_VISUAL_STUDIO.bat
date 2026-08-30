@echo off
start "" "%~dp0"
where devenv >nul 2>&1
if %errorlevel%==0 (
  devenv "%~dp0"
) else (
  start "" cmd /k "cd /d %~dp0 && npm install && npm run dev"
)
