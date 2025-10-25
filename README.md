# RAITHA MITHRA - Farm Equipment Rental Platform

A full-stack web application that connects farmers with equipment owners for efficient and cost-effective farm equipment rental.

## 🌟 Features

### For Equipment Owners
- List farm equipment with detailed descriptions and pricing
- Manage rental requests and approve/reject bookings
- Track equipment availability and earnings
- Update equipment information and status

### For Farmers
- Browse available farm equipment by type, location, and availability
- Book equipment for specific dates with instant pricing
- Track booking status and manage rental history
- Post reviews after completed rentals

### General Features
- User authentication with role-based access control
- Responsive design for mobile and desktop
- Real-time search and filtering
- Secure JWT-based authentication
- Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Vite** - Build tool

## 📁 Project Structure

```
raitha-mithra/
├── backend/                 # Backend server
│   ├── middleware/          # Authentication middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   └── server.js            # Entry point
├── frontend/                # React frontend
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # Context providers
│   │   ├── pages/           # Page components
│   │   └── utils/           # Utility functions
│   ├── .env                 # Environment variables
│   └── vite.config.js       # Vite configuration
```

## 🚀 Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Deployment Options

You can deploy RAITHA MITHRA in several ways:

1. **Traditional Deployment**: Deploy backend and frontend separately
2. **Docker Deployment**: Use Docker containers for easy deployment
3. **CI/CD Pipeline**: Automated deployment using GitHub Actions

### Backend Deployment

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/raitha-mithra.git
   cd raitha-mithra/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5001
     NODE_ENV=production
     ```
   - For production, use a cloud MongoDB URI (MongoDB Atlas recommended)

4. Start the server
   ```bash
   npm start
   ```

### Frontend Deployment

1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   - Create a `.env` file in the frontend directory
   - Add the following variables:
     ```
     VITE_APP_API_URL=https://your-backend-api-url
     VITE_APP_ENV=production
     VITE_APP_BASE_URL=/
     ```

4. Build the application
   ```bash
   npm run build
   ```

5. Deploy the `dist` folder to your web server or hosting service

### Deployment Platforms

- **Backend**: Heroku, DigitalOcean, AWS, Render
- **Frontend**: Vercel, Netlify, Firebase Hosting
- **Database**: MongoDB Atlas
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── main.jsx        # App entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── package.json            # Root package.json
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd raitha-mithra
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 3. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/raitha_mithra
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

**Note:** Replace `your_super_secret_jwt_key_here` with a strong, random string.

#### MongoDB Setup
- **Local MongoDB**: Ensure MongoDB is running on your system
- **MongoDB Atlas**: Use your Atlas connection string in `MONGODB_URI`

### 4. Start the Application

#### Option 1: Run Both Together (Recommended)
```bash
npm run dev
```
This will start both backend (port 5000) and frontend (port 3000) simultaneously.

#### Option 2: Run Separately

**Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📱 Available Scripts

### Root Directory
```bash
npm run dev          # Start both backend and frontend
npm run server       # Start only backend
npm run client       # Start only frontend
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production
```

### Backend Directory
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

### Frontend Directory
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - List all equipment (with filters)
- `GET /api/equipment/:id` - Get equipment details
- `POST /api/equipment` - Add new equipment (Owner only)
- `PUT /api/equipment/:id` - Update equipment (Owner only)
- `DELETE /api/equipment/:id` - Delete equipment (Owner only)
- `GET /api/equipment/my-equipment` - Get user's equipment (Owner only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking (Farmer only)
- `PUT /api/bookings/:id/status` - Update booking status (Owner only)
- `DELETE /api/bookings/:id` - Cancel booking (Farmer only)

### Reviews
- `GET /api/reviews/equipment/:equipmentId` - Get equipment reviews
- `GET /api/reviews/my-reviews` - Get user's reviews
- `POST /api/reviews` - Post review (Farmer only)
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 👥 User Roles

### Farmer
- Browse and search equipment
- Book equipment for specific dates
- View booking history and status
- Post reviews after completed rentals
- Cancel pending bookings

### Equipment Owner
- List farm equipment for rent
- Set pricing and availability
- Manage rental requests
- Approve/reject bookings
- Track earnings and equipment status

## 🎨 UI Components

The application uses a consistent design system with:
- **Color Scheme**: Primary green theme with gray accents
- **Components**: Cards, buttons, forms, and navigation
- **Responsive Design**: Mobile-first approach
- **Icons**: Lucide React icon library
- **Notifications**: Toast notifications for user feedback

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected API routes
- Secure password requirements

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred hosting service
3. Ensure MongoDB connection is accessible

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Update API base URL if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB connection
3. Ensure all environment variables are set
4. Check that all dependencies are installed

## 🎯 Future Enhancements

- Payment integration
- Equipment image upload
- Real-time chat between users
- Equipment maintenance tracking
- Advanced analytics and reporting
- Mobile app development

---

**Built with ❤️ for the farming community**
