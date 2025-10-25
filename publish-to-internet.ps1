# 🌐 RAITHA MITHRA - Publish to Internet Script
# This script will help you make your project live on the internet

Write-Host "🌐 RAITHA MITHRA - Publish to Internet" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
  Write-Host "❌ Error: Please run this script from the RAITHA MITHRA project root directory" -ForegroundColor Red
  Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
  exit 1
}

Write-Host "`n🎯 Goal: Make your project accessible via a web link that friends can click!" -ForegroundColor Yellow
Write-Host "`n📋 Publishing Options:" -ForegroundColor Yellow
Write-Host "1. Vercel + Railway (Recommended - Best Features)" -ForegroundColor White
Write-Host "2. Railway Only (Simplest - One Platform)" -ForegroundColor White
Write-Host "3. Netlify + Railway (Good Alternative)" -ForegroundColor White
Write-Host "4. GitHub Pages (Frontend Only)" -ForegroundColor White

$choice = Read-Host "`nSelect publishing option (1-4)"

switch ($choice) {
  "1" {
    Write-Host "`n🚀 Vercel + Railway Deployment (Recommended)" -ForegroundColor Yellow
    Write-Host "`n📋 Step-by-Step Instructions:" -ForegroundColor Cyan
        
    Write-Host "`n1️⃣ Prepare GitHub Repository:" -ForegroundColor Yellow
    Write-Host "   - Go to https://github.com" -ForegroundColor White
    Write-Host "   - Create a new repository called 'raitha-mithra'" -ForegroundColor White
    Write-Host "   - Copy the repository URL" -ForegroundColor White
        
    $githubUrl = Read-Host "`nEnter your GitHub repository URL (e.g., https://github.com/username/raitha-mithra.git)"
        
    Write-Host "`n2️⃣ Push Code to GitHub:" -ForegroundColor Yellow
    try {
      if (!(Test-Path ".git")) {
        git init
      }
      git add .
      git commit -m "RAITHA MITHRA - Farm Equipment Rental Platform"
      git remote add origin $githubUrl
      git branch -M main
      git push -u origin main
      Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
    }
    catch {
      Write-Host "❌ Failed to push to GitHub. Please check your repository URL." -ForegroundColor Red
      Write-Host "You can also manually upload your files to GitHub." -ForegroundColor Yellow
    }
        
    Write-Host "`n3️⃣ Deploy Backend to Railway:" -ForegroundColor Yellow
    Write-Host "   - Go to https://railway.app" -ForegroundColor White
    Write-Host "   - Sign up with GitHub" -ForegroundColor White
    Write-Host "   - Click 'New Project' > 'Deploy from GitHub repo'" -ForegroundColor White
    Write-Host "   - Select your repository" -ForegroundColor White
    Write-Host "   - Set root directory to 'backend'" -ForegroundColor White
    Write-Host "   - Add environment variables:" -ForegroundColor White
    Write-Host "     * MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/raitha_mithra" -ForegroundColor White
    Write-Host "     * JWT_SECRET: raitha_mithra_jwt_secret_key_2024_secure" -ForegroundColor White
    Write-Host "     * NODE_ENV: production" -ForegroundColor White
    Write-Host "   - Click Deploy" -ForegroundColor White
        
    $backendUrl = Read-Host "`nEnter your Railway backend URL (e.g., https://your-app.railway.app)"
        
    Write-Host "`n4️⃣ Deploy Frontend to Vercel:" -ForegroundColor Yellow
    Write-Host "   - Go to https://vercel.com" -ForegroundColor White
    Write-Host "   - Sign up with GitHub" -ForegroundColor White
    Write-Host "   - Click 'New Project'" -ForegroundColor White
    Write-Host "   - Import your repository" -ForegroundColor White
    Write-Host "   - Set Framework Preset: Vite" -ForegroundColor White
    Write-Host "   - Set Root Directory: frontend" -ForegroundColor White
    Write-Host "   - Set Build Command: npm run build" -ForegroundColor White
    Write-Host "   - Set Output Directory: dist" -ForegroundColor White
    Write-Host "   - Add Environment Variable:" -ForegroundColor White
    Write-Host "     * VITE_API_URL: $backendUrl" -ForegroundColor White
    Write-Host "   - Click Deploy" -ForegroundColor White
        
    Write-Host "`n🎉 Your website will be live at: https://your-project.vercel.app" -ForegroundColor Green
    Write-Host "`n📱 Share this link with your friends!" -ForegroundColor Cyan
  }
    
  "2" {
    Write-Host "`n🚀 Railway Only Deployment (Simplest)" -ForegroundColor Yellow
    Write-Host "`n📋 Step-by-Step Instructions:" -ForegroundColor Cyan
        
    Write-Host "`n1️⃣ Prepare GitHub Repository:" -ForegroundColor Yellow
    Write-Host "   - Go to https://github.com" -ForegroundColor White
    Write-Host "   - Create a new repository called 'raitha-mithra'" -ForegroundColor White
    Write-Host "   - Upload your project files" -ForegroundColor White
        
    Write-Host "`n2️⃣ Deploy Backend to Railway:" -ForegroundColor Yellow
    Write-Host "   - Go to https://railway.app" -ForegroundColor White
    Write-Host "   - Sign up with GitHub" -ForegroundColor White
    Write-Host "   - Click 'New Project' > 'Deploy from GitHub repo'" -ForegroundColor White
    Write-Host "   - Select your repository" -ForegroundColor White
    Write-Host "   - Set root directory to 'backend'" -ForegroundColor White
    Write-Host "   - Add environment variables (same as above)" -ForegroundColor White
    Write-Host "   - Click Deploy" -ForegroundColor White
        
    Write-Host "`n3️⃣ Deploy Frontend to Railway:" -ForegroundColor Yellow
    Write-Host "   - Create another Railway project" -ForegroundColor White
    Write-Host "   - Select your repository" -ForegroundColor White
    Write-Host "   - Set root directory to 'frontend'" -ForegroundColor White
    Write-Host "   - Set build command: npm run build" -ForegroundColor White
    Write-Host "   - Set start command: npx serve dist" -ForegroundColor White
    Write-Host "   - Add environment variable: VITE_API_URL: your-backend-url" -ForegroundColor White
    Write-Host "   - Click Deploy" -ForegroundColor White
        
    Write-Host "`n🎉 Your website will be live at: https://your-frontend.railway.app" -ForegroundColor Green
  }
    
  "3" {
    Write-Host "`n🚀 Netlify + Railway Deployment" -ForegroundColor Yellow
    Write-Host "`n📋 Step-by-Step Instructions:" -ForegroundColor Cyan
        
    Write-Host "`n1️⃣ Deploy Backend to Railway (same as above)" -ForegroundColor Yellow
    Write-Host "`n2️⃣ Deploy Frontend to Netlify:" -ForegroundColor Yellow
    Write-Host "   - Go to https://netlify.com" -ForegroundColor White
    Write-Host "   - Sign up with GitHub" -ForegroundColor White
    Write-Host "   - Click 'New site from Git'" -ForegroundColor White
    Write-Host "   - Choose your repository" -ForegroundColor White
    Write-Host "   - Set Base directory: frontend" -ForegroundColor White
    Write-Host "   - Set Build command: npm run build" -ForegroundColor White
    Write-Host "   - Set Publish directory: frontend/dist" -ForegroundColor White
    Write-Host "   - Add environment variable: VITE_API_URL: your-backend-url" -ForegroundColor White
    Write-Host "   - Click Deploy" -ForegroundColor White
        
    Write-Host "`n🎉 Your website will be live at: https://your-project.netlify.app" -ForegroundColor Green
  }
    
  "4" {
    Write-Host "`n🚀 GitHub Pages Deployment (Frontend Only)" -ForegroundColor Yellow
    Write-Host "`n📋 Step-by-Step Instructions:" -ForegroundColor Cyan
        
    Write-Host "`n1️⃣ Push Code to GitHub:" -ForegroundColor Yellow
    Write-Host "   - Upload your project to GitHub" -ForegroundColor White
        
    Write-Host "`n2️⃣ Enable GitHub Pages:" -ForegroundColor Yellow
    Write-Host "   - Go to your repository settings" -ForegroundColor White
    Write-Host "   - Scroll to 'Pages' section" -ForegroundColor White
    Write-Host "   - Select source: 'Deploy from a branch'" -ForegroundColor White
    Write-Host "   - Choose 'main' branch and '/ (root)' folder" -ForegroundColor White
    Write-Host "   - Click Save" -ForegroundColor White
        
    Write-Host "`n🎉 Your website will be live at: https://YOUR_USERNAME.github.io/REPOSITORY_NAME" -ForegroundColor Green
    Write-Host "`n⚠️  Note: This is frontend only. You'll need a separate backend deployment." -ForegroundColor Yellow
  }
    
  default {
    Write-Host "`n❌ Invalid option selected" -ForegroundColor Red
    Write-Host "Please run the script again and select 1-4" -ForegroundColor Yellow
  }
}

Write-Host "`n🎯 After Deployment:" -ForegroundColor Yellow
Write-Host "✅ Your friends can access your website via the link" -ForegroundColor Green
Write-Host "✅ They can register, login, and use all features" -ForegroundColor Green
Write-Host "✅ It works like a real website!" -ForegroundColor Green

Write-Host "`n📱 Share Message Template:" -ForegroundColor Cyan
Write-Host "Hey! Check out my farm equipment rental platform:" -ForegroundColor White
Write-Host "https://your-website-url.com" -ForegroundColor White
Write-Host "`nYou can:" -ForegroundColor White
Write-Host "- Register as a farmer or equipment owner" -ForegroundColor White
Write-Host "- Browse available equipment" -ForegroundColor White
Write-Host "- Book equipment for rent" -ForegroundColor White
Write-Host "- Leave reviews" -ForegroundColor White

Write-Host "`n🎉 Thank you for using RAITHA MITHRA!" -ForegroundColor Green
Write-Host "🚜 Empowering Farmers, Connecting Communities!" -ForegroundColor Green
