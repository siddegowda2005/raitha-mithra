@echo off
echo.
echo 🚜 RAITHA MITHRA - Easy Deployment
echo =================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the RAITHA MITHRA project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo 📋 Deployment Options:
echo 1. Local Production Setup (Easiest)
echo 2. Cloud Deployment (Railway + Vercel)
echo 3. Docker Deployment
echo 4. Just build and test locally
echo.

set /p choice="Select deployment option (1-4): "

if "%choice%"=="1" goto local_production
if "%choice%"=="2" goto cloud_deployment
if "%choice%"=="3" goto docker_deployment
if "%choice%"=="4" goto build_only
goto invalid_choice

:local_production
echo.
echo 🏠 Setting up Local Production...
echo.

echo 1. Installing dependencies...
call npm run install-all
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo.
echo 2. Setting up environment variables...
if not exist "backend\.env" (
    echo MONGODB_URI=mongodb://localhost:27017/raitha_mithra > backend\.env
    echo JWT_SECRET=raitha_mithra_jwt_secret_key_2024_secure >> backend\.env
    echo PORT=5001 >> backend\.env
    echo NODE_ENV=production >> backend\.env
    echo ✅ Environment file created
) else (
    echo ✅ Environment file already exists
)

echo.
echo 3. Building frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend built successfully

echo.
echo 🎉 Deployment Complete!
echo ========================
echo ✅ Backend: http://localhost:5001
echo ✅ Frontend: http://localhost:3000
echo.
echo 📋 Test Credentials:
echo Farmer: farmer@test.com / password123
echo Owner: owner@test.com / password123
echo.
echo 🚀 Starting services...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
cd frontend
start "Frontend Server" cmd /k "npx serve dist -p 3000"
cd ..

echo.
echo ✅ Both servers are starting...
echo 🌐 Access your application at: http://localhost:3000
echo.
pause
goto end

:cloud_deployment
echo.
echo ☁️ Cloud Deployment Setup...
echo.
echo 📋 Steps for Cloud Deployment:
echo 1. Push your code to GitHub
echo 2. Go to https://railway.app and create account
echo 3. Deploy backend to Railway
echo 4. Go to https://vercel.com and create account
echo 5. Deploy frontend to Vercel
echo.
echo 📖 Detailed instructions are in DEPLOYMENT_STEPS.md
pause
goto end

:docker_deployment
echo.
echo 🐳 Docker Deployment Setup...
echo.
echo 📋 Prerequisites:
echo - Docker Desktop installed
echo - Docker Compose available
echo.
echo 🚀 To deploy with Docker:
echo 1. Run: docker-compose up -d
echo 2. Access: http://localhost:3000
echo.
echo 📖 Detailed instructions are in DEPLOYMENT_STEPS.md
pause
goto end

:build_only
echo.
echo 🔧 Building and Testing Locally...
echo.

echo 1. Installing dependencies...
call npm run install-all

echo.
echo 2. Building frontend...
cd frontend
call npm run build
cd ..

echo.
echo ✅ Build complete!
echo.
echo 🚀 To start the application:
echo 1. Open terminal 1: cd backend && npm start
echo 2. Open terminal 2: cd frontend && npx serve dist -p 3000
echo 3. Access: http://localhost:3000
echo.
pause
goto end

:invalid_choice
echo.
echo ❌ Invalid option selected
echo Please run the script again and select 1-4
pause
goto end

:end
echo.
echo 🎉 Thank you for using RAITHA MITHRA!
echo 🚜 Empowering Farmers, Connecting Communities!
echo.
