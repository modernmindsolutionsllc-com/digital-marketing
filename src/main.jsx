import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminLogin from "./components/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import LeadsDashboard from "./components/LeadsDashboard";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public: Main website */}
        <Route path="/" element={<App />} />

        {/* Public: Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected: Admin dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<LeadsDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
