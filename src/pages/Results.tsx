import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

interface CandidateResult {
  id: number;
  name: string;
  voteCount: number;
}

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Fetch real results from the backend
        const resultsData = await api.getResults(parseInt(id || '0'));
        
        // Format the results to match our interface
        const formattedResults: CandidateResult[] = resultsData.map((result: any) => ({
          id: result.id,
          name: result.name,
          voteCount: typeof result.votes === 'string' ? parseInt(result.votes) : result.votes || 0
        }));
        
        setResults(formattedResults);
      } catch (err: any) {
        setError(err.message || 'Failed to load results');
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== '0') {
      fetchResults();
    } else {
      // If no specific election ID, show a message or fetch all results
      setError('Please select a specific election to view results');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const chartData = results.map(candidate => ({
    name: candidate.name,
    votes: candidate.voteCount
  }));

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Election Results</h1>
      
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No results available for this election.</p>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-6">Vote Distribution</h2>
            
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" name="Votes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${Math.round((percent as number) * 100)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="votes"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
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
                  {results
                    .sort((a, b) => b.voteCount - a.voteCount) // Sort by vote count descending
                    .map((candidate, index) => {
                      const totalVotes = results.reduce((sum, c) => sum + c.voteCount, 0);
                      const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
                      
                      return (
                        <tr key={candidate.id} className={index === 0 ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`mr-3 px-2 py-1 rounded-full text-xs font-medium ${
                                index === 0 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : index === 1
                                    ? 'bg-gray-100 text-gray-800'
                                    : index === 2
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}>
                                {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `#${index + 1}`}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {candidate.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.voteCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {percentage.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Total votes counted: {results.reduce((sum, c) => sum + c.voteCount, 0)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;