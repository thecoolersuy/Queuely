import { Navigate, Outlet } from "react-router-dom";
import { getValidToken } from "../utils/auth";

const PrivateRoutes = () => {
  const token = getValidToken();

  if (!token) {'kp'
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
