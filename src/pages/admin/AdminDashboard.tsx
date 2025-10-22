import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, electionAPI } from '../../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  cnic?: string;
  mobileNumber?: string;
  age?: number;
  isSuperiorEmail: boolean;
  verified: boolean;
  approved: boolean;
  role: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'elections'>('users');

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await adminAPI.getPendingUsers();
        setPendingUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      await adminAPI.approveUser(userId);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await adminAPI.rejectUser(userId);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            VoteChain Admin
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Admin: {user?.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users and elections</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'elections'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Elections
            </button>
          </nav>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Pending Users</h2>
              <p className="mt-1 text-sm text-gray-600">
                Users awaiting approval to vote
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingUsers.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No pending users</p>
                  </div>
                ) : (
                  pendingUsers.map((user) => (
                    <div key={user._id} className="p-6 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.cnic && (
                          <p className="text-sm text-gray-600">CNIC: {user.cnic}</p>
                        )}
                        {user.mobileNumber && (
                          <p className="text-sm text-gray-600">Mobile: {user.mobileNumber}</p>
                        )}
                        {user.age && (
                          <p className="text-sm text-gray-600">Age: {user.age}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {user.isSuperiorEmail ? '✅ Verified SU Email' : '📄 Needs Verification'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Registered: {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveUser(user._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectUser(user._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'elections' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Elections</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Manage existing elections or create new ones
                </p>
              </div>
              <Link
                to="/admin/election/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Election
              </Link>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                  <h3 className="font-medium text-gray-800">Create New Election</h3>
                  <p className="text-sm text-gray-600 mt-1">Set up a new election with candidates</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                  <h3 className="font-medium text-gray-800">Active Elections</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage currently active elections</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                  <h3 className="font-medium text-gray-800">Past Elections</h3>
                  <p className="text-sm text-gray-600 mt-1">View results of completed elections</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;