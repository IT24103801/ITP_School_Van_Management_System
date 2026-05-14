@echo off
echo ========================================
echo  INSTALLING SEQUELIZE IN ALL BACKENDS
echo ========================================
echo.

echo [1/6] Installing in Route Schedule backend...
cd IT23224902-route-schedule\backend
call npm install sequelize mysql2
cd ..\..
echo.

echo [2/6] Installing in Emergency Safety backend...
cd IT24200911-emergency-safety\backend
call npm install sequelize mysql2
cd ..\..
echo.

echo [3/6] Installing in Attendance backend...
cd IT24103801-attendance\backend
call npm install sequelize mysql2
cd ..\..
echo.

echo [4/6] Installing in Parent Student backend...
cd IT24103642-parent-student\backend
call npm install sequelize mysql2
cd ..\..
echo.

echo [5/6] Installing in Billing backend...
cd IT24104170-billing-payment\backend
call npm install sequelize mysql2
cd ..\..
echo.

echo [6/6] Installing in Driver Vehicle backend...
cd IT24102655-driver-vehicle\backend
call npm install sequelize mysql2
cd ..\..
echo.

echo ========================================
echo  INSTALLATION COMPLETE!
echo ========================================
echo.
echo Sequelize and MySQL2 installed in all 6 backends.
echo.
echo Next step: Close all backend windows and run:
echo   🔧_START_BACKENDS_VISIBLE.bat
echo.
pause
