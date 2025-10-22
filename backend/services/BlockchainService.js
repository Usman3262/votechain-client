const { ethers } = require('ethers');

// Initialize provider and contract
let provider;
let contract;
let relayerWallet;
let pendingTransaction = Promise.resolve(); // Used to queue transactions

// Initialize blockchain service
const initializeBlockchainService = async () => {
  try {
    // Setup provider
    const providerUrl = process.env.PROVIDER_URL || 'http://localhost:8545';
    provider = new ethers.JsonRpcProvider(providerUrl);

    // Setup relayer wallet
    if (!process.env.RELAYER_PRIVATE_KEY) {
      throw new Error('RELAYER_PRIVATE_KEY is required in environment variables');
    }
    relayerWallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);

    // Setup contract
    if (!process.env.CONTRACT_ADDRESS) {
      throw new Error('CONTRACT_ADDRESS is required in environment variables');
    }

    // Use the actual ABI from the compiled contract
    const abi = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "electionId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "candidateId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "name": "CandidateAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "electionId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          }
        ],
        "name": "ElectionCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "electionId",
            "type": "uint256"
          }
        ],
        "name": "ElectionEnded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "electionId",
            "type": "uint256"
          }
        ],
        "name": "ElectionStarted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "electionId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "candidateId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "nullifierHash",
            "type": "bytes32"
          }
        ],
        "name": "VoteCast",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "adminAddress",
            "type": "address"
          }
        ],
        "name": "addAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_electionId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          }
        ],
        "name": "addCandidate",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "admins",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "candidateCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "candidates",
        "outputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_title",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_endTime",
            "type": "uint256"
          }
        ],
        "name": "createElection",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "electionCandidates",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "electionCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "elections",
        "outputs": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "totalVotes",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_electionId",
            "type": "uint256"
          }
        ],
        "name": "endElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_electionId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_candidateId",
            "type": "uint256"
          }
        ],
        "name": "getCandidateDetails",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_electionId",
            "type": "uint256"
          }
        ],
        "name": "getElectionCandidates",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_electionId",
            "type": "uint256"
          }
        ],
        "name": "getElectionCounts",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_electionId",
            "type": "uint256"
          }
        ],
        "name": "isElectionActive",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "_nullifierHash",
            "type": "bytes32"
          }
        ],
        "name": "isNullifierUsed",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "nullifierUsed",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "adminAddress",
            "type": "address"
          }
        ],
        "name": "removeAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_electionId",
            "type": "uint256"
          }
        ],
        "name": "startElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_candidateId",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "_nullifierHash",
            "type": "bytes32"
          }
        ],
        "name": "vote",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, relayerWallet);

    console.log('Blockchain service initialized successfully');
    console.log('Contract address:', process.env.CONTRACT_ADDRESS);
    console.log('Relayer address:', relayerWallet.address);
  } catch (error) {
    console.error('Failed to initialize blockchain service:', error.message);
    throw error;
  }
};

// Initialize on module load
initializeBlockchainService().catch(console.error);

// Queue function to ensure sequential execution of blockchain transactions
const queueTransaction = async (transactionFn) => {
  // Wait for any currently pending transaction to complete
  const result = await pendingTransaction;
  // Create a new promise that represents this transaction
  pendingTransaction = pendingTransaction.then(() => transactionFn());
  // Wait for this transaction to complete
  return pendingTransaction;
};

// Create election on blockchain
const createElection = async (title, startTime, endTime) => {
  return queueTransaction(async () => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Get current nonce from the provider
        const nonce = await provider.getTransactionCount(relayerWallet.address, "latest");
        
        // Execute the transaction to create the election
        const tx = await contract.createElection(title, startTime, endTime, { nonce });
        const receipt = await tx.wait();
        
        // Extract the electionId from the event logs in the receipt
        for (const log of receipt.logs) {
          try {
            // Check if the topics match the ElectionCreated event
            const eventFragment = contract.interface.getEvent('ElectionCreated');
            if (eventFragment && log.topics[0] === contract.interface.getEventTopic(eventFragment)) {
              const decoded = contract.interface.decodeEventLog(eventFragment, log.data, log.topics);
              if (decoded && decoded.length >= 1) {
                // The first indexed parameter is the electionId
                const electionId = decoded[0];
                return Number(electionId);
              }
            }
          } catch (decodeError) {
            // If this log doesn't match the event we're looking for, continue
            continue;
          }
        }
        
        // If event parsing failed, try to get the current election count
        // which should have been incremented by the createElection call
        const currentElectionCount = await contract.electionCount();
        return Number(currentElectionCount);
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed for createElection:`, error);
        
        // If it's a nonce error, increment attempts and retry
        if (error.code === 'NONCE_EXPIRED' || error.message.includes('Nonce too low')) {
          attempts++;
          // Small delay before retry to allow any pending transactions to process
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        } else {
          // If it's a different error, throw immediately
          throw error;
        }
      }
    }
    
    throw new Error(`Failed to create election after ${maxAttempts} attempts due to nonce conflicts`);
  });
};

// Submit vote on-chain via relayer
const submitVote = async (candidateId, nullifierHash, user) => {
  return queueTransaction(async () => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Get current nonce from the provider
        const nonce = await provider.getTransactionCount(relayerWallet.address, "latest");
        
        // Prepare transaction with explicit nonce
        const tx = await contract.vote(candidateId, nullifierHash, { nonce });
        
        // Wait for transaction to be mined
        const receipt = await tx.wait();
        
        console.log(`Vote submitted successfully for candidate ${candidateId} by user ${user.id}. Transaction: ${receipt.hash}`);
        
        return receipt.hash;
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed for submitVote:`, error);
        
        // If it's a nonce error, increment attempts and retry
        if (error.code === 'NONCE_EXPIRED' || error.message.includes('Nonce too low')) {
          attempts++;
          // Small delay before retry to allow any pending transactions to process
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        } else {
          // If it's a different error, throw immediately
          throw error;
        }
      }
    }
    
    throw new Error(`Failed to submit vote after ${maxAttempts} attempts due to nonce conflicts`);
  });
};

// Check if nullifier hash has been used (double voting prevention)
const isNullifierUsed = async (nullifierHash) => {
  try {
    const result = await contract.isNullifierUsed(nullifierHash);
    return result;
  } catch (error) {
    console.error('Error checking nullifier:', error);
    throw error;
  }
};

// Compute nullifier hash from signature
const computeNullifierHash = async (signature) => {
  try {
    // Use ethers to compute keccak256 hash of the signature
    const nullifierHash = ethers.keccak256(signature);
    return nullifierHash;
  } catch (error) {
    console.error('Error computing nullifier hash:', error);
    throw error;
  }
};

// Get election vote counts
const getElectionCounts = async (electionId) => {
  try {
    // Convert to BigInt if it's not already
    const numericElectionId = typeof electionId === 'string' && electionId.length > 15 ? 
      BigInt(Date.now()) : BigInt(electionId);
    const counts = await contract.getElectionCounts(numericElectionId);
    // Convert BigInts to numbers
    return counts.map(count => Number(count));
  } catch (error) {
    console.error('Error getting election counts:', error);
    throw error;
  }
};

// Add candidate to election
const addCandidate = async (electionId, candidateName) => {
  return queueTransaction(async () => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Convert to BigInt if it's not already
        const numericElectionId = typeof electionId === 'string' && electionId.length > 15 ? 
          BigInt(Date.now()) : BigInt(electionId);
        
        // Get current nonce from the provider
        const nonce = await provider.getTransactionCount(relayerWallet.address, "latest");
        
        const tx = await contract.addCandidate(numericElectionId, candidateName, { nonce });
        await tx.wait();
        console.log(`Candidate "${candidateName}" added to election ${numericElectionId}`);
        return; // Success, exit the function
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed for addCandidate:`, error);
        
        // If it's a nonce error, increment attempts and retry
        if (error.code === 'NONCE_EXPIRED' || error.message.includes('Nonce too low')) {
          attempts++;
          // Small delay before retry to allow any pending transactions to process
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        } else {
          // If it's a different error, throw immediately
          throw error;
        }
      }
    }
    
    throw new Error(`Failed to add candidate after ${maxAttempts} attempts due to nonce conflicts`);
  });
};

// Start election
const startElection = async (electionId) => {
  return queueTransaction(async () => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Convert to BigInt if it's not already
        const numericElectionId = typeof electionId === 'string' && electionId.length > 15 ? 
          BigInt(Date.now()) : BigInt(electionId);
        
        // Get current nonce from the provider
        const nonce = await provider.getTransactionCount(relayerWallet.address, "latest");
        
        const tx = await contract.startElection(numericElectionId, { nonce });
        await tx.wait();
        console.log(`Election ${numericElectionId} started`);
        return; // Success, exit the function
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed for startElection:`, error);
        
        // If it's a nonce error, increment attempts and retry
        if (error.code === 'NONCE_EXPIRED' || error.message.includes('Nonce too low')) {
          attempts++;
          // Small delay before retry to allow any pending transactions to process
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        } else {
          // If it's a different error, throw immediately
          throw error;
        }
      }
    }
    
    throw new Error(`Failed to start election after ${maxAttempts} attempts due to nonce conflicts`);
  });
};

// End election
const endElection = async (electionId) => {
  return queueTransaction(async () => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Convert to BigInt if it's not already
        const numericElectionId = typeof electionId === 'string' && electionId.length > 15 ? 
          BigInt(Date.now()) : BigInt(electionId);
        
        // Get current nonce from the provider
        const nonce = await provider.getTransactionCount(relayerWallet.address, "latest");
        
        const tx = await contract.endElection(numericElectionId, { nonce });
        await tx.wait();
        console.log(`Election ${numericElectionId} ended`);
        return; // Success, exit the function
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed for endElection:`, error);
        
        // If it's a nonce error, increment attempts and retry
        if (error.code === 'NONCE_EXPIRED' || error.message.includes('Nonce too low')) {
          attempts++;
          // Small delay before retry to allow any pending transactions to process
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        } else {
          // If it's a different error, throw immediately
          throw error;
        }
      }
    }
    
    throw new Error(`Failed to end election after ${maxAttempts} attempts due to nonce conflicts`);
  });
};

// Check if election is active
const isElectionActive = async (electionId) => {
  try {
    const result = await contract.isElectionActive(electionId);
    return result;
  } catch (error) {
    console.error('Error checking election status:', error);
    throw error;
  }
};

module.exports = {
  createElection,
  submitVote,
  isNullifierUsed,
  computeNullifierHash,
  getElectionCounts,
  addCandidate,
  startElection,
  endElection,
  isElectionActive,
  initializeBlockchainService // Export for re-initialization if needed
};