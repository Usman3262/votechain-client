import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { electionAPI } from '../../services/api';
import WalletButton from '../../components/ui/WalletButton';

const CreateElection: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    candidateCount: 2, // Start with 2 candidates
    candidates: ['', ''] // Start with 2 empty candidate fields
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidates = [...formData.candidates];
    newCandidates[index] = value;
    setFormData({
      ...formData,
      candidates: newCandidates
    });
  };

  const addCandidateField = () => {
    if (formData.candidates.length < 10) { // Limit to 10 candidates
      setFormData({
        ...formData,
        candidateCount: formData.candidateCount + 1,
        candidates: [...formData.candidates, '']
      });
    }
  };

  const removeCandidateField = (index: number) => {
    if (formData.candidates.length > 2) { // Keep at least 2 candidates
      const newCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        candidateCount: formData.candidateCount - 1,
        candidates: newCandidates
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError('Start and end times are required');
      setLoading(false);
      return;
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }

    if (formData.candidates.some(candidate => !candidate.trim())) {
      setError('All candidate names must be filled');
      setLoading(false);
      return;
    }

    try {
      // Filter out potential duplicates and empty values
      const uniqueCandidates = [...new Set(formData.candidates.filter(name => name.trim()))];

      const response = await electionAPI.createElection({
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        candidates: uniqueCandidates
      });

      navigate('/admin');
    } catch (err: any) {
      console.error('Error creating election:', err);
      setError(err.response?.data?.message || 'Failed to create election. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">VoteChain Admin</span>
          <WalletButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Admin Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Election</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Election Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter election title"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter election description (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Candidates *
                </label>
                <button
                  type="button"
                  onClick={addCandidateField}
                  disabled={formData.candidates.length >= 10}
                  className={`text-sm ${
                    formData.candidates.length >= 10
                      ? 'text-gray-400'
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  + Add Candidate
                </button>
              </div>
              
              {formData.candidates.map((candidate, index) => (
                <div key={index} className="flex items-center mb-3">
                  <input
                    type="text"
                    value={candidate}
                    onChange={(e) => handleCandidateChange(index, e.target.value)}
                    required
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Candidate ${index + 1} name`}
                  />
                  {formData.candidates.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeCandidateField(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Privacy Notice</h3>
              <p className="text-sm text-blue-700">
                This election will use the privacy-preserving voting system. 
                Voters will sign their votes with EIP-712 typed data, and a relayer 
                will submit the votes on-chain while preserving voter anonymity.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Election...' : 'Create Election'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateElection;