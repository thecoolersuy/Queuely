import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getValidToken } from "../utils/auth";

const PrivateRoutes = () => {
  const [token, setToken] = useState(getValidToken());

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(getValidToken());
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

  return <Outlet />;
};

export default PrivateRoutes;