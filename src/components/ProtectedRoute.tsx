import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowUnapproved?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user', 'admin'], 
  allowUnapproved = false 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user is approved (if required)
  if (!allowUnapproved && user && user.approved === false) {
    return <Navigate to="/pending-approval" />;
  }

  // Check if user has required role
  if (user && !allowedRoles.includes(user.role)) {
    // If user is not admin but trying to access admin route
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/dashboard" />;
    }
    // For other role mismatches, redirect to home
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;