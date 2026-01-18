import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Import dashboard pages
import Overview from "./pages/dashboard/Overview";
import Members from "./pages/dashboard/Members";
import Profile from "./pages/dashboard/Profile";

// Import layouts and components
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Overview />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/overview"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard/members"
            element={
              <DashboardLayout>
                <Members />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            }
          />

          {/* Utility Routes - placeholder pages */}
          <Route path="/terms" element={<NotFound />} />
          <Route path="/privacy" element={<NotFound />} />
          <Route path="/forgot-password" element={<NotFound />} />
          <Route path="/help" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />

          {/* 404 Route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
