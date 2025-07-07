# PowerShell script for building Windows 11 app
Write-Host "🚀 Building Vector Drawing App for Windows 11..." -ForegroundColor Cyan

# Build web application
Write-Host "📦 Building web application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Web build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Web build successful!" -ForegroundColor Green

# Build Windows application
Write-Host "🖥️ Building Windows application..." -ForegroundColor Yellow
npm run dist:win

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Windows build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Build complete! Check the 'release' folder for your Windows app." -ForegroundColor Green
Write-Host ""
Write-Host "Available files:" -ForegroundColor Cyan
Get-ChildItem release\*.exe | Format-Table Name, Length, LastWriteTime
Get-ChildItem release\*.msi | Format-Table Name, Length, LastWriteTime

Write-Host "📝 Installation options:" -ForegroundColor Yellow
Write-Host "  - NSIS Installer (.exe) - Recommended for most users" -ForegroundColor White
Write-Host "  - MSI Package (.msi) - For enterprise deployment" -ForegroundColor White  
Write-Host "  - Portable (.exe) - No installation required" -ForegroundColor White

Write-Host ""
Write-Host "🎯 To test the installer:" -ForegroundColor Cyan
Write-Host "  .\release\`"Vector Drawing App for Godot Setup 1.0.0.exe`"" -ForegroundColor White
