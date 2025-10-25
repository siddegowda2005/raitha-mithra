# Raitha Mithra Project Debug Guide

This comprehensive guide will help you troubleshoot and fix common issues in the Raitha Mithra project. Follow these step-by-step instructions to resolve registration, login, equipment addition, and booking problems.

## Quick Fix Commands

If you're in a hurry, try these commands first:

```bash
# From the project root directory
npm run dev

# In a separate terminal
cd backend
npm start
```

## Common Issues and Solutions

### 1. Registration Failed

**Problem:** User registration fails with errors or doesn't save user data.

**Step-by-Step Debugging:**

1. **Check Backend Server:**
   ```bash
   # In terminal
   cd backend
   npm start
   ```
   Verify the server starts without errors.

2. **Check MongoDB Connection:**
   ```bash
   # In terminal
   cd backend
   node -e "require('./server.js')"
   ```
   Look for "MongoDB connected" message.

3. **Fix Registration Issues:**
   
   a. **Check User Model (backend/models/User.js):**
   - Ensure email field is properly defined
   - Verify password hashing is working

   b. **Check Registration Route (backend/routes/auth.js):**
   - Look for validation errors
   - Ensure all required fields are being processed

   c. **Fix Frontend Registration Form:**
   - Open `frontend/src/pages/Register.jsx`
   - Ensure form includes all required fields (name, phone, email, password, role)
   - Check form submission function sends correct data format

   d. **Common Fix:**
   ```javascript
   // In frontend/src/pages/Register.jsx
   // Make sure formData includes email field
   const [formData, setFormData] = useState({
     name: '',
     phone: '',
     email: '', // Make sure this exists
     password: '',
     role: 'farmer'
   });
   ```

### 2. Login Failed

**Problem:** Unable to log in with valid credentials.

**Step-by-Step Debugging:**

1. **Check Authentication Flow:**
   ```bash
   # In terminal
   cd backend
   npm start
   ```
   Watch server logs during login attempts.

2. **Fix Login Issues:**

   a. **Check Login Route (backend/routes/auth.js):**
   - Verify login endpoint is working
   - Check what credentials it expects (phone vs email)

   b. **Fix Frontend Login Logic:**
   - Open `frontend/src/contexts/AuthContext.jsx`
   - Ensure login function sends correct parameters
   
   c. **Common Fix:**
   ```javascript
   // In frontend/src/contexts/AuthContext.jsx
   // Change email to phone in login function
   const login = async (phone, password) => {
     try {
       setLoading(true);
       setError(null);
       
       const response = await api.post('/api/auth/login', { phone, password });
       
       if (response.data.token) {
         setAuthToken(response.data.token);
         setUser(response.data.user);
         localStorage.setItem('user', JSON.stringify(response.data.user));
         return true;
       }
     } catch (err) {
       console.error('Login error:', err.response?.data || err.message);
       setError(err.response?.data?.message || 'Failed to login');
       return false;
     } finally {
       setLoading(false);
     }
   };
   ```

   d. **Check Login Form:**
   - Open `frontend/src/pages/Login.jsx`
   - Ensure it passes phone (not email) to the login function

### 3. Failed to Add Equipment

**Problem:** Equipment addition fails or doesn't save to database.

**Step-by-Step Debugging:**

1. **Check Authentication Token:**
   - Open browser developer tools (F12)
   - Go to Application tab → Local Storage
   - Verify token exists and hasn't expired

2. **Fix Equipment Addition Issues:**

   a. **Check Equipment Route (backend/routes/equipment.js):**
   - Verify POST route is working
   - Check required fields and validation

   b. **Fix Frontend Equipment Form:**
   - Open `frontend/src/pages/AddEquipment.jsx`
   - Add console logs to debug form submission
   
   c. **Common Fix:**
   ```javascript
   // In frontend/src/utils/api.js
   // Ensure token is properly added to requests
   api.interceptors.request.use(
     (config) => {
       const token = localStorage.getItem('token');
       if (token) {
         console.log('Adding token to request:', token.substring(0, 10) + '...');
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     (error) => {
       return Promise.reject(error);
     }
   );
   ```

   d. **Check User Role:**
   - Only owners can add equipment
   - Verify user role in localStorage

### 4. Failed to Book Equipment

**Problem:** Unable to book equipment or booking doesn't save.

**Step-by-Step Debugging:**

1. **Check Booking Flow:**
   - Open browser console (F12)
   - Monitor network requests during booking attempt

2. **Fix Booking Issues:**

   a. **Check Booking Route (backend/routes/bookings.js):**
   - Verify POST route is working
   - Check required fields and validation

   b. **Fix Frontend Booking Form:**
   - Open `frontend/src/pages/EquipmentDetail.jsx`
   - Debug booking submission function
   
   c. **Common Fix:**
   ```javascript
   // In frontend/src/pages/EquipmentDetail.jsx
   // Add debugging to booking submission
   const handleBookingSubmit = async (e) => {
     e.preventDefault();
     
     if (!user) {
       setBookingError('Please log in to book equipment');
       return;
     }
     
     if (user.role !== 'farmer') {
       setBookingError('Only farmers can book equipment');
       return;
     }
     
     if (!startDate || !endDate) {
       setBookingError('Please select both start and end dates');
       return;
     }
     
     try {
       console.log('Submitting booking with data:', {
         equipment_id: equipment._id,
         start_date: startDate,
         end_date: endDate
       });
       
       const response = await api.post('/api/bookings', {
         equipment_id: equipment._id,
         start_date: startDate,
         end_date: endDate
       });
       
       console.log('Booking response:', response.data);
       setBookingSuccess('Equipment booked successfully!');
       setBookingError(null);
     } catch (err) {
       console.error('Booking error:', err.response?.data || err.message);
       setBookingError(err.response?.data?.message || 'Failed to book equipment');
     }
   };
   ```

   d. **Check User Authentication:**
   - Verify user is logged in
   - Ensure user role is 'farmer'

## Complete System Check

To verify all components are working:

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Registration:**
   - Create a new account with all required fields
   - Check MongoDB for the new user

4. **Test Login:**
   - Log in with phone and password
   - Verify token is stored in localStorage

5. **Test Equipment Addition (as owner):**
   - Add new equipment with all required fields
   - Check MongoDB for the new equipment

6. **Test Equipment Booking (as farmer):**
   - Browse equipment and select one
   - Book with valid dates
   - Check MongoDB for the new booking

## Advanced Debugging

### Check Backend Logs

```bash
cd backend
npm start
```

Watch for error messages during operations.

### Check Frontend Network Requests

1. Open browser developer tools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Perform the action that's failing
5. Examine request/response data

### Check Database Directly

```bash
# Using MongoDB Compass or mongo shell
mongo
use raitha_mithra
db.users.find()  # Check users
db.equipment.find()  # Check equipment
db.bookings.find()  # Check bookings
```

## Common Code Fixes

### Fix Registration Email Field

```javascript
// In frontend/src/pages/Register.jsx
const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '', // Make sure this exists
  password: '',
  role: 'farmer'
});

// Make sure handleSubmit includes email
const handleSubmit = async (e) => {
  e.preventDefault();
  // Include email in validation
  if (!formData.name || !formData.phone || !formData.email || !formData.password) {
    setError('All fields are required');
    return;
  }
  // Rest of the function...
};
```

### Fix Login Authentication

```javascript
// In frontend/src/contexts/AuthContext.jsx
const login = async (phone, password) => {
  try {
    setLoading(true);
    setError(null);
    
    // Log what's being sent
    console.log('Attempting login with:', { phone, password: '****' });
    
    const response = await api.post('/api/auth/login', { phone, password });
    
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    }
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    setError(err.response?.data?.message || 'Failed to login');
    return false;
  } finally {
    setLoading(false);
  }
};
```

### Fix Token Management

```javascript
// In frontend/src/contexts/AuthContext.jsx
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Token set in localStorage and API headers');
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('Token removed from localStorage and API headers');
  }
};
```

## Final Checklist

Before submitting your project, verify:

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend successfully
- [ ] Registration works with all fields
- [ ] Login works with phone and password
- [ ] Equipment addition works (for owners)
- [ ] Equipment booking works (for farmers)
- [ ] All data is saved to MongoDB correctly

Good luck with your project submission!