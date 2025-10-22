import axios from 'axios';

// Base API URL - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear it and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    cnic?: string; 
    mobileNumber?: string; 
    age?: number;
    isSuperiorEmail: boolean;
  }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  getMe: () => 
    api.get('/auth/me'),
};

// Admin API
export const adminAPI = {
  getPendingUsers: () => 
    api.get('/admin/pending'),
  
  approveUser: (userId: string) => 
    api.put(`/admin/approve/${userId}`),
  
  rejectUser: (userId: string) => 
    api.put(`/admin/reject/${userId}`),
  
  getAllUsers: () => 
    api.get('/admin/users'),
};

// Election API
export const electionAPI = {
  createElection: (electionData: { 
    title: string; 
    description?: string; 
    startTime: string; 
    endTime: string; 
    candidates: string[] 
  }) => 
    api.post('/election', electionData),
  
  getElections: () => 
    api.get('/election'),
  
  getElection: (id: string) => 
    api.get(`/election/${id}`),
  
  startElection: (id: string) => 
    api.put(`/election/start/${id}`),
  
  endElection: (id: string) => 
    api.put(`/election/end/${id}`),
  
  getElectionCounts: (id: string) => 
    api.get(`/election/${id}/counts`),
};

// Vote API
export const voteAPI = {
  submitVote: (voteData: { 
    electionId: string; 
    candidateId: number; 
  }) => 
    api.post('/vote/submit', voteData),
  
  getElectionResults: (electionId: string) => 
    api.get(`/vote/results/${electionId}`),
};

export default api;