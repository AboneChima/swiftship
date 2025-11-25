import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiPackage, FiCheckCircle, FiTruck, FiClock, FiSearch, FiPhone, FiMapPin, FiX } from 'react-icons/fi'

const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'Pending' },
  picked_up: { icon: FiPackage, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'Picked Up' },
  in_transit: { icon: FiTruck, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', label: 'In Transit' },
  out_for_delivery: { icon: FiTruck, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'Out for Delivery' },
  delivered: { icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'Delivered' }
}

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const [packages, setPackages] = useState([])
  const [stats, setStats] = useState({ total: 0, delivered: 0, in_transit: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await axios.get('/api/packages/my-packages')
      setPackages(res.data)
      
      const total = res.data.length
      const delivered = res.data.filter(p => p.status === 'delivered').length
      const in_transit = res.data.filter(p => p.status === 'in_transit' || p.status === 'out_for_delivery').length
      const pending = res.data.filter(p => p.status === 'pending' || p.status === 'picked_up').length
      
      setStats({ total, delivered, in_transit, pending })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const viewDetails = async (pkg) => {
    try {
      const res = await axios.get(`/api/packages/track/${pkg.tracking_number}`)
      setSelectedPackage(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your packages...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Here's what's happening with your shipments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <FiPackage className="text-accent-primary text-2xl sm:text-3xl" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">Total Packages</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <FiCheckCircle className="text-green-400 text-2xl sm:text-3xl" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.delivered}</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">Delivered</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <FiTruck className="text-purple-400 text-2xl sm:text-3xl" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.in_transit}</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">In Transit</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <FiClock className="text-yellow-400 text-2xl sm:text-3xl" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.pending}</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">Pending</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/tracking" className="bg-accent-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base">
              <FiSearch />
              Track Package
            </Link>
            <button className="bg-dark-bg hover:bg-dark-hover border border-dark-border text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base">
              <FiPhone />
              Contact Support
            </button>
          </div>
        </div>

        {/* Packages List */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
            <FiPackage className="text-accent-primary" />
            Your Packages
          </h2>

          {packages.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <FiPackage className="text-gray-600 text-5xl sm:text-6xl mx-auto mb-4" />
              <p className="text-gray-400 text-base sm:text-lg mb-4">You don't have any packages yet</p>
              <Link to="/tracking" className="text-accent-primary hover:underline font-semibold text-sm sm:text-base">
                Track a package →
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {packages.map((pkg) => {
                const status = statusConfig[pkg.status] || statusConfig.pending
                const StatusIcon = status.icon
                return (
                  <div key={pkg.id} className="bg-dark-bg border border-dark-border hover:border-accent-primary rounded-xl p-4 sm:p-6 transition cursor-pointer" onClick={() => viewDetails(pkg)}>
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                          <div className={`${status.bg} p-2 sm:p-3 rounded-lg`}>
                            <StatusIcon className={`${status.color} text-xl sm:text-2xl`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base sm:text-xl text-white truncate">{pkg.tracking_number}</p>
                            <p className="text-xs sm:text-sm text-gray-400">
                              Created {new Date(pkg.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`${status.bg} ${status.border} border-2 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${status.color} whitespace-nowrap`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500">From</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-300 truncate">{pkg.sender_location}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 sm:gap-3">
                            <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500">To</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-300 truncate">{pkg.receiver_location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="text-accent-primary hover:underline text-xs sm:text-sm font-semibold text-left">
                        View Details →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Package Details Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPackage(null)}>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Package Details</h2>
              <button onClick={() => setSelectedPackage(null)} className="text-gray-400 hover:text-white text-xl sm:text-2xl">
                <FiX />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-dark-bg border border-dark-border rounded-xl p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-400 mb-2">Tracking Number</p>
                <p className="text-lg sm:text-2xl font-bold text-white break-all">{selectedPackage.tracking_number}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-bg border border-dark-border rounded-xl p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-gray-400 mb-3">From</p>
                  <p className="font-semibold text-white text-sm sm:text-base">{selectedPackage.sender_name}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{selectedPackage.sender_location}</p>
                </div>
                <div className="bg-dark-bg border border-dark-border rounded-xl p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-gray-400 mb-3">To</p>
                  <p className="font-semibold text-white text-sm sm:text-base">{selectedPackage.receiver_name}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{selectedPackage.receiver_location}</p>
                </div>
              </div>

              {selectedPackage.history && selectedPackage.history.length > 0 && (
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white mb-4">Tracking History</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {selectedPackage.history.map((event, idx) => {
                      const eventStatus = statusConfig[event.status] || statusConfig.pending
                      const EventIcon = eventStatus.icon
                      return (
                        <div key={idx} className="flex gap-3 sm:gap-4 items-start">
                          <div className={`${eventStatus.bg} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                            <EventIcon className={`${eventStatus.color} text-lg sm:text-xl`} />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm sm:text-base">{eventStatus.label}</p>
                            <p className="text-xs sm:text-sm text-gray-400">{new Date(event.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
