import React, { Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const Homepage = React.lazy(() => import("../pages/private/HomePage"));

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
       
        <Route path="*" element={<Navigate to="/homepage" replace />} />
      </Routes>
    </Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;