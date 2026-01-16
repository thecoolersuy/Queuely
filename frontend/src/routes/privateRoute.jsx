import { Navigate, Outlet } from "react-router-dom";
import { getValidToken } from "../utils/auth";

const PrivateRoutes = () => {
  const token = getValidToken(); // ← Use validated token

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;