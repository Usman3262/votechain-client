@echo off
REM Deployment script for VoteChain on Windows

echo VoteChain Deployment Script
echo =============================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo ✅ npm is installed

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install blockchain dependencies
echo Installing blockchain dependencies...
cd ..\blockchain
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install blockchain dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo All dependencies installed successfully!

echo.
echo To run the application:
echo 1. Open a new terminal and run: npx hardhat node (in the blockchain directory)
echo 2. In another terminal run: npx hardhat run scripts/deploy.js --network localhost (in the blockchain directory)
echo 3. In another terminal run: npm run dev (in the backend directory)
echo 4. In another terminal run: npm run dev (in the root directory for the frontend)

echo.
echo For a complete setup with Hardhat network, open 4 command prompts:
echo Command Prompt 1: cd blockchain && npx hardhat node
echo Command Prompt 2: cd blockchain && npx hardhat run scripts/deploy.js --network localhost
echo Command Prompt 3: cd backend && npm run dev
echo Command Prompt 4: npm run dev

pause