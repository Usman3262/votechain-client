import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './styles/theme';
import SplashScreen from './components/SplashScreen';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard'; // We'll create this
import AdminDashboard from './pages/admin/AdminDashboard';
import ElectionList from './pages/user/ElectionList'; // We'll create this
import VotePage from './pages/user/VotePage'; // We'll create this
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <SplashScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <SplashScreen />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { loading } = useAuth();

  useEffect(() => {
    // Simulate initial loading (e.g., checking auth status, loading user data)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show splash screen for 1.5 seconds minimum

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until auth is loaded and splash screen timer is done
  if (loading || isLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes - User */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/elections" 
        element={
          <ProtectedRoute>
            <ElectionList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vote/:electionId" 
        element={
          <ProtectedRoute>
            <VotePage />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Routes - Admin */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Default route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;