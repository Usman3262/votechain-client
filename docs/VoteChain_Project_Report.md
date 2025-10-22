# VoteChain - Anonymous Blockchain Voting System

**Project**: VoteChain — Anonymous Blockchain Voting System  
**Student**: Usman Ali  
**University**: Superior University  
**Degree**: BS Computer Science  
**Supervisor**: Mam Maria  
**Submission timeframe**: Semester project

## Table of Contents

1. [Introduction & Motivation](#introduction--motivation)
2. [System Architecture](#system-architecture)
3. [Privacy Model](#privacy-model)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend Implementation](#backend-implementation)
6. [Smart Contract](#smart-contract)
7. [Security Analysis](#security-analysis)
8. [Deployment Guide](#deployment-guide)
9. [Testing Strategy](#testing-strategy)
10. [Limitations & Future Work](#limitations--future-work)

## Introduction & Motivation

Traditional voting systems have several inherent problems:

- **Lack of Transparency**: Voters cannot verify that their vote was counted correctly
- **Centralization**: Central authorities control the entire voting process, creating a single point of failure
- **Privacy Concerns**: In electronic systems, there's often a link between voter identity and their vote
- **Accessibility**: Physical presence is required for most elections
- **Scalability Issues**: Manual counting is slow and error-prone

Blockchain technology offers a potential solution to these problems by providing:
- Transparency through public ledgers
- Immutability of records
- Decentralization
- Verifiability of results

However, implementing privacy in blockchain voting remains a significant challenge. VoteChain addresses this by implementing a hybrid relayer privacy model that ensures voter anonymity while maintaining the integrity of the voting process.

## System Architecture

VoteChain implements a three-tier architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  Blockchain     │
│   (React/TS)    │◄──►│  (Node.js/     │◄──►│   (Ethereum)    │
│                 │    │   MongoDB)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                ┌─────────────────┐            │
        │                │   Relayer       │            │
        └────────────────┤  (Node.js app)  │◄───────────┘
                         │                 │
                         └─────────────────┘
```

### Components:

1. **Frontend**: React application with TypeScript, implementing user registration, authentication, voting, and results visualization
2. **Backend**: Node.js/Express server managing user authentication, election management, and API endpoints
3. **Blockchain**: Ethereum smart contracts storing election results and ensuring immutability
4. **Relayer**: Service that submits votes to the blockchain on behalf of voters, maintaining privacy

## Privacy Model

VoteChain implements a privacy model based on zero-knowledge principles:

### EIP-712 Typed Data Signatures
- Voters sign their votes using EIP-712 typed data
- The signature contains: electionId, candidateId, nonce, and timestamp
- This avoids replay attacks and links the vote to a specific election

### Nullifier Hash System
- The signature is hashed to create a nullifier hash: `keccak256(signature)`
- This hash is submitted to the blockchain to prevent double voting
- The signature itself is never stored or transmitted to the blockchain
- This preserves voter privacy while ensuring election integrity

### Relayer Model
- A trusted relayer submits votes to the blockchain
- The voter's identity (wallet address) is not revealed to the blockchain
- The backend verifies the signature but does not store the signature after submission
- The nullifier hash is the only link used to prevent double voting

## Frontend Implementation

### Technologies Used:
- React 18 with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- Ethers.js for blockchain interactions
- Recharts for data visualization
- React Router for navigation

### Key Components:

#### Web3 Integration
The `Web3Context` manages wallet connections and provides:
- Wallet connection/disconnection
- Network switching capabilities
- Provider and signer instances

#### User Authentication
The `AuthContext` manages user sessions with:
- JWT-based authentication
- User role management (user/admin)
- Approval status tracking

#### Voting Process
The vote flow implements:
1. Wallet connection verification
2. EIP-712 signature generation
3. Vote submission to backend relayer
4. Transaction confirmation display

## Backend Implementation

### Technologies Used:
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Ethers.js for blockchain interactions

### API Structure:

#### Authentication Routes (`/api/auth`)
- `POST /register` - User registration with wallet verification
- `POST /login` - User login with JWT generation
- `GET /me` - Get current user profile

#### Admin Routes (`/api/admin`)
- `GET /pending` - Get users awaiting approval
- `PUT /approve/:id` - Approve a user
- `PUT /reject/:id` - Reject a user
- `GET /users` - Get all users

#### Election Routes (`/api/election`)
- `POST /` - Create new election (admin only)
- `GET /` - Get all elections
- `GET /:id` - Get specific election
- `PUT /start/:id` - Start election (admin only)
- `PUT /end/:id` - End election (admin only)
- `GET /:id/counts` - Get election results from blockchain

#### Vote Routes (`/api/vote`)
- `POST /submit` - Submit vote via relayer (private model)

### Middleware:
- Authentication checks
- Admin authorization
- Input validation
- Error handling

## Smart Contract

### VoteChain.sol Features:
- Election management (create, start, end)
- Candidate management
- Private voting with nullifier system
- Double voting prevention
- Result aggregation
- Admin controls

### Key Functions:
- `createElection(title, startTime, endTime)` - Create new election
- `addCandidate(electionId, name)` - Add candidate to election
- `vote(candidateId, nullifierHash)` - Cast vote (relayer only)
- `isNullifierUsed(nullifierHash)` - Check for double voting
- `getElectionCounts(electionId)` - Get vote counts

### Security Considerations:
- Access controls with modifiers
- Input validation
- Reentrancy protection
- Proper visibility controls

## Security Analysis

### Trust Model:
- **Backend Server**: Trusted to verify signatures and relay votes but not to store sensitive data
- **Blockchain**: Trusted to store results and prevent double voting
- **Relayer**: Trusted to submit votes but not to know voter identity

### Threats Addressed:
1. **Double Voting**: Prevented by nullifier hash system
2. **Vote Linking**: Prevented by relayer model and not storing signatures
3. **Signature Replay**: Prevented by nonce and timestamp in typed data
4. **Election Tampering**: Prevented by blockchain immutability

### Potential Vulnerabilities:
1. **Relayer Centralization**: Mitigated by potential multiple relayers in production
2. **Signature Storage**: Mitigated by proper cleanup in backend
3. **Timing Attacks**: Mitigated by proper nonce generation

## Deployment Guide

### Prerequisites:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- MetaMask wallet
- Hardhat for blockchain development

### Local Development Setup:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd votechain
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   
   # Install blockchain dependencies
   cd blockchain && npm install && cd ..
   ```

3. **Set up environment variables:**
   - Copy `.env.example` in backend and frontend to `.env`
   - Update with your specific values

4. **Start blockchain development environment:**
   ```bash
   cd blockchain
   npx hardhat node
   ```

5. **Deploy smart contract:**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

6. **Start backend server:**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start frontend:**
   ```bash
   npm run dev
   ```

### Production Deployment:
1. Use proper environment variables for production
2. Deploy backend to cloud provider
3. Deploy frontend to CDN (e.g., Vercel, Netlify)
4. Deploy contract to testnet/mainnet
5. Set up proper database hosting

## Testing Strategy

### Smart Contract Testing:
- Unit tests for individual functions
- Integration tests for election workflows
- Security tests for access controls
- Fuzzing tests for edge cases

### Backend Testing:
- Unit tests for API endpoints
- Integration tests for database operations
- Security tests for authentication
- API testing for all routes

### Frontend Testing:
- Component tests for UI elements
- Integration tests for user flows
- E2E tests for critical paths

### Test Coverage:
- Aim for >90% code coverage
- Include negative test cases
- Test error handling paths
- Verify privacy properties

## Limitations & Future Work

### Current Limitations:
- Single relayer model creates centralization risk
- Requires trusted backend server
- Limited to small-scale elections
- Gas costs for vote submission

### Future Improvements:
- Implement zk-SNARKs for true anonymous voting
- Multiple relayer system with consensus
- On-chain vote verification
- Off-chain result aggregation
- Mobile application
- Internationalization
- Accessibility improvements
- Advanced analytics dashboard

## Conclusion

VoteChain demonstrates a practical implementation of privacy-preserving blockchain voting using a hybrid relayer model. While not perfect, it provides a foundation for further research and development in anonymous voting systems. The system balances privacy, transparency, and verifiability while remaining accessible to users.

The project successfully implements all core requirements: secure user authentication, private voting with double-voting prevention, and transparent result verification. The architecture is modular and extensible, allowing for future improvements and scaling.

---

## Appendix A: Code Snippets

### EIP-712 Typed Data Structure:
```javascript
const domain = {
  name: 'VoteChain',
  version: '1.0',
  chainId: chainId,
  verifyingContract: contractAddress
};

const types = {
  Vote: [
    { name: 'electionId', type: 'uint256' },
    { name: 'candidateId', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'timestamp', type: 'uint256' }
  ]
};

const message = {
  electionId: BigInt(electionId),
  candidateId: BigInt(candidateId),
  nonce: BigInt(nonce),
  timestamp: BigInt(timestamp)
};
```

### Nullifier Hash Generation:
```javascript
const nullifierHash = ethers.keccak256(signature);
```

## Appendix B: Environment Variables

### Backend (.env):
```
MONGO_URI=mongodb://localhost:27017/votechain
JWT_SECRET=your_jwt_secret_key_here
PROVIDER_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
CHAIN_ID=31337
RELAYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
PORT=5000
NODE_ENV=development
```

### Frontend (.env):
```
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
```

## Appendix C: Run Commands

### Development:
```bash
# Terminal 1 - Blockchain
cd blockchain && npx hardhat node

# Terminal 2 - Deploy contract
cd blockchain && npx hardhat run scripts/deploy.js --network localhost

# Terminal 3 - Backend
cd backend && npm run dev

# Terminal 4 - Frontend
npm run dev
```

### Production:
```bash
# Build frontend
npm run build

# Start backend
cd backend && npm start
```


  🚀 Ready for Deployment
   1. Install dependencies: npm install (frontend & backend)
   2. Start Hardhat node: cd blockchain && npx hardhat node
   3. Deploy contract: npx hardhat run scripts/deploy.js --network localhost
   4. Start backend: cd backend && npm run dev
   5. Start frontend: npm run dev
   6. Register users and begin voting!
