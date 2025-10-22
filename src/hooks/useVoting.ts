import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { signVoteData, initializeContract } from '../services/contractService';
import api from '../services/api';

export const useVoting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signer, isConnected } = useWeb3();

  const submitVote = async (electionId: number, candidateId: number) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (!isConnected) {
      throw new Error('Please connect your wallet first');
    }

    setIsSubmitting(true);
    setError(null);
    setTxHash(null);

    try {
      // Initialize the contract with the signer
      initializeContract(signer);
      
      // Sign the vote data
      const { signature, nonce } = await signVoteData(signer, electionId, candidateId);

      // Submit the vote to the backend
      const result = await api.submitVote({
        electionId,
        candidateId,
        nonce,
        signature
      });

      setTxHash(result.txHash);
      return result;
    } catch (err: any) {
      console.error('Voting error:', err);
      const errorMessage = err.message || 'An error occurred during voting';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVote,
    isSubmitting,
    txHash,
    error
  };
};