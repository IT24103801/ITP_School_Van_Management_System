@echo off
echo Testing if all backends are running...
echo.

echo Testing Port 3001 (Route Schedule)...
curl http://localhost:3001/api/routes 2>nul
if %errorlevel% equ 0 (echo Port 3001 OK) else (echo Port 3001 NOT responding)
echo.

echo Testing Port 3002 (Emergency Safety)...
curl http://localhost:3002/api/sos 2>nul
if %errorlevel% equ 0 (echo Port 3002 OK) else (echo Port 3002 NOT responding)
echo.

echo Testing Port 3003 (Attendance)...
curl http://localhost:3003/api/attendance 2>nul
if %errorlevel% equ 0 (echo Port 3003 OK) else (echo Port 3003 NOT responding)
echo.

echo Testing Port 3004 (Parent Student)...
curl http://localhost:3004/api/parents 2>nul
if %errorlevel% equ 0 (echo Port 3004 OK) else (echo Port 3004 NOT responding)
echo.

echo Testing Port 3005 (Billing)...
curl http://localhost:3005/api/billing 2>nul
if %errorlevel% equ 0 (echo Port 3005 OK) else (echo Port 3005 NOT responding)
echo.

echo Testing Port 3006 (Driver Vehicle)...
curl http://localhost:3006/api/drivers 2>nul
if %errorlevel% equ 0 (echo Port 3006 OK) else (echo Port 3006 NOT responding)
echo.

pause
