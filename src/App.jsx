import { Routes, Route, Navigate } from 'react-router-dom'

// Dashboard Pages
import DashboardLayout from './layouts/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Submissions from './pages/dashboard/Submissions'
import TeamMembers from './pages/dashboard/TeamMembers'
import Profile from './pages/dashboard/Profile'
import Hero from './pages/Hero'

// Auth Pages
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin'
import NotFound from './pages/NotFound'

// Scroll To Top Component
import ScrollToTop from './components/ScrollToTop'




import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Hero />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Dashboard Routes*/}
        <Route path="/dashboard" element={
           <ProtectedRoute>
             <DashboardLayout />
           </ProtectedRoute>
         }>

          <Route index element={<Overview />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="team-members" element={<TeamMembers />} />
          <Route path="profile" element={<Profile />} />
        </Route>


        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
