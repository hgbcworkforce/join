import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Dashboard Pages
import DashboardLayout from './layouts/DashboardLayout'
import Hero from './components/Hero'

// Auth Pages
import Signup from './pages/Signup'
import Signin from './pages/Signin'

function App() {

  return (
    <>
    <Routes>
      {/* Dashboard Routes */}
      <Route path="/" element={<Hero />} />
      <Route path="/dashboard" element={<DashboardLayout />} />

      {/* Auth Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

    </Routes>
    </>
)
}

export default App
