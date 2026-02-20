import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/publicRoute";
import PrivateRoutes from "./routes/privateRoute";
import { getValidToken } from "./utils/auth";

const LandingPage = React.lazy(() => import("./pages/public/LandingPage"));
const Homepage = React.lazy(() => import("./pages/private/HomePage"));
const Login = React.lazy(() => import("./pages/public/Login"));
const Register = React.lazy(() => import("./pages/public/Register"));
const BusinessRegister = React.lazy(() => import("./pages/public/BusinessRegister"));
const BusinessLogin = React.lazy(() => import("./pages/public/BusinessLogin"));
const BusinessDashboard = React.lazy(() => import("./pages/private/BusinessDashboard"));
const BarberShopInfoPage = React.lazy(() => import("./pages/private/BarberShopInfoPage"));
const BookingPage = React.lazy(() => import("./pages/private/BookingPage"));
const MyBookings = React.lazy(() => import("./pages/private/MyBookings"));
const ForgotPassword = React.lazy(() => import("./pages/public/ForgotPassword"));


const AppRoutes = () => {
  const [token, setToken] = React.useState(getValidToken());
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user') || '{}'));

  React.useEffect(() => {
    const handleTokenChange = () => {
      setToken(getValidToken());
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };

    window.addEventListener("token-changed", handleTokenChange);
    window.addEventListener("storage", handleTokenChange); // Sync multiple tabs

    return () => {
      window.removeEventListener("token-changed", handleTokenChange);
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  return (
    <Suspense>
      <Routes>
        {/* Root */}
        <Route
          path="/"
          element={
            token
              ? <Navigate to={user?.role === 'business' ? "/business-dashboard" : "/homepage"} replace />
              : <LandingPage />
          }
        />

        {/* Public routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business-register" element={<BusinessRegister />} />
          <Route path="/business-login" element={<BusinessLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword type="customer" />} />
          <Route path="/business-forgot-password" element={<ForgotPassword type="business" />} />
        </Route>

        {/* Customer Private routes */}
        <Route element={<PrivateRoutes allowedRole="customer" />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/barbershop/:id" element={<BarberShopInfoPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* Business Private routes */}
        <Route element={<PrivateRoutes allowedRole="business" />}>
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;