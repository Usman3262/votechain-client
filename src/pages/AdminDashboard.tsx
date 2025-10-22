import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  walletAddress: string;
  role: string;
  approved: boolean;
  createdAt: string;
}

interface Election {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  candidates: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  active: boolean;
}

const AdminDashboard: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending users
      const pending = await api.getPendingUsers();
      setPendingUsers(pending);
      
      // Mock all users data (in real app, you'd fetch from API)
      const mockAllUsers: User[] = [
        ...pending,
        {
          _id: '2',
          name: 'Test User',
          email: 'test@example.com',
          walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          role: 'user',
          approved: true,
          createdAt: '2023-01-15T10:30:00Z'
        }
      ];
      setAllUsers(mockAllUsers);
      
      // Mock elections data (in real app, you'd fetch from API)
      const mockElections: Election[] = [
        {
          _id: '1',
          title: 'Student Council Election',
          description: 'Annual student council election for the academic year',
          startTime: new Date(Date.now() - 86400000).toISOString(),
          endTime: new Date(Date.now() + 86400000 * 7).toISOString(),
          candidates: [
            { id: 1, name: 'John Doe', description: 'Computer Science Student' },
            { id: 2, name: 'Jane Smith', description: 'Business Administration Student' }
          ],
          active: true
        }
      ];
      setElections(mockElections);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await api.approveUser(userId);
      // Refresh the data
      fetchData();
      alert('User approved successfully');
    } catch (err) {
      setError('Failed to approve user');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'elections'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('elections')}
        >
          Elections
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'analytics'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pending Users</h2>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-600">No pending users for approval.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-mono">{user.walletAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleApproveUser(user._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md mr-2"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'elections' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Elections</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Create New Election
            </button>
          </div>
          
          {elections.length === 0 ? (
            <p className="text-gray-600">No elections created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elections.map((election) => (
                <div key={election._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{election.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{election.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Start: {new Date(election.startTime).toLocaleDateString()}</p>
                    <p>End: {new Date(election.endTime).toLocaleDateString()}</p>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded ${
                        election.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {election.active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium">Candidates: {election.candidates.length}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p className="text-gray-600">Analytics dashboard would be displayed here.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold">125</p>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-2xl font-bold">24</p>
              <p className="text-gray-600">Active Elections</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-2xl font-bold">1,250</p>
              <p className="text-gray-600">Total Votes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;