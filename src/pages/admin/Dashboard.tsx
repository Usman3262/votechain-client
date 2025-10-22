import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  walletAddress: string;
  role: string;
  approved: boolean;
  createdAt: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/pending');
      setPendingUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching pending users:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      await apiClient.put(`/admin/approve/${userId}`);
      // Remove the approved user from the pending list
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      alert('User approved successfully!');
    } catch (err: any) {
      console.error('Error approving user:', err);
      alert(err.response?.data?.message || 'Failed to approve user');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-indigo-700">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Approval</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {loading ? (
          <p>Loading pending users...</p>
        ) : pendingUsers.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.walletAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => approveUser(user._id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No pending users for approval.</p>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Functions</h2>
        <p className="text-gray-600 mb-4">
          Welcome {user?.email || 'Admin'}, you can manage users and elections from this dashboard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-indigo-100 text-indigo-700 p-4 rounded-lg hover:bg-indigo-200">
            Create New Election
          </button>
          <button className="bg-indigo-100 text-indigo-700 p-4 rounded-lg hover:bg-indigo-200">
            View Election Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
