# PowerShell Script to update PHP include paths for cPanel deployment
# For Windows users - run in PowerShell

Write-Host "=== PHP Include Path Migration Script (Windows) ===" -ForegroundColor Yellow
Write-Host "This script will update all PHP require/include statements for cPanel deployment." -ForegroundColor Cyan
Write-Host ""

$apiPath = ".\backend\api"
$updatedCount = 0
$totalCount = 0

# Define replacements
$replacements = @{
    "require_once '../../config/Database.php';" = "require_once '../config/Database.php';"
    "require_once '../../models/" = "require_once '../models/"
    "require_once '../../config/" = "require_once '../config/"
    "require '../../config/Database.php';" = "require '../config/Database.php';"
    "include_once '../../config/Database.php';" = "include_once '../config/Database.php';"
}

# Find all PHP files
$phpFiles = Get-ChildItem -Path $apiPath -Filter "*.php" -Recurse

Write-Host "Found $($phpFiles.Count) PHP files to process..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $phpFiles) {
    $totalCount++
    $fileUpdated = $false
    
    # Create backup
    $backupPath = $file.FullName + ".backup"
    Copy-Item -Path $file.FullName -Destination $backupPath -Force
    
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Yellow
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Apply each replacement
    foreach ($oldPattern in $replacements.Keys) {
        $newPattern = $replacements[$oldPattern]
        
        if ($content -like "*$oldPattern*") {
            $content = $content -replace [regex]::Escape($oldPattern), $newPattern
            Write-Host "  ✓ Updated: $oldPattern" -ForegroundColor Green
            $fileUpdated = $true
        }
    }
    
    # Write updated content back
    if ($fileUpdated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updatedCount++
    }
}

Write-Host ""
Write-Host "=== Migration Complete ===" -ForegroundColor Green
Write-Host "Total files processed: $totalCount" -ForegroundColor Cyan
Write-Host "Total files updated: $updatedCount" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup files created with .backup extension" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Review the changes in the updated PHP files"
Write-Host "2. Test all API endpoints locally"
Write-Host "3. If all looks good, delete the .backup files"
Write-Host "4. Upload files to cPanel"
Write-Host ""

# Ask user if they want to verify files
$verify = Read-Host "Do you want to verify the changes? (Y/N)"
if ($verify -eq 'Y' -or $verify -eq 'y') {
    foreach ($file in $phpFiles | Select-Object -First 5) {
        Write-Host ""
        Write-Host "Preview of $($file.Name):" -ForegroundColor Cyan
        Get-Content -Path $file.FullName | Select-Object -First 15
    }
}
