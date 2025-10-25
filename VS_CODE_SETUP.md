# Running Raitha Mithra in Visual Studio Code

## Setup Instructions

### Option 1: Quick Start (Recommended)

1. **Open the project in VS Code:**
   - Launch VS Code
   - Go to `File > Open Folder`
   - Select the `RAITHA MITHRA` folder

2. **Open the workspace file:**
   - Double-click on `raitha-mithra.code-workspace` in the Explorer
   - VS Code will reload with the workspace configuration

3. **Start the servers:**
   - Run the batch file by right-clicking on `start-project.bat` and selecting "Open in Terminal"
   - In the terminal, type `./start-project.bat` and press Enter
   - This will start both the backend and frontend servers in separate terminal windows

### Option 2: Using VS Code Debug Configuration

1. **Open the project in VS Code:**
   - Launch VS Code
   - Go to `File > Open Folder`
   - Select the `RAITHA MITHRA` folder

2. **Start debugging:**
   - Press `F5` or click on the Debug icon in the sidebar
   - Select "Full Stack: Backend + Frontend" from the dropdown menu
   - This will start both the backend and frontend in debug mode

### Option 3: Manual Start

1. **Open the project in VS Code:**
   - Launch VS Code
   - Go to `File > Open Folder`
   - Select the `RAITHA MITHRA` folder

2. **Start the backend server:**
   - Open a terminal in VS Code (Terminal > New Terminal)
   - Navigate to the backend directory: `cd backend`
   - Install dependencies (if not already done): `npm install`
   - Start the server: `npm run dev`
   - The server will start on port 5001 (or the next available port if 5001 is busy)

3. **Start the frontend server:**
   - Open another terminal in VS Code (Terminal > New Terminal)
   - Navigate to the frontend directory: `cd frontend`
   - Install dependencies (if not already done): `npm install`
   - Start the development server: `npm run dev`
   - The frontend will start on port 3003 (or the next available port if 3003 is busy)

## Accessing the Application

- **Backend API:** http://localhost:5001 (or the port shown in the terminal)
- **Frontend:** http://localhost:3003 (or the port shown in the terminal)

## Troubleshooting

### Port Already in Use

If you see an error like `EADDRINUSE: address already in use`, it means another process is already using that port. The application has been configured to automatically try the next available port.

If you want to manually kill the process using a specific port:

1. Open a PowerShell terminal as Administrator
2. Run: `netstat -ano | findstr :<PORT>` (replace `<PORT>` with the port number, e.g., 5001)
3. Note the PID (Process ID) in the last column
4. Run: `taskkill /PID <PID> /F` (replace `<PID>` with the Process ID from the previous step)

### Other Issues

- Make sure MongoDB is running if you're using a local database
- Check that all dependencies are installed in both frontend and backend folders
- Verify that the `.env` file in the backend folder has the correct configuration