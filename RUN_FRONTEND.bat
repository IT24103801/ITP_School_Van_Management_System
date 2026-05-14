@echo off
setlocal
cls
echo ========================================
echo  STARTING FRONTEND (EXPO)
echo ========================================
echo.

cd /d "%~dp0COMPLETE-APP" || (
  echo ERROR: Could not open COMPLETE-APP folder.
  pause
  exit /b 1
)

call npm start

endlocal
