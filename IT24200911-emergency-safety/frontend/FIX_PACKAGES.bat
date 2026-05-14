@echo off
echo Fixing package versions for Expo SDK 54...
echo.

echo Removing node_modules and package-lock.json...
rmdir /s /q node_modules
del package-lock.json

echo.
echo Installing correct package versions...
call npm install

echo.
echo Done! Now run: npx expo start
pause
