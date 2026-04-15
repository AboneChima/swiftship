import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tracking from './pages/Tracking'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function HomeRedirect() {
  const { user, loading } = useContext(AuthContext)
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
  }
  
  return <Home />
}

function App() {
  // Maintenance mode check
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true'

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-3xl font-bold text-white mb-4">Site Under Maintenance</h1>
          <p className="text-gray-400 text-lg">
            We'll be back soon. Thank you for your patience.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
