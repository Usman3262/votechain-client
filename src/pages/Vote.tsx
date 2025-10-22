import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { electionAPI, voteAPI } from '../services/api';
import CandidateCard from '../components/ui/CandidateCard';

interface Election {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  candidates: Array<{
    id: number;
    name: string;
  }>;
}

const Vote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [votingStatus, setVotingStatus] = useState<'idle' | 'signing' | 'submitting' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchElection = async () => {
      try {
        if (!id) return;
        
        const response = await electionAPI.getElection(id);
        setElection(response.data.election);
      } catch (err) {
        console.error('Error fetching election:', err);
        setError('Failed to load election data');
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [id]);





  const handleSubmitVote = async () => {
    if (selectedCandidate === null) {
      setError('Please select a candidate to vote for');
      return;
    }

    if (!election?.isActive) {
      setError('This election is not active');
      return;
    }

    setVoting(true);
    setVotingStatus('submitting');
    setError('');

    try {
      // Submit vote to backend relayer
      const response = await voteAPI.submitVote({
        electionId: election._id,
        candidateId: selectedCandidate
      });

      setVotingStatus('success');
      setTxHash(response.data.txHash);
    } catch (err: any) {
      console.error('Error submitting vote:', err);
      setVotingStatus('error');
      setError(err.response?.data?.message || 'Failed to submit vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Election not found</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">VoteChain</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{election.title}</h1>
          <p className="text-gray-600 mt-2">{election.description}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Start:</span>
              <p className="font-medium">{new Date(election.startTime).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">End:</span>
              <p className="font-medium">{new Date(election.endTime).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <p className={`font-medium ${
                election.isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {election.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Candidate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {election.candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                name={candidate.name}
                isSelected={selectedCandidate === candidate.id}
                onSelect={() => setSelectedCandidate(candidate.id)}
                disabled={!election.isActive || voting}
              />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">Privacy Notice</h3>
          <p className="text-sm text-blue-700">
            Your vote will be submitted through a relayer to preserve your privacy. 
            The system uses zero-knowledge proofs to prevent double voting without linking your identity to your vote.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmitVote}
            disabled={voting || !election.isActive || selectedCandidate === null}
            className={`px-6 py-3 rounded-lg font-medium ${
              voting || !election.isActive || selectedCandidate === null
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {voting ? (
              <span className="flex items-center">
                {votingStatus === 'signing' && 'Signing...'}
                {votingStatus === 'submitting' && 'Submitting...'}
                {votingStatus === 'success' && 'Submitted!'}
                {votingStatus === 'error' && 'Error'}
                {votingStatus !== 'success' && (
                  <svg className="animate-spin -mr-1 ml-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </span>
            ) : election.isActive ? (
              'Submit Vote'
            ) : (
              'Election Not Active'
            )}
          </button>
        </div>

        {votingStatus === 'success' && txHash && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md text-center">
            <p className="font-medium">Vote submitted successfully!</p>
            <p className="text-sm mt-1">
              Transaction: <span className="font-mono break-all">{txHash}</span>
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Vote;