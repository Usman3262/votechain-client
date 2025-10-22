# VoteChain - Anonymous Blockchain Voting System

**Project**: VoteChain — Anonymous Blockchain Voting System  
**Student**: Usman Ali  
**University**: Superior University  
**Degree**: BS Computer Science  
**Supervisor**: Mam Maria  

## Overview

VoteChain is an anonymous blockchain voting system that implements a hybrid relayer privacy model to ensure voter anonymity while maintaining election integrity. The system uses EIP-712 typed data signatures and a nullifier hash system to prevent double voting without linking voter identity to their vote.

## Features

- **Privacy-Preserving Voting**: Uses EIP-712 signatures and nullifier hashes to protect voter privacy
- **Transparent Results**: All results are verifiable on the blockchain
- **Secure Authentication**: JWT-based authentication with admin approval system
- **Real-time Results**: Live vote counting with charts
- **MetaMask Integration**: Wallet-based identity verification
- **Admin Controls**: Election management and user approval system

## Architecture

The system consists of three main components:

1. **Frontend**: React/TypeScript application with Tailwind CSS
2. **Backend**: Node.js/Express server with MongoDB
3. **Blockchain**: Ethereum smart contracts using Solidity

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- MetaMask wallet
- Hardhat (for blockchain development)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd votechain
```

### 2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install blockchain dependencies
cd blockchain && npm install && cd ..
```

### 3. Set up environment variables

**Backend** (copy `backend/.env.example` to `backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/votechain
JWT_SECRET=your_jwt_secret_key_here
PROVIDER_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
CHAIN_ID=31337
RELAYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
PORT=5000
NODE_ENV=development
```

**Frontend** (copy `.env.example` to `.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
```

### 4. Start the development environment

**Terminal 1** (Blockchain):
```bash
cd blockchain
npx hardhat node
```

**Terminal 2** (Deploy contract):
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Terminal 3** (Backend):
```bash
cd backend
npm run dev
```

**Terminal 4** (Frontend):
```bash
npm run dev
```

## Usage

1. **Register**: Create an account with your email and connect your wallet
2. **Wait for Approval**: An admin must approve your account before voting
3. **Vote**: Select an active election and cast your private vote
4. **Verify**: Check results on the blockchain

## Privacy Model

VoteChain implements a privacy model using:
- **EIP-712 Typed Data Signatures**: Voters sign their choices with structured data
- **Nullifier Hash System**: Prevents double voting without revealing voter identity
- **Relayer Model**: A trusted service submits votes on behalf of voters

## Testing

Run tests for each component:

**Blockchain tests:**
```bash
cd blockchain
npx hardhat test
```

**Backend tests:**
```bash
cd backend
npm test
```

## Deployment

For production deployment:
1. Use proper environment variables
2. Deploy backend to a cloud provider (Heroku, AWS, etc.)
3. Deploy frontend to a CDN (Vercel, Netlify, etc.)
4. Deploy smart contract to a testnet or mainnet
5. Set up proper database hosting

## Documentation

Full project documentation is available in `docs/VoteChain_Project_Report.md`

## Limitations

- Single relayer model creates centralization risk
- Requires trusted backend server
- Gas costs for vote submission
- Limited scalability for large elections

## Future Work

- Implement zk-SNARKs for true anonymous voting
- Multiple relayer system with consensus
- On-chain vote verification
- Mobile application
- Advanced analytics dashboard

## License

This project is for educational purposes only.

---

For any questions or issues, please contact [your-email@example.com].