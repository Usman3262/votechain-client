const { ethers } = require('ethers');

// EIP-712 domain separator for VoteChain
const domain = {
  name: 'VoteChain',
  version: '1.0',
  chainId: parseInt(process.env.CHAIN_ID) || 31337, // Default to Hardhat local chain ID
  verifyingContract: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
};

// EIP-712 types for vote payload
const types = {
  Vote: [
    { name: 'electionId', type: 'uint256' },
    { name: 'candidateId', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'timestamp', type: 'uint256' }
  ]
};

// Verify EIP-712 typed data signature and recover signer address
const recoverSignerAddress = async (electionId, candidateId, nonce, timestamp, signature) => {
  try {
    // Validate inputs
    if (!electionId || !candidateId || !nonce || !timestamp || !signature) {
      throw new Error('Missing required parameters for signature verification');
    }

    // Prepare message for verification
    const message = {
      electionId: BigInt(electionId),
      candidateId: BigInt(candidateId),
      nonce: BigInt(nonce),
      timestamp: BigInt(timestamp)
    };

    // Recover the address that signed the typed data
    const recoveredAddress = ethers.verifyTypedData(
      domain,
      types,
      message,
      signature
    );

    return recoveredAddress.toLowerCase();
  } catch (error) {
    console.error('Error recovering signer address:', error);
    throw error;
  }
};

// Verify if the recovered address matches the expected user's wallet address
const verifySignature = async (electionId, candidateId, nonce, timestamp, signature, expectedAddress) => {
  try {
    const recoveredAddress = await recoverSignerAddress(electionId, candidateId, nonce, timestamp, signature);
    const expectedLower = expectedAddress.toLowerCase();
    
    return recoveredAddress === expectedLower;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

// Prepare typed data for signing by frontend
const prepareTypedData = (electionId, candidateId, nonce, timestamp) => {
  const message = {
    electionId: BigInt(electionId),
    candidateId: BigInt(candidateId),
    nonce: BigInt(nonce),
    timestamp: BigInt(timestamp)
  };

  return {
    domain,
    types,
    message
  };
};

// Validate signature parameters
const validateSignatureParams = (electionId, candidateId, nonce, timestamp) => {
  // Validate electionId
  if (!electionId || BigInt(electionId) <= 0n) {
    return { valid: false, error: 'Invalid electionId' };
  }

  // Validate candidateId
  if (!candidateId || BigInt(candidateId) <= 0n) {
    return { valid: false, error: 'Invalid candidateId' };
  }

  // Validate nonce (should be a positive number)
  if (!nonce || BigInt(nonce) <= 0n) {
    return { valid: false, error: 'Invalid nonce' };
  }

  // Validate timestamp (should be reasonable)
  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const sigTimestamp = BigInt(timestamp);
  
  if (sigTimestamp <= 0n || sigTimestamp > currentTime + 300n) { // Allow 5 min future
    return { valid: false, error: 'Invalid or expired timestamp' };
  }

  return { valid: true };
};

module.exports = {
  recoverSignerAddress,
  verifySignature,
  prepareTypedData,
  validateSignatureParams
};