const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Init middleware
app.use(express.json({ extended: false }));

// Enable CORS
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/otp', require('./routes/otp'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/election', require('./routes/election'));
app.use('/api/vote', require('./routes/vote'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});