import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getValidToken } from "../utils/auth";

const PrivateRoutes = ({ allowedRole }) => {
  const [token, setToken] = useState(getValidToken());
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(getValidToken());
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };

    window.addEventListener("token-changed", handleTokenChange);
    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("token-changed", handleTokenChange);
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const redirectPath = user.role === 'business' ? "/business-dashboard" : "/homepage";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;