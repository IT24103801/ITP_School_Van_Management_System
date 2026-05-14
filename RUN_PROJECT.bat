@echo off
setlocal
cls
echo ========================================
echo  STARTING SCHOOL VAN MANAGEMENT SYSTEM
echo ========================================
echo.

echo Step 1/2 - Starting all 6 backends in separate windows...
start "Backend 1 - Route (3001)" cmd /k "cd /d ""%~dp0IT23224902-route-schedule\backend"" && npm start"
timeout /t 2 /nobreak >nul
start "Backend 2 - Emergency (3002)" cmd /k "cd /d ""%~dp0IT24200911-emergency-safety\backend"" && npm start"
timeout /t 2 /nobreak >nul
start "Backend 3 - Attendance (3003)" cmd /k "cd /d ""%~dp0IT24103801-attendance\backend"" && npm start"
timeout /t 2 /nobreak >nul
start "Backend 4 - Parent (3004)" cmd /k "cd /d ""%~dp0IT24103642-parent-student\backend"" && npm start"
timeout /t 2 /nobreak >nul
start "Backend 5 - Billing (3005)" cmd /k "cd /d ""%~dp0IT24104170-billing-payment\backend"" && npm start"
timeout /t 2 /nobreak >nul
start "Backend 6 - Driver (3006)" cmd /k "cd /d ""%~dp0IT24102655-driver-vehicle\backend"" && npm start"

echo.
echo Waiting 10 seconds for backend startup...
timeout /t 10 /nobreak >nul

echo.
echo Step 2/2 - Starting frontend (Expo)...
cd /d "%~dp0COMPLETE-APP"
call npm start

endlocal
