# PowerShell script to build and start the MCP server
Write-Host "Starting MCP Server Setup..." -ForegroundColor Cyan

# Step 0: Check for Node.js and minimum version
Write-Host "Checking for Node.js installation..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
$minVersion = [Version]"18.0.0"
$needInstall = $false
if (-not $node) {
    Write-Host "Node.js is not installed." -ForegroundColor Red
    $needInstall = $true
} else {
    $nodeVersionString = node -v
    $nodeVersionString = $nodeVersionString.TrimStart('v')
    try {
        $nodeVersion = [Version]$nodeVersionString
        if ($nodeVersion -lt $minVersion) {
            Write-Host "Node.js version $nodeVersionString is too old. Minimum required is $minVersion." -ForegroundColor Red
            $needInstall = $true
        } else {
            Write-Host "Node.js version $nodeVersionString detected (OK)." -ForegroundColor Green
        }
    } catch {
        Write-Host "Could not parse Node.js version. Proceeding to install latest." -ForegroundColor Red
        $needInstall = $true
    }
}
if ($needInstall) {
    Write-Host "Downloading and installing the latest Node.js..." -ForegroundColor Yellow
    $installer = "$env:TEMP\node-latest.msi"
    Invoke-WebRequest -Uri "https://nodejs.org/dist/latest/node-latest-x64.msi" -OutFile $installer
    Start-Process msiexec.exe -Wait -ArgumentList "/i", $installer, "/qn"
    Remove-Item $installer
    Write-Host "Node.js installation complete. Please restart your terminal and re-run this script." -ForegroundColor Green
    exit 0
}

# Step 1: Install dependencies
Write-Host "Installing dependencies (this may take a while)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Dependency installation failed. Please check for errors above." -ForegroundColor Red
    exit 1
}

# Step 2: Build the project
Write-Host "Building the MCP server..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please check for errors above." -ForegroundColor Red
    exit 1
}

# Step 3: Start the server
Write-Host "Starting the MCP server..." -ForegroundColor Green
npm start
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start the MCP server. Please check for errors above." -ForegroundColor Red
    exit 1
}
