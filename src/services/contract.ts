import { ethers } from 'ethers';

// Contract ABI - this would typically come from your contract compilation
// For now, I'll define the essential functions
const contractABI = [
  "function createElection(string memory _title, uint256 _startTime, uint256 _endTime) external returns (uint256)",
  "function addCandidate(uint256 _electionId, string memory _name) external returns (uint256)",
  "function startElection(uint256 _electionId) external",
  "function endElection(uint256 _electionId) external",
  "function vote(uint256 _candidateId, bytes32 _nullifierHash) external returns (bool)",
  "function isNullifierUsed(bytes32 _nullifierHash) external view returns (bool)",
  "function getElectionCounts(uint256 _electionId) external view returns (uint256[] memory)",
  "function isElectionActive(uint256 _electionId) external view returns (bool)",
  "function elections(uint256) view returns (string title, uint256 startTime, uint256 endTime, bool isActive, uint256 totalVotes)",
  "function candidates(uint256, uint256) view returns (string name, uint256 voteCount)"
];

class ContractService {
  private contractAddress: string;
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';
  }

  // Initialize the contract service with provider and signer
  async initialize(provider: ethers.BrowserProvider) {
    this.provider = provider;
    if (this.contractAddress) {
      this.contract = new ethers.Contract(this.contractAddress, contractABI, provider);
    } else {
      throw new Error('Contract address not configured');
    }
  }

  // Check if election is active
  async isElectionActive(electionId: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const result = await this.contract.isElectionActive(electionId);
      return result;
    } catch (error) {
      console.error('Error checking election status:', error);
      return false;
    }
  }

  // Get election counts
  async getElectionCounts(electionId: string): Promise<number[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const counts = await this.contract.getElectionCounts(electionId);
      // Convert BigInts to numbers
      return counts.map((count: any) => Number(count));
    } catch (error) {
      console.error('Error getting election counts:', error);
      return [];
    }
  }

  // Check if nullifier is used
  async isNullifierUsed(nullifierHash: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      return await this.contract.isNullifierUsed(nullifierHash);
    } catch (error) {
      console.error('Error checking nullifier status:', error);
      return false;
    }
  }

  // Get election details
  async getElectionDetails(electionId: string) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const election = await this.contract.elections(electionId);
      return {
        title: election.title,
        startTime: Number(election.startTime),
        endTime: Number(election.endTime),
        isActive: election.isActive,
        totalVotes: Number(election.totalVotes)
      };
    } catch (error) {
      console.error('Error getting election details:', error);
      return null;
    }
  }
}

export const contractService = new ContractService();