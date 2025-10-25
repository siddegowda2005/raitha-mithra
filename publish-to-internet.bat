@echo off
echo.
echo 🌐 RAITHA MITHRA - Publish to Internet
echo =====================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the RAITHA MITHRA project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo 🎯 Goal: Make your project accessible via a web link that friends can click!
echo.
echo 📋 Publishing Options:
echo 1. Vercel + Railway (Recommended - Best Features)
echo 2. Railway Only (Simplest - One Platform)
echo 3. Netlify + Railway (Good Alternative)
echo 4. GitHub Pages (Frontend Only)
echo.

set /p choice="Select publishing option (1-4): "

if "%choice%"=="1" goto vercel_railway
if "%choice%"=="2" goto railway_only
if "%choice%"=="3" goto netlify_railway
if "%choice%"=="4" goto github_pages
goto invalid_choice

:vercel_railway
echo.
echo 🚀 Vercel + Railway Deployment (Recommended)
echo.
echo 📋 Step-by-Step Instructions:
echo.
echo 1️⃣ Prepare GitHub Repository:
echo    - Go to https://github.com
echo    - Create a new repository called 'raitha-mithra'
echo    - Copy the repository URL
echo.
set /p githubUrl="Enter your GitHub repository URL (e.g., https://github.com/username/raitha-mithra.git): "
echo.
echo 2️⃣ Push Code to GitHub:
echo    - Run: git init
echo    - Run: git add .
echo    - Run: git commit -m "RAITHA MITHRA - Farm Equipment Rental Platform"
echo    - Run: git remote add origin %githubUrl%
echo    - Run: git branch -M main
echo    - Run: git push -u origin main
echo.
echo 3️⃣ Deploy Backend to Railway:
echo    - Go to https://railway.app
echo    - Sign up with GitHub
echo    - Click 'New Project' > 'Deploy from GitHub repo'
echo    - Select your repository
echo    - Set root directory to 'backend'
echo    - Add environment variables:
echo      * MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/raitha_mithra
echo      * JWT_SECRET: raitha_mithra_jwt_secret_key_2024_secure
echo      * NODE_ENV: production
echo    - Click Deploy
echo.
set /p backendUrl="Enter your Railway backend URL (e.g., https://your-app.railway.app): "
echo.
echo 4️⃣ Deploy Frontend to Vercel:
echo    - Go to https://vercel.com
echo    - Sign up with GitHub
echo    - Click 'New Project'
echo    - Import your repository
echo    - Set Framework Preset: Vite
echo    - Set Root Directory: frontend
echo    - Set Build Command: npm run build
echo    - Set Output Directory: dist
echo    - Add Environment Variable:
echo      * VITE_API_URL: %backendUrl%
echo    - Click Deploy
echo.
echo 🎉 Your website will be live at: https://your-project.vercel.app
echo 📱 Share this link with your friends!
goto end

:railway_only
echo.
echo 🚀 Railway Only Deployment (Simplest)
echo.
echo 📋 Step-by-Step Instructions:
echo.
echo 1️⃣ Prepare GitHub Repository:
echo    - Go to https://github.com
echo    - Create a new repository called 'raitha-mithra'
echo    - Upload your project files
echo.
echo 2️⃣ Deploy Backend to Railway:
echo    - Go to https://railway.app
echo    - Sign up with GitHub
echo    - Click 'New Project' > 'Deploy from GitHub repo'
echo    - Select your repository
echo    - Set root directory to 'backend'
echo    - Add environment variables (same as above)
echo    - Click Deploy
echo.
echo 3️⃣ Deploy Frontend to Railway:
echo    - Create another Railway project
echo    - Select your repository
echo    - Set root directory to 'frontend'
echo    - Set build command: npm run build
echo    - Set start command: npx serve dist
echo    - Add environment variable: VITE_API_URL: your-backend-url
echo    - Click Deploy
echo.
echo 🎉 Your website will be live at: https://your-frontend.railway.app
goto end

:netlify_railway
echo.
echo 🚀 Netlify + Railway Deployment
echo.
echo 📋 Step-by-Step Instructions:
echo.
echo 1️⃣ Deploy Backend to Railway (same as above)
echo.
echo 2️⃣ Deploy Frontend to Netlify:
echo    - Go to https://netlify.com
echo    - Sign up with GitHub
echo    - Click 'New site from Git'
echo    - Choose your repository
echo    - Set Base directory: frontend
echo    - Set Build command: npm run build
echo    - Set Publish directory: frontend/dist
echo    - Add environment variable: VITE_API_URL: your-backend-url
echo    - Click Deploy
echo.
echo 🎉 Your website will be live at: https://your-project.netlify.app
goto end

:github_pages
echo.
echo 🚀 GitHub Pages Deployment (Frontend Only)
echo.
echo 📋 Step-by-Step Instructions:
echo.
echo 1️⃣ Push Code to GitHub:
echo    - Upload your project to GitHub
echo.
echo 2️⃣ Enable GitHub Pages:
echo    - Go to your repository settings
echo    - Scroll to 'Pages' section
echo    - Select source: 'Deploy from a branch'
echo    - Choose 'main' branch and '/ (root)' folder
echo    - Click Save
echo.
echo 🎉 Your website will be live at: https://YOUR_USERNAME.github.io/REPOSITORY_NAME
echo ⚠️  Note: This is frontend only. You'll need a separate backend deployment.
goto end

:invalid_choice
echo.
echo ❌ Invalid option selected
echo Please run the script again and select 1-4
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
echo 🎉 Thank you for using RAITHA MITHRA!
echo 🚜 Empowering Farmers, Connecting Communities!
echo.
pause
