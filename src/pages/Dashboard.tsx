import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { electionAPI } from '../services/api';
import WalletButton from '../components/ui/WalletButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Election {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  totalVotes: number;
  candidates: Array<{
    id: number;
    name: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [electionCounts, setElectionCounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await electionAPI.getElections();
        setElections(response.data.elections);
        
        // Select the first active election if available
        const activeElection = response.data.elections.find((e: Election) => e.isActive);
        if (activeElection) {
          setSelectedElection(activeElection);
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    const fetchElectionCounts = async () => {
      if (selectedElection) {
        try {
          const response = await electionAPI.getElectionCounts(selectedElection._id);
          const counts = response.data.candidates.map((candidate: any) => ({
            name: candidate.name,
            votes: candidate.votes
          }));
          setElectionCounts(counts);
        } catch (error) {
          console.error('Error fetching election counts:', error);
        }
      }
    };

    fetchElectionCounts();
  }, [selectedElection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            VoteChain
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'admin' 
              ? 'Manage elections and users' 
              : 'View available elections and cast your vote'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Elections List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Elections</h2>
                <div className="space-y-4">
                  {elections.map((election) => (
                    <div 
                      key={election._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedElection?._id === election._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedElection(election)}
                    >
                      <h3 className="font-medium text-gray-800">{election.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(election.startTime)} - {formatDate(election.endTime)}
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          election.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {election.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {election.totalVotes} votes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Election Details and Chart */}
            <div className="lg:col-span-2">
              {selectedElection ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{selectedElection.title}</h2>
                      {selectedElection.description && (
                        <p className="text-gray-600 mt-2">{selectedElection.description}</p>
                      )}
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Start:</span>
                          <p className="font-medium">{formatDate(selectedElection.startTime)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">End:</span>
                          <p className="font-medium">{formatDate(selectedElection.endTime)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className={`font-medium ${
                            selectedElection.isActive ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {selectedElection.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Votes:</span>
                          <p className="font-medium">{selectedElection.totalVotes}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {user?.role === 'admin' && (
                        <>
                          <Link 
                            to={`/admin/election/${selectedElection._id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                          >
                            Manage
                          </Link>
                          <Link 
                            to={`/admin/election/${selectedElection._id}/results`}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                          >
                            Results
                          </Link>
                        </>
                      )}
                      {user?.role === 'user' && selectedElection.isActive && (
                        <Link 
                          to={`/vote/${selectedElection._id}`}
                          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                        >
                          Vote Now
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Vote Distribution</h3>
                    {electionCounts.length > 0 ? (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={electionCounts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="votes" fill="#3b82f6" name="Votes" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>No vote data available for this election yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Election Selected</h3>
                  <p className="text-gray-600">
                    Select an election from the list to view details and voting results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;