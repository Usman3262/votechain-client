// services/contractService.ts
import { ethers } from 'ethers';

// Contract ABI - this is a simplified version, you'll need to update this with your actual contract ABI
const contractABI = [
  "function addCandidate(string memory _name) public",
  "function startElection(uint _start, uint _end) public",
  "function stopElection() public",
  "function vote(uint _candidateId, bytes32 _nullifierHash) public",
  "function getCandidate(uint _id) public view returns (uint id, string memory name, uint voteCount)",
  "function getAllCounts() public view returns (uint[] memory)",
  "function getResults() public view returns (uint[] memory, string[] memory)",
  "function nullifierUsed(bytes32) public view returns (bool)",
  "function candidates(uint) view returns (uint id, string name, uint voteCount)",
  "function candidatesCount() view returns (uint)",
  "function active() view returns (bool)",
  "function electionTitle() view returns (string memory)",
  "function startTime() view returns (uint)",
  "function endTime() view returns (uint)"
];

let contractInstance: ethers.Contract | null = null;
let provider: ethers.BrowserProvider | null = null;

export const initializeContract = (signerOrProvider: ethers.JsonRpcSigner | ethers.BrowserProvider) => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Contract address not configured in environment variables');
  }

  if (signerOrProvider instanceof ethers.JsonRpcSigner) {
    // In this case, the signer already has the provider
    contractInstance = new ethers.Contract(contractAddress, contractABI, signerOrProvider);
  } else {
    provider = signerOrProvider;
    contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
  }

  return contractInstance;
};

export const getContract = () => {
  if (!contractInstance) {
    throw new Error('Contract not initialized. Call initializeContract first.');
  }
  return contractInstance;
};

export const getContractReadOnly = () => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Contract address not configured in environment variables');
  }

  if (!provider) {
    throw new Error('Provider not initialized');
  }

  return new ethers.Contract(contractAddress, contractABI, provider);
};

// Function to sign vote data using EIP-712
export const signVoteData = async (
  signer: ethers.JsonRpcSigner,
  electionId: number,
  candidateId: number
) => {
  // Generate a unique nonce for this vote
  const nonce = BigInt(`0x${crypto.getRandomValues(new Uint8Array(32)).toString('hex')}`);
  const timestamp = BigInt(Math.floor(Date.now() / 1000));

  // Prepare the EIP-712 domain
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Contract address not configured in environment variables');
  }
  
  const domain = {
    name: "VoteChain",
    version: "1.0",
    chainId: parseInt(import.meta.env.VITE_CHAIN_ID || "11155111"), // Default to Sepolia
    verifyingContract: contractAddress
  };

  // Define the EIP-712 types
  const types = {
    Vote: [
      { name: "electionId", type: "uint256" },
      { name: "candidateId", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "timestamp", type: "uint256" }
    ]
  };

  // Define the message to sign
  const value = {
    electionId: BigInt(electionId),
    candidateId: BigInt(candidateId),
    nonce: nonce,
    timestamp: timestamp
  };

  try {
    // Sign the typed data
    const signature = await signer.signTypedData(domain, types, value);
    return {
      signature,
      nonce: nonce.toString()
    };
  } catch (error) {
    console.error('Error signing vote data:', error);
    throw error;
  }
};

// Function to check if a nullifier has been used
export const isNullifierUsed = async (nullifierHash: string) => {
  try {
    const contract = getContractReadOnly();
    return await contract.nullifierUsed(nullifierHash);
  } catch (error) {
    console.error('Error checking nullifier usage:', error);
    throw error;
  }
};

// Function to get election results
export const getElectionResults = async () => {
  try {
    const contract = getContractReadOnly();
    const [counts, names] = await contract.getResults();
    return { counts, names };
  } catch (error) {
    console.error('Error getting election results:', error);
    throw error;
  }
};

// Function to get candidate information
export const getCandidateInfo = async (candidateId: number) => {
  try {
    const contract = getContractReadOnly();
    return await contract.getCandidate(candidateId);
  } catch (error) {
    console.error('Error getting candidate info:', error);
    throw error;
  }
};