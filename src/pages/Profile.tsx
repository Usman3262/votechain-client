import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { truncateAddress } from '../utils/helpers';

interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  role: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch user data from the API
    // For now, we'll use the user data from auth context
    if (user) {
      setUserData(user);
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-12"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          User not found. Please log in again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{userData.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{userData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
            <p className="text-gray-900 font-mono">{truncateAddress(userData.walletAddress)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                userData.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {userData.role}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Verified
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2">
              Change Password
            </button>
            <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2">
              Manage Wallet Connections
            </button>
            <button className="w-full text-left text-red-600 hover:text-red-800 py-2">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;