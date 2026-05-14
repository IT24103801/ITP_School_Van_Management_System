@echo off
setlocal
cls
echo ========================================
echo  IMPORT JSON DATA TO MONGODB ATLAS
echo ========================================
echo.

set "JSON_FILE=%~dp0school_van_system (1).json"

if not exist "%JSON_FILE%" (
  echo ERROR: JSON file not found:
  echo   "%JSON_FILE%"
  echo.
  pause
  exit /b 1
)

echo Source JSON:
echo   "%JSON_FILE%"
echo.

pushd "IT23224902-route-schedule\backend" || (
  echo ERROR: Could not open route-schedule backend folder.
  pause
  exit /b 1
)

call node "scripts/importAllTablesFromJson.js" "%JSON_FILE%"
set "IMPORT_EXIT=%ERRORLEVEL%"
popd

echo.
if "%IMPORT_EXIT%"=="0" (
  echo Import completed successfully.
) else (
  echo Import failed with exit code %IMPORT_EXIT%.
)
echo.
pause
exit /b %IMPORT_EXIT%
