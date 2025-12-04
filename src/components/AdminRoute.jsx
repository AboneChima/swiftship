import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-dark-bg">Loading...</div>
  
  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-dark-bg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Admin Access Required</h1>
            <p className="text-gray-400 mb-6">Please login to access the admin panel</p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-accent-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>
          </div>
        </div>
        {showAuthModal && (
          <AuthModal 
            mode="login" 
            onClose={() => setShowAuthModal(false)} 
            onSwitchMode={() => {}}
          />
        )}
      </>
    )
  }
  
  return user.role === 'admin' ? children : <Navigate to="/" />
}
