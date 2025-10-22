#!/bin/bash
# Deployment script for VoteChain

echo "VoteChain Deployment Script"
echo "============================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists mongod; then
    echo "❌ MongoDB is not installed or not in PATH. Please install MongoDB first."
    exit 1
fi

echo "✅ Node.js is installed"
echo "✅ npm is installed"
echo "✅ MongoDB is available"

# Start MongoDB
echo "Starting MongoDB..."
if command_exists brew; then
    # macOS with Homebrew
    brew services start mongodb-community || sudo mongod &
elif command_exists systemctl; then
    # Linux with systemd
    sudo systemctl start mongod || sudo mongod &
else
    # Try to start mongod directly
    sudo mongod &
fi

echo "Waiting for MongoDB to start..."
sleep 5

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Install blockchain dependencies
echo "Installing blockchain dependencies..."
cd ../blockchain
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ..
npm install

echo "All dependencies installed successfully!"

echo "To run the application:"
echo "1. Start a separate terminal and run: npx hardhat node (in the blockchain directory)"
echo "2. In another terminal run: npx hardhat run scripts/deploy.js --network localhost (in the blockchain directory)"
echo "3. In another terminal run: npm run dev (in the backend directory)"
echo "4. In another terminal run: npm run dev (in the root directory for the frontend)"

echo ""
echo "For a complete setup with Hardhat network, open 4 terminals:"
echo "Terminal 1: cd blockchain && npx hardhat node"
echo "Terminal 2: cd blockchain && npx hardhat run scripts/deploy.js --network localhost"
echo "Terminal 3: cd backend && npm run dev"
echo "Terminal 4: npm run dev"