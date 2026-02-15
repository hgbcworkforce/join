import { Routes, Route, Navigate } from 'react-router-dom'

// Dashboard Pages
import DashboardLayout from './layouts/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Submissions from './pages/dashboard/Submissions'
import Hero from './pages/Hero'

// Auth Pages
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin'
import NotFound from './pages/NotFound'




const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
};

function App() {
  return (
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
      </Route>


      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
