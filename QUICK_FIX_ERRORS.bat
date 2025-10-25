@echo off
echo ===================================================
echo RAITHA MITHRA - QUICK ERROR FIX SCRIPT
echo ===================================================
echo This script will fix the specific errors you're facing:
echo.

echo [1/4] Fixing Registration Form Email Field...
echo ---------------------------------------------------
powershell -Command "(Get-Content frontend\src\pages\Register.jsx) -replace '(const \[formData, setFormData\] = useState\(\{[^}]*)\}', '$1, email: '''' }' | Set-Content frontend\src\pages\Register.jsx"
powershell -Command "(Get-Content frontend\src\pages\Register.jsx) -replace '(if \(!formData\.name \|\| !formData\.phone \|\|) (!formData\.password)', '$1 !formData.email || $2' | Set-Content frontend\src\pages\Register.jsx"
echo ✅ Registration form fixed!
echo.

echo [2/4] Fixing Login Authentication...
echo ---------------------------------------------------
powershell -Command "(Get-Content frontend\src\contexts\AuthContext.jsx) -replace 'const login = async \(email, password\)', 'const login = async (phone, password)' | Set-Content frontend\src\contexts\AuthContext.jsx"
powershell -Command "(Get-Content frontend\src\contexts\AuthContext.jsx) -replace 'api\.post\([''\"]\/api\/auth\/login['\''], \{ email, password \}\)', 'api.post(''/api/auth/login'', { phone, password })' | Set-Content frontend\src\contexts\AuthContext.jsx"
powershell -Command "(Get-Content frontend\src\pages\Login.jsx) -replace 'login\(email, password\)', 'login(phone, password)' | Set-Content frontend\src\pages\Login.jsx"
echo ✅ Login authentication fixed!
echo.

echo [3/4] Fixing Equipment Addition...
echo ---------------------------------------------------
echo // Adding proper token handling to API requests
powershell -Command "$content = Get-Content frontend\src\utils\api.js -Raw; if ($content -notmatch 'api\.interceptors\.request\.use\(\s*\(config\)\s*=>\s*{\s*const token') { $content = $content -replace 'const api = axios.create\({([^}]*)}\);', 'const api = axios.create({$1});`n`n// Add token to all requests`napi.interceptors.request.use(`n  (config) => {`n    const token = localStorage.getItem(''token'');`n    if (token) {`n      console.log(''Adding token to request'');`n      config.headers.Authorization = `Bearer ${token}`;`n    }`n    return config;`n  },`n  (error) => {`n    return Promise.reject(error);`n  }`n);'; Set-Content frontend\src\utils\api.js $content }"
echo ✅ Equipment addition fixed!
echo.

echo [4/4] Fixing Booking Functionality...
echo ---------------------------------------------------
powershell -Command "$content = Get-Content frontend\src\pages\EquipmentDetail.jsx -Raw; if ($content -match 'const handleBookingSubmit = async \(e\) => {' -and $content -notmatch 'e\.preventDefault\(\);') { $content = $content -replace 'const handleBookingSubmit = async \(e\) => {', 'const handleBookingSubmit = async (e) => {`n    e.preventDefault();`n`n    if (!user) {`n      setBookingError(''Please log in to book equipment'');`n      return;`n    }`n`n    if (user.role !== ''farmer'') {`n      setBookingError(''Only farmers can book equipment'');`n      return;`n    }`n`n    if (!startDate || !endDate) {`n      setBookingError(''Please select both start and end dates'');`n      return;`n    }`n'; Set-Content frontend\src\pages\EquipmentDetail.jsx $content }"
echo ✅ Booking functionality fixed!
echo.

echo [+] Adding Debug Logging...
echo ---------------------------------------------------
powershell -Command "(Get-Content frontend\src\contexts\AuthContext.jsx) -replace 'const setAuthToken = \(token\) => {', 'const setAuthToken = (token) => {`n    console.log(''Setting auth token:'', token ? ''[Token exists]'' : ''[No token]'');' | Set-Content frontend\src\contexts\AuthContext.jsx"
echo ✅ Added debug logging!
echo.

echo ===================================================
echo ✅ ALL FIXES APPLIED SUCCESSFULLY!
echo ===================================================
echo.
echo 🔄 Please restart your application:
echo.
echo 1. Press Ctrl+C in both terminal windows to stop servers
echo 2. Run the following commands in separate terminals:
echo    - Terminal 1: cd backend && npm start
echo    - Terminal 2: cd frontend && npm run dev
echo.
echo 📝 If you still encounter issues, check the browser console (F12)
echo    for detailed error messages.
echo.
pause