import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  Avatar,
  CircularProgress,
} from '@mui/material';

const PendingApproval: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VoteChain
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2, 
                bgcolor: 'primary.main' 
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            
            <Typography variant="h4" gutterBottom>
              Account Pending Approval
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Hello {user?.name || 'User'}, your account is currently pending admin approval.
            </Alert>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              {user?.email?.endsWith('@superior.edu.pk') 
                ? 'Your account with the Superior University email has been automatically verified. Admin approval is in progress.' 
                : 'Your account has been registered. Please wait for admin approval to verify your identity.'}
            </Typography>
            
            <Box sx={{ my: 3 }}>
              <CircularProgress size={60} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Waiting for approval...
              </Typography>
            </Box>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              You will receive an email notification once your account is approved.
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PendingApproval;