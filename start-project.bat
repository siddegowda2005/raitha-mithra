@echo off
echo Starting Raitha Mithra Project...

echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting. Please wait a moment...
echo Backend will be available at http://localhost:5001 (or next available port)
echo Frontend will be available at http://localhost:3003 (or next available port)
echo.
echo You can now open the project in VS Code with: code .