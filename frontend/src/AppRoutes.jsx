import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/publicRoute";
import PrivateRoutes from "./routes/privateRoute";
import { getValidToken } from "./utils/auth";

const LandingPage = React.lazy(() => import("./pages/public/LandingPage"));
const Homepage = React.lazy(() => import("./pages/private/HomePage"));
const Login = React.lazy(() => import("./pages/public/Login"));
const Register = React.lazy(() => import("./pages/public/Register"));

const AppRoutes = () => {
  const token = getValidToken();

  return (
    <Suspense >
      <Routes>

        {/* Root */}
        <Route
          path="/"
          element={token ? <Navigate to="/homepage" replace /> : <LandingPage />}
        />

       <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/homepage" element={<Homepage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
