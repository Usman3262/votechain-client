import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { electionAPI, voteAPI } from '../../services/api';

interface Election {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  candidates: Array<{
    id: number;
    name: string;
  }>;
}

interface VoteCount {
  candidateId: number;
  candidateName: string;
  votes: number;
}

const VotePage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [election, setElection] = useState<Election | null>(null);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  useEffect(() => {
    if (electionId) {
      fetchElectionData();
      const interval = setInterval(() => {
        updateTimer();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [electionId]);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      // Fetch election details
      const electionResponse = await electionAPI.getElection(electionId!);
      setElection(electionResponse.data.election);

      // Check if user has already voted
      // This would typically be checked via backend
      // For now we'll assume based on some criteria
      // In a real app, this would be an API call to check voter status

      // Fetch current vote counts
      fetchVoteCounts();
    } catch (err) {
      console.error('Error fetching election data:', err);
      setError('Failed to load election data');
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteCounts = async () => {
    try {
      const response = await voteAPI.getElectionResults(electionId!);
      const counts = response.data.candidates.map((c: any) => ({
        candidateId: c.id,
        candidateName: c.name,
        votes: c.votes,
      }));
      setVoteCounts(counts);
    } catch (err) {
      console.error('Error fetching vote counts:', err);
    }
  };

  const updateTimer = () => {
    if (!election) return;

    const now = new Date().getTime();
    const end = new Date(election.endTime).getTime();

    if (end > now) {
      const distance = end - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeLeft('Election Ended');
    }
  };

  const handleVote = async () => {
    if (selectedCandidate === null) {
      setError('Please select a candidate');
      return;
    }

    if (!election?.isActive) {
      setError('Election is not active');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await voteAPI.submitVote({
        electionId: electionId!,
        candidateId: selectedCandidate,
      });
      
      setHasVoted(true);
      // Refresh vote counts
      fetchVoteCounts();
    } catch (err: any) {
      console.error('Error submitting vote:', err);
      setError(err.response?.data?.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!election) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Election not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vote in {election.title}
          </Typography>
          <Button color="inherit" onClick={() => navigate('/elections')}>
            Back
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Election Info */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {election.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {election.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2">
                  <strong>Status:</strong> 
                  <Chip 
                    label={election.isActive ? 'Active' : 'Inactive'} 
                    color={election.isActive ? 'success' : 'default'} 
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Ends in:</strong> {timeLeft}
                </Typography>
                
                {hasVoted ? (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    You have successfully voted in this election!
                  </Alert>
                ) : !election.isActive ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    This election is not active.
                  </Alert>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Select a Candidate
                    </Typography>
                    {election.candidates.map((candidate) => (
                      <Button
                        key={candidate.id}
                        variant={selectedCandidate === candidate.id ? 'contained' : 'outlined'}
                        fullWidth
                        sx={{ mb: 1, justifyContent: 'space-between' }}
                        onClick={() => setSelectedCandidate(candidate.id)}
                        disabled={hasVoted || !election.isActive}
                      >
                        {candidate.name}
                        {voteCounts.find(vc => vc.candidateId === candidate.id) && (
                          <Chip 
                            label={`${voteCounts.find(vc => vc.candidateId === candidate.id)?.votes || 0} votes`} 
                            size="small" 
                            color="primary"
                          />
                        )}
                      </Button>
                    ))}
                    
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleVote}
                      disabled={hasVoted || !election.isActive || selectedCandidate === null || submitting}
                      sx={{ mt: 2 }}
                    >
                      {submitting ? <CircularProgress size={24} /> : 'Submit Vote'}
                    </Button>
                    
                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Live Vote Count
              </Typography>
              {voteCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={voteCounts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="candidateName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votes" name="Votes" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography variant="body1" color="textSecondary">
                    No votes yet
                  </Typography>
                </Box>
              )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Vote Distribution
              </Typography>
              {voteCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={voteCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ candidateName, votes }) => `${candidateName}: ${votes}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="votes"
                    >
                      {voteCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography variant="body1" color="textSecondary">
                    No votes yet
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VotePage;