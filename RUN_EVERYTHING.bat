@echo off
cls
echo STARTING COMPLETE SCHOOL VAN MANAGEMENT SYSTEM        ║
echo.

echo Step 1: Starting all 6 backends...
echo.

REM Start all backends in separate windows
start "Backend 1 - Route" /MIN cmd /c "cd IT23224902-route-schedule\backend && npm start"
start "Backend 2 - Emergency" /MIN cmd /c "cd IT24200911-emergency-safety\backend && npm start"
start "Backend 3 - Attendance" /MIN cmd /c "cd IT24103801-attendance\backend && npm start"
start "Backend 4 - Parent" /MIN cmd /c "cd IT24103642-parent-student\backend && npm start"
start "Backend 5 - Billing" /MIN cmd /c "cd IT24104170-billing-payment\backend && npm start"
start "Backend 6 - Driver" /MIN cmd /c "cd IT24102655-driver-vehicle\backend && npm start"

echo All 6 backends starting in background...
echo.
echo Waiting 10 seconds for backends to initialize...
timeout /t 10 /nobreak

echo.
echo Step 2: Starting frontend app...
echo.

cd COMPLETE-APP
npm start

pause
