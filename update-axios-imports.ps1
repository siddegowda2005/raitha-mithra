# PowerShell script to update axios imports to use the API configuration

$projectRoot = "$PSScriptRoot\frontend\src"

# Get all JavaScript and JSX files
$files = Get-ChildItem -Path $projectRoot -Recurse -Include *.js,*.jsx

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Skip files that already use the API configuration
    if ($content -match "import api from '../utils/api'" -or $content -match "import api from '\.\.[\\/]utils[\\/]api'") {
        Write-Host "Skipping $($file.FullName) - already using API configuration"
        continue
    }
    
    # Replace axios imports with API imports
    if ($content -match "import axios from 'axios'") {
        Write-Host "Updating $($file.FullName)"
        
        # Calculate relative path to utils/api.js
        $relativePath = "../utils/api"
        if ($file.DirectoryName -match "\\src\\(.+)$") {
            $subPath = $matches[1]
            $depth = ($subPath -split "[\\/]").Count
            $relativePath = (".." * $depth) + "/utils/api"
            $relativePath = $relativePath -replace "\/{2,}", "/"
        }
        
        # Replace axios import with API import
        $content = $content -replace "import axios from 'axios'", "import api from '$relativePath'"
        
        # Replace axios.get, axios.post, etc. with api.get, api.post, etc.
        $content = $content -replace "axios\.get\(", "api.get("
        $content = $content -replace "axios\.post\(", "api.post("
        $content = $content -replace "axios\.put\(", "api.put("
        $content = $content -replace "axios\.delete\(", "api.delete("
        $content = $content -replace "axios\.patch\(", "api.patch("
        
        # Remove Authorization headers since they're handled by the API configuration
        $content = $content -replace "headers:\s*\{\s*'Authorization':\s*`Bearer\s*\$\{token\}`\s*\}\s*", ""
        $content = $content -replace "headers:\s*\{\s*Authorization:\s*`Bearer\s*\$\{token\}`\s*\}\s*", ""
        
        # Remove axios.defaults.headers settings
        $content = $content -replace "axios\.defaults\.headers\.common\['Authorization'\]\s*=\s*`Bearer\s*\$\{.*?\}`;", ""
        $content = $content -replace "delete\s+axios\.defaults\.headers\.common\['Authorization'\];", ""
        
        # Save the updated content
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "Done updating axios imports"