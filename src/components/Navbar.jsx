import { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import AuthModal from './AuthModal'
import { FiPackage, FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiShield } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const openAuth = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <FiPackage className="text-accent-primary text-2xl" />
              <span>SwiftShip</span>
            </Link>
            
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <ul className="hidden lg:flex items-center gap-8">
              {!user && <li><Link to="/" className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiPackage /> Home</Link></li>}
              <li><Link to="/tracking" className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiSearch /> Track Package</Link></li>
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <li><Link to="/admin" className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiShield /> Admin Panel</Link></li>
                  ) : (
                    <li><Link to="/dashboard" className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiUser /> Dashboard</Link></li>
                  )}
                  <li className="text-gray-400 flex items-center gap-2"><FiUser size={16} /> {user.name}</li>
                  <li>
                    <button onClick={logout} className="bg-accent-danger hover:bg-red-600 px-4 py-2 rounded-lg transition flex items-center gap-2">
                      <FiLogOut /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><button onClick={() => openAuth('login')} className="text-gray-300 hover:text-white transition">Login</button></li>
                  <li><button onClick={() => openAuth('signup')} className="bg-accent-primary hover:bg-blue-600 px-4 py-2 rounded-lg transition">Sign Up</button></li>
                </>
              )}
            </ul>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-dark-border mt-2 pt-4">
              <ul className="flex flex-col gap-4">
                {!user && <li><Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiPackage /> Home</Link></li>}
                <li><Link to="/tracking" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiSearch /> Track Package</Link></li>
                {user ? (
                  <>
                    {user.role === 'admin' ? (
                      <li><Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiShield /> Admin Panel</Link></li>
                    ) : (
                      <li><Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition flex items-center gap-2"><FiUser /> Dashboard</Link></li>
                    )}
                    <li className="text-gray-400 flex items-center gap-2"><FiUser size={16} /> {user.name}</li>
                    <li>
                      <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="bg-accent-danger hover:bg-red-600 px-4 py-2 rounded-lg transition w-full text-left flex items-center gap-2">
                        <FiLogOut /> Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><button onClick={() => openAuth('login')} className="text-gray-300 hover:text-white transition w-full text-left">Login</button></li>
                    <li><button onClick={() => openAuth('signup')} className="bg-accent-primary hover:bg-blue-600 px-4 py-2 rounded-lg transition w-full text-left">Sign Up</button></li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setShowAuthModal(false)} 
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </>
  )
}
