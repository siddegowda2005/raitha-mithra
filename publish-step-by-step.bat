@echo off
echo.
echo 🌐 RAITHA MITHRA - Step-by-Step Internet Publishing
echo ==================================================
echo.

echo 🎯 Goal: Make your project accessible via a web link that friends can click!
echo.

echo 📋 Choose Your Publishing Method:
echo 1. Vercel + Railway (Recommended - Best Features)
echo 2. Railway Only (Simplest - One Platform)
echo 3. Netlify + Railway (Good Alternative)
echo.

set /p choice="Select method (1-3): "

if "%choice%"=="1" goto vercel_railway
if "%choice%"=="2" goto railway_only
if "%choice%"=="3" goto netlify_railway
goto invalid_choice

:vercel_railway
echo.
echo 🚀 METHOD 1: Vercel + Railway (RECOMMENDED)
echo ==========================================
echo.
echo Step 1: Create GitHub Repository
echo --------------------------------
echo 1. Go to https://github.com
echo 2. Sign up/Login with your account
echo 3. Click "New repository" (green button)
echo 4. Repository name: raitha-mithra
echo 5. Description: Farm Equipment Rental Platform
echo 6. Make it Public (so it's free)
echo 7. Click "Create repository"
echo 8. Copy the repository URL
echo.
set /p githubUrl="Enter your GitHub repository URL (e.g., https://github.com/username/raitha-mithra.git): "
echo.
echo Step 2: Upload Your Code to GitHub
echo ----------------------------------
echo Option A: Using GitHub Website (Easiest)
echo 1. Go to your repository page
echo 2. Click "uploading an existing file"
echo 3. Drag and drop your entire RAITHA MITHRA folder
echo 4. Write commit message: "Initial commit"
echo 5. Click "Commit changes"
echo.
echo Option B: Using Git Commands
echo Run these commands in your project directory:
echo git init
echo git add .
echo git commit -m "RAITHA MITHRA - Farm Equipment Rental Platform"
echo git remote add origin %githubUrl%
echo git branch -M main
echo git push -u origin main
echo.
pause
echo.
echo Step 3: Deploy Backend to Railway
echo --------------------------------
echo 1. Go to https://railway.app
echo 2. Sign up with GitHub (click "Login with GitHub")
echo 3. Click "New Project"
echo 4. Select "Deploy from GitHub repo"
echo 5. Choose your raitha-mithra repository
echo 6. Click "Deploy Now"
echo 7. Wait for deployment to complete
echo 8. Click on your project
echo 9. Go to "Variables" tab
echo 10. Add these environment variables:
echo     - MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/raitha_mithra
echo     - JWT_SECRET: raitha_mithra_jwt_secret_key_2024_secure
echo     - NODE_ENV: production
echo     - PORT: 5001
echo 11. Click "Deploy" again
echo 12. Copy your backend URL
echo.
set /p backendUrl="Enter your Railway backend URL (e.g., https://your-app.railway.app): "
echo.
echo Step 4: Deploy Frontend to Vercel
echo ----------------------------------
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub (click "Login with GitHub")
echo 3. Click "New Project"
echo 4. Import your raitha-mithra repository
echo 5. Configure Project:
echo    - Framework Preset: Vite
echo    - Root Directory: frontend
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo 6. Go to "Environment Variables"
echo 7. Add this variable:
echo    - VITE_API_URL: %backendUrl%
echo 8. Click "Deploy"
echo 9. Wait for deployment
echo 10. Copy your frontend URL
echo.
set /p frontendUrl="Enter your Vercel frontend URL (e.g., https://your-project.vercel.app): "
echo.
echo 🎉 SUCCESS! Your website is now live!
echo ====================================
echo ✅ Your website: %frontendUrl%
echo ✅ Backend API: %backendUrl%
echo.
echo 📱 Share this link with your friends:
echo %frontendUrl%
echo.
echo 🎯 What your friends can do:
echo - Register as farmer or equipment owner
echo - Browse available equipment
echo - Book equipment for rent
echo - Leave reviews
echo.
goto end

:railway_only
echo.
echo 🚀 METHOD 2: Railway Only (SIMPLEST)
echo ====================================
echo.
echo Step 1: Create GitHub Repository (Same as above)
echo.
echo Step 2: Deploy Backend to Railway
echo ---------------------------------
echo 1. Go to https://railway.app
echo 2. Sign up with GitHub
echo 3. Click "New Project"
echo 4. Select "Deploy from GitHub repo"
echo 5. Choose your repository
echo 6. Set Root Directory: backend
echo 7. Add environment variables (same as above)
echo 8. Deploy
echo 9. Copy backend URL
echo.
echo Step 3: Deploy Frontend to Railway
echo ----------------------------------
echo 1. Create another Railway project
echo 2. Select same repository
echo 3. Set Root Directory: frontend
echo 4. Set Build Command: npm run build
echo 5. Set Start Command: npx serve dist
echo 6. Add Environment Variable: VITE_API_URL: your-backend-url
echo 7. Deploy
echo 8. Copy frontend URL
echo.
echo 🎉 SUCCESS! Your website is now live!
echo ====================================
echo ✅ Your website: https://your-frontend.railway.app
echo ✅ Backend API: https://your-backend.railway.app
echo.
goto end

:netlify_railway
echo.
echo 🚀 METHOD 3: Netlify + Railway
echo =============================
echo.
echo Step 1: Deploy Backend to Railway (Same as above)
echo.
echo Step 2: Deploy Frontend to Netlify
echo ----------------------------------
echo 1. Go to https://netlify.com
echo 2. Sign up with GitHub
echo 3. Click "New site from Git"
echo 4. Choose your repository
echo 5. Configure Build:
echo    - Base directory: frontend
echo    - Build command: npm run build
echo    - Publish directory: frontend/dist
echo 6. Add Environment Variable: VITE_API_URL: your-railway-backend-url
echo 7. Deploy
echo 8. Copy your Netlify URL
echo.
echo 🎉 SUCCESS! Your website is now live!
echo ====================================
echo ✅ Your website: https://your-project.netlify.app
echo ✅ Backend API: https://your-backend.railway.app
echo.
goto end

:invalid_choice
echo.
echo ❌ Invalid option selected
echo Please run the script again and select 1-3
pause
goto end

:end
echo.
echo 🎯 After Deployment:
echo ✅ Your friends can access your website via the link
echo ✅ They can register, login, and use all features
echo ✅ It works like a real website!
echo.
echo 📱 Share Message Template:
echo Hey! Check out my farm equipment rental platform:
echo https://your-website-url.com
echo.
echo You can:
echo - Register as a farmer or equipment owner
echo - Browse available equipment
echo - Book equipment for rent
echo - Leave reviews
echo.
echo Test credentials:
echo Farmer: farmer@test.com / password123
echo Owner: owner@test.com / password123
echo.
echo 🎉 Thank you for using RAITHA MITHRA!
echo 🚜 Empowering Farmers, Connecting Communities!
echo.
pause
