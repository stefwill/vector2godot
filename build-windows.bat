@echo off
echo Building Vector Drawing App for Windows 11...

echo Building web application...
call npm run build

if %errorlevel% neq 0 (
    echo Web build failed!
    exit /b 1
)

echo Web build successful!

echo Building Windows application...
call npm run dist:win

if %errorlevel% neq 0 (
    echo Windows build failed!
    exit /b 1
)

echo Build complete! Check the 'release' folder for your Windows app.
echo.
echo Available files:
dir release\*.exe
dir release\*.msi
echo.
echo Installation options:
echo   - NSIS Installer (.exe) - Recommended for most users
echo   - MSI Package (.msi) - For enterprise deployment
echo   - Portable (.exe) - No installation required
