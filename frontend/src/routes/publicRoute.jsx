import { Navigate, Outlet } from "react-router-dom";
import { getValidToken } from "../utils/auth";

const PublicRoutes = () => {
  const token = getValidToken(); // ← Use validated token

  if (token) {
    return <Navigate to="/homepage" replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;