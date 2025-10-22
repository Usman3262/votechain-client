import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { electionAPI } from '../../services/api';

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

const ElectionList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await electionAPI.getElections();
      setElections(response.data.elections);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewElection = (electionId: string) => {
    navigate(`/vote/${electionId}`);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Elections
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Elections
        </Typography>

        {loading ? (
          <Typography>Loading elections...</Typography>
        ) : elections.length === 0 ? (
          <Typography>No elections available at the moment.</Typography>
        ) : (
          <Grid container spacing={3}>
            {elections.map((election) => (
              <Grid item xs={12} md={6} lg={4} key={election._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {election.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {election.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Start:</strong> {new Date(election.startTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>End:</strong> {new Date(election.endTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {election.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Candidates:</strong> {election.candidates.length}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleViewElection(election._id)}
                        disabled={!election.isActive}
                      >
                        {election.isActive ? 'Vote Now' : 'View Details'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ElectionList;