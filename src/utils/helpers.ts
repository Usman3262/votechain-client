// utils/helpers.ts

// Function to validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate Ethereum wallet address
export const validateWalletAddress = (address: string): boolean => {
  const walletRegex = /^0x[a-fA-F0-9]{40}$/;
  return walletRegex.test(address);
};

// Function to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Function to get current timestamp
export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

// Function to format date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Function to truncate Ethereum address for display
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Function to generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};