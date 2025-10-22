import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const SplashScreen: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Box mb={4}>
        <img
          src="/logo.svg" // You can replace this with your actual logo
          alt="VoteChain Logo"
          style={{ height: 80, width: 80 }}
        />
      </Box>
      <Typography variant="h4" gutterBottom color="primary">
        VoteChain
      </Typography>
      <Typography variant="h6" color="textSecondary" mb={4}>
        Secure Blockchain Voting System
      </Typography>
      <CircularProgress size={60} color="primary" />
      <Typography variant="body1" mt={2} color="textSecondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default SplashScreen;