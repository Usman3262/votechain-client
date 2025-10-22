import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import apiClient from '../../utils/api';

const ResultsPage = () => {
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data - in real implementation, this would come from the backend
      const mockElections = [
        {
          _id: '1',
          title: 'President Election 2025',
          description: 'Election for the President position',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          candidates: [
            { id: 1, name: 'Candidate A' },
            { id: 2, name: 'Candidate B' },
            { id: 3, name: 'Candidate C' },
          ],
          active: true,
        },
      ];
      setElections(mockElections);
      if (mockElections.length > 0) {
        setSelectedElection(mockElections[0]);
        // Fetch results for the first election
        fetchResults(mockElections[0]._id);
      }
    } catch (err) {
      console.error('Error fetching elections:', err);
      setError('Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (electionId: string) => {
    try {
      setLoading(true);
      // For now, using mock data - in real implementation, this would come from the blockchain
      const mockResults = [
        { id: 1, name: 'Candidate A', votes: 150 },
        { id: 2, name: 'Candidate B', votes: 210 },
        { id: 3, name: 'Candidate C', votes: 95 },
      ];
      setResults(mockResults);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleElectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const electionId = e.target.value;
    const election = elections.find((el) => el._id === electionId);
    setSelectedElection(election || null);
    if (election) {
      fetchResults(election._id);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold text-indigo-700 mb-6">Election Results</h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Election</label>
          <select
            value={selectedElection?._id || ''}
            onChange={handleElectionChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Choose an election</option>
            {elections.map((election) => (
              <option key={election._id} value={election._id}>
                {election.title}
              </option>
            ))}
          </select>
        </div>
        
        {selectedElection && results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">{selectedElection.title} - Results</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 text-center">Bar Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={results}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votes" name="Number of Votes" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 text-center">Pie Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={results}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="votes"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Detailed Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((candidate) => {
                      const totalVotes = results.reduce((sum, c) => sum + c.votes, 0);
                      const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : '0.00';
                      
                      return (
                        <tr key={candidate.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.votes}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{percentage}%</div>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-100 font-semibold">
                      <td className="px-6 py-4 whitespace-nowrap">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {results.reduce((sum, c) => sum + c.votes, 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;