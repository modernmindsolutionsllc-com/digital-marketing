import { Navigate } from "react-router-dom";

/**
 * PrivateRoute
 * ---------------------------------------------------------------------------
 * Guards admin-only routes. Checks for the auth token stored in localStorage
 * by the AdminLogin component after a successful OTP verification.
 *
 * Usage:
 *   <Route path="/admin/dashboard" element={
 *     <PrivateRoute><DashboardLayout /></PrivateRoute>
 *   } />
 * ---------------------------------------------------------------------------
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("mmsllc_admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
