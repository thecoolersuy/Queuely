import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const UserLogin = React.lazy(() => import("../pages/public/Login"));
const UserRegister = React.lazy(() => import("../pages/public/Register"));

const PublicRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    // Check periodically
    const interval = setInterval(checkAuth, 1000);

    // Listen for storage changes
    window.addEventListener('storage', checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Still checking
  if (isAuthenticated === null) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;
  }

  // If logged in, redirect to homepage
  if (isAuthenticated) {
    return <Navigate to="/homepage" replace />;
  }

  // Not logged in - show public routes
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: '20px' }}>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default PublicRoutes;