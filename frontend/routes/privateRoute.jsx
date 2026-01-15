import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

const Homepage = React.lazy(() => import("../pages/private/Homepage"));

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check token on mount
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      
      // If no token, redirect to login
      if (!token) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();

    // Check every second if token still exists
    const interval = setInterval(checkAuth, 1000);

    // Listen for storage changes (token deleted in another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, [navigate]);

  // Still checking authentication
  if (isAuthenticated === null) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated - show private routes
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: '20px' }}>Loading...</div>}>
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/dashboard" element={<Homepage />} /> {/* Alias */}
        <Route path="*" element={<Navigate to="/homepage" replace />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;