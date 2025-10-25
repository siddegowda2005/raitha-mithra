# RAITHA MITHRA - Easy Deployment Script
# This script will help you deploy your farm equipment rental platform

Write-Host "🚜 RAITHA MITHRA - Easy Deployment Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
  Write-Host "❌ Error: Please run this script from the RAITHA MITHRA project root directory" -ForegroundColor Red
  Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
  exit 1
}

Write-Host "`n📋 Deployment Options:" -ForegroundColor Yellow
Write-Host "1. Local Production Setup (Easiest)" -ForegroundColor White
Write-Host "2. Cloud Deployment (Railway + Vercel)" -ForegroundColor White
Write-Host "3. Docker Deployment" -ForegroundColor White
Write-Host "4. Just build and test locally" -ForegroundColor White

$choice = Read-Host "`nSelect deployment option (1-4)"

switch ($choice) {
  "1" {
    Write-Host "`n🏠 Setting up Local Production..." -ForegroundColor Yellow
        
    # Step 1: Install dependencies
    Write-Host "`n1. Installing dependencies..." -ForegroundColor Cyan
    try {
      npm run install-all
      Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    }
    catch {
      Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
      exit 1
    }
        
    # Step 2: Set up environment
    Write-Host "`n2. Setting up environment variables..." -ForegroundColor Cyan
    if (!(Test-Path "backend\.env")) {
      @"
MONGODB_URI=mongodb://localhost:27017/raitha_mithra
JWT_SECRET=raitha_mithra_jwt_secret_key_2024_secure
PORT=5001
NODE_ENV=production
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
      Write-Host "✅ Environment file created" -ForegroundColor Green
    }
    else {
      Write-Host "✅ Environment file already exists" -ForegroundColor Green
    }
        
    # Step 3: Build frontend
    Write-Host "`n3. Building frontend..." -ForegroundColor Cyan
    try {
      Set-Location "frontend"
      npm run build
      Set-Location ".."
      Write-Host "✅ Frontend built successfully" -ForegroundColor Green
    }
    catch {
      Write-Host "❌ Failed to build frontend" -ForegroundColor Red
      exit 1
    }
        
    # Step 4: Start services
    Write-Host "`n4. Starting services..." -ForegroundColor Cyan
    Write-Host "`n🚀 Starting Backend Server..." -ForegroundColor Yellow
    Write-Host "Backend will run on: http://localhost:5001" -ForegroundColor Cyan
        
    # Start backend in background
    Start-Process powershell -ArgumentList "-Command", "cd '$(Get-Location)\backend'; npm start" -WindowStyle Minimized
        
    Write-Host "`n⏳ Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
        
    # Test backend
    try {
      $response = Invoke-WebRequest -Uri "http://localhost:5001/api/health" -Method GET -TimeoutSec 10
      if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running successfully" -ForegroundColor Green
      }
    }
    catch {
      Write-Host "⚠️  Backend might still be starting..." -ForegroundColor Yellow
    }
        
    Write-Host "`n🌐 Starting Frontend Server..." -ForegroundColor Yellow
    Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
        
    # Start frontend
    Set-Location "frontend"
    Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
    Write-Host "=========================" -ForegroundColor Green
    Write-Host "✅ Backend: http://localhost:5001" -ForegroundColor Green
    Write-Host "✅ Frontend: http://localhost:3000" -ForegroundColor Green
    Write-Host "`n📋 Test Credentials:" -ForegroundColor Yellow
    Write-Host "Farmer: farmer@test.com / password123" -ForegroundColor White
    Write-Host "Owner: owner@test.com / password123" -ForegroundColor White
    Write-Host "`n🚀 Starting frontend server..." -ForegroundColor Yellow
    npx serve dist -p 3000
  }
    
  "2" {
    Write-Host "`n☁️  Cloud Deployment Setup..." -ForegroundColor Yellow
    Write-Host "`n📋 Steps for Cloud Deployment:" -ForegroundColor Cyan
    Write-Host "1. Push your code to GitHub" -ForegroundColor White
    Write-Host "2. Go to https://railway.app and create account" -ForegroundColor White
    Write-Host "3. Deploy backend to Railway" -ForegroundColor White
    Write-Host "4. Go to https://vercel.com and create account" -ForegroundColor White
    Write-Host "5. Deploy frontend to Vercel" -ForegroundColor White
    Write-Host "`n📖 Detailed instructions are in DEPLOYMENT_STEPS.md" -ForegroundColor Yellow
  }
    
  "3" {
    Write-Host "`n🐳 Docker Deployment Setup..." -ForegroundColor Yellow
    Write-Host "`n📋 Prerequisites:" -ForegroundColor Cyan
    Write-Host "- Docker Desktop installed" -ForegroundColor White
    Write-Host "- Docker Compose available" -ForegroundColor White
    Write-Host "`n🚀 To deploy with Docker:" -ForegroundColor Cyan
    Write-Host "1. Run: docker-compose up -d" -ForegroundColor White
    Write-Host "2. Access: http://localhost:3000" -ForegroundColor White
    Write-Host "`n📖 Detailed instructions are in DEPLOYMENT_STEPS.md" -ForegroundColor Yellow
  }
    
  "4" {
    Write-Host "`n🔧 Building and Testing Locally..." -ForegroundColor Yellow
        
    # Install dependencies
    Write-Host "`n1. Installing dependencies..." -ForegroundColor Cyan
    npm run install-all
        
    # Build frontend
    Write-Host "`n2. Building frontend..." -ForegroundColor Cyan
    Set-Location "frontend"
    npm run build
    Set-Location ".."
        
    Write-Host "`n✅ Build complete!" -ForegroundColor Green
    Write-Host "`n🚀 To start the application:" -ForegroundColor Yellow
    Write-Host "1. Open terminal 1: cd backend && npm start" -ForegroundColor White
    Write-Host "2. Open terminal 2: cd frontend && npx serve dist -p 3000" -ForegroundColor White
    Write-Host "3. Access: http://localhost:3000" -ForegroundColor White
  }
    
  default {
    Write-Host "`n❌ Invalid option selected" -ForegroundColor Red
    Write-Host "Please run the script again and select 1-4" -ForegroundColor Yellow
  }
}

Write-Host "`n🎉 Thank you for using RAITHA MITHRA!" -ForegroundColor Green
Write-Host "🚜 Empowering Farmers, Connecting Communities!" -ForegroundColor Green
