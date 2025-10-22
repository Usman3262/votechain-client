import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface WalletButtonProps {
  className?: string;
}

// This is now a placeholder component for UI consistency
const WalletButton: React.FC<WalletButtonProps> = ({ className = '' }) => {
  const { user } = useAuth();
  
  return (
    <div className={`px-4 py-2 ${className}`}>
      <span className="text-sm text-gray-700">
        {user ? `Welcome, ${user.name || user.email?.split('@')[0]}` : 'User'}
      </span>
    </div>
  );
};

export default WalletButton;