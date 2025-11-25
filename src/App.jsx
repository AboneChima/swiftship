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
