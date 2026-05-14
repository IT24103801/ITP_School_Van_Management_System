@echo off
echo ========================================
echo  STARTING ALL 6 BACKENDS (VISIBLE)
echo  You'll see 6 windows with backend logs
echo ========================================
echo.

echo Starting backends in visible windows so you can see any errors...
echo.

start "Backend 1 - Route (3001)" cmd /k "cd IT23224902-route-schedule\backend && npm start"
timeout /t 2 /nobreak >nul

start "Backend 2 - Emergency (3002)" cmd /k "cd IT24200911-emergency-safety\backend && npm start"
timeout /t 2 /nobreak >nul

start "Backend 3 - Attendance (3003)" cmd /k "cd IT24103801-attendance\backend && npm start"
timeout /t 2 /nobreak >nul

start "Backend 4 - Parent (3004)" cmd /k "cd IT24103642-parent-student\backend && npm start"
timeout /t 2 /nobreak >nul

start "Backend 5 - Billing (3005)" cmd /k "cd IT24104170-billing-payment\backend && npm start"
timeout /t 2 /nobreak >nul

start "Backend 6 - Driver (3006)" cmd /k "cd IT24102655-driver-vehicle\backend && npm start"

echo.
echo ========================================
echo  6 backend windows opened!
echo  Check each window for errors
echo ========================================
echo.
echo Look for messages like:
echo   "running on port XXXX" = GOOD
echo   "Error:" or "Cannot find module" = BAD
echo.
pause
