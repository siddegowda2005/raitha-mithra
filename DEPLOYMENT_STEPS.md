# 🚀 RAITHA MITHRA - Easy Deployment Guide

## 📋 Prerequisites
- Node.js 18+ installed
- MongoDB (local or cloud)
- Git (optional)
- A deployment platform account (Vercel, Netlify, Railway, etc.)

## 🎯 Deployment Options

### Option 1: Local Production Setup (Easiest)

#### Step 1: Prepare the Project
```bash
# Navigate to your project directory
cd "C:\Users\HP\OneDrive\Desktop\RAITHA MITHRA"

# Install all dependencies
npm run install-all
```

#### Step 2: Set up Environment Variables
```bash
# Backend environment
cd backend
echo MONGODB_URI=mongodb://localhost:27017/raitha_mithra > .env
echo JWT_SECRET=raitha_mithra_jwt_secret_key_2024_secure >> .env
echo PORT=5001 >> .env
echo NODE_ENV=production >> .env
```

#### Step 3: Build Frontend
```bash
cd frontend
npm run build
```

#### Step 4: Start Production Server
```bash
# Start backend
cd backend
npm start

# In another terminal, serve frontend
cd frontend
npx serve dist -p 3000
```

### Option 2: Cloud Deployment (Recommended)

#### A. Deploy to Railway (Easiest Cloud Option)

**Step 1: Create Railway Account**
1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your GitHub account

**Step 2: Deploy Backend**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production
5. Railway will automatically deploy your backend

**Step 3: Deploy Frontend**
1. Create another project on Railway
2. Select your frontend folder
3. Set build command: `npm run build`
4. Set start command: `npx serve dist`
5. Set environment variable: `VITE_API_URL`: Your backend URL

#### B. Deploy to Vercel (Frontend) + Railway (Backend)

**Backend (Railway):**
1. Follow Railway steps above for backend
2. Note your backend URL (e.g., https://your-app.railway.app)

**Frontend (Vercel):**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Set build command: `cd frontend && npm run build`
6. Set output directory: `frontend/dist`
7. Add environment variable: `VITE_API_URL`: Your Railway backend URL

### Option 3: Docker Deployment

#### Step 1: Create Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

#### Step 2: Create Dockerfile for Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 3: Create docker-compose.yml
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: raitha_mithra

  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/raitha_mithra
      JWT_SECRET: raitha_mithra_jwt_secret_key_2024_secure
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

#### Step 4: Deploy with Docker
```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps
```

## 🌐 Database Setup Options

### Option 1: Local MongoDB
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# Start MongoDB service
net start MongoDB
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to https://cloud.mongodb.com
2. Create free account
3. Create cluster
4. Get connection string
5. Use in your environment variables

### Option 3: Railway MongoDB
1. In Railway dashboard
2. Add MongoDB service
3. Use provided connection string

## 🔧 Environment Variables Setup

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/raitha_mithra
JWT_SECRET=raitha_mithra_jwt_secret_key_2024_secure
PORT=5001
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
```

## 📱 Step-by-Step Local Deployment

### Step 1: Install Dependencies
```bash
cd "C:\Users\HP\OneDrive\Desktop\RAITHA MITHRA"
npm run install-all
```

### Step 2: Set up Database
```bash
# Start MongoDB (if local)
# Or use MongoDB Atlas connection string

# Run seed scripts
cd backend
node seed-user.js
node seed-equipment.js
node seed-bookings.js
```

### Step 3: Build Frontend
```bash
cd frontend
npm run build
```

### Step 4: Start Production Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npx serve dist -p 3000
```

### Step 5: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## 🚀 Quick Deployment Commands

### For Local Production
```bash
# 1. Install dependencies
npm run install-all

# 2. Build frontend
cd frontend && npm run build

# 3. Start backend
cd ../backend && npm start

# 4. Serve frontend (in new terminal)
cd frontend && npx serve dist -p 3000
```

### For Cloud Deployment
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy to Railway/Vercel
# Follow platform-specific instructions
```

## 🔍 Troubleshooting

### Common Issues:
1. **Port already in use**: Change ports in configuration
2. **MongoDB connection failed**: Check connection string
3. **Build errors**: Check Node.js version (18+)
4. **CORS errors**: Update CORS configuration

### Debug Commands:
```bash
# Check if ports are free
netstat -an | findstr :3000
netstat -an | findstr :5001

# Check MongoDB connection
mongosh mongodb://localhost:27017/raitha_mithra

# Check Node.js version
node --version
npm --version
```

## 📊 Post-Deployment Checklist

- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] Database connected
- [ ] Authentication working
- [ ] Equipment listing working
- [ ] Booking system functional
- [ ] Review system working
- [ ] Mobile responsive

## 🎯 Recommended Deployment Path

**For Beginners:**
1. Use Railway for backend
2. Use Vercel for frontend
3. Use MongoDB Atlas for database

**For Advanced Users:**
1. Use Docker for local development
2. Deploy to AWS/GCP/Azure
3. Set up CI/CD pipeline

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify environment variables
3. Test API endpoints
4. Check database connection

---

**🚜 Your RAITHA MITHRA platform is ready to help farmers connect!**
