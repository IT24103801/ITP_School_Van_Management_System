@echo off
setlocal
cls
echo ========================================
echo  INSTALLING DEPENDENCIES (ALL MODULES)
echo ========================================
echo.

call :install "COMPLETE-APP" "Frontend (Expo App)"
call :install "IT23224902-route-schedule\backend" "Route and Schedule Backend"
call :install "IT24200911-emergency-safety\backend" "Emergency and Safety Backend"
call :install "IT24103801-attendance\backend" "Attendance Backend"
call :install "IT24103642-parent-student\backend" "Parent and Student Backend"
call :install "IT24104170-billing-payment\backend" "Billing Backend"
call :install "IT24102655-driver-vehicle\backend" "Driver and Vehicle Backend"

echo.
echo ========================================
echo  ALL DEPENDENCIES INSTALLED
echo ========================================
echo.
pause
exit /b 0

:install
set "TARGET=%~1"
set "LABEL=%~2"
echo [Installing] %LABEL%
pushd "%TARGET%" || (
  echo   FAILED: Could not enter "%TARGET%"
  echo.
  goto :eof
)
call npm install
if errorlevel 1 (
  echo   FAILED: npm install in "%TARGET%"
) else (
  echo   OK: %LABEL%
)
popd
echo.
goto :eof
