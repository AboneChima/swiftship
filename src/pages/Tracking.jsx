import { useState } from 'react'
import axios from '../config/axios'
import { FiSearch, FiPackage, FiMapPin, FiClock, FiCheckCircle, FiTruck, FiBox, FiPhone, FiMail } from 'react-icons/fi'

const statusConfig = {
  pending: { 
    label: 'Order Placed', 
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: FiBox
  },
  picked_up: { 
    label: 'Picked Up', 
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: FiPackage
  },
  in_transit: { 
    label: 'In Transit', 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: FiTruck
  },
  out_for_delivery: { 
    label: 'Out for Delivery', 
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: FiTruck
  },
  delivered: { 
    label: 'Delivered', 
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: FiCheckCircle
  }
}

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const res = await axios.get(`/api/packages/track/${trackingNumber.trim()}`)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Package not found. Please check your tracking number.')
    } finally {
      setLoading(false)
    }
  }

  const currentStatus = result ? statusConfig[result.status] || statusConfig.pending : null
  const StatusIcon = currentStatus?.icon

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-dark-card via-dark-bg to-dark-bg border-b border-dark-border">
        <div className="w-full px-6 lg:px-12 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Track Your Shipment
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Enter your tracking number to get real-time updates on your package
            </p>

            {/* Search Form */}
            <form onSubmit={handleTrack} className="relative">
              <div className="relative">
                <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  placeholder="Enter tracking number (e.g., SSN-ONI-234567)"
                  className="w-full pl-16 pr-6 py-5 bg-dark-card border-2 border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-accent-primary focus:outline-none transition text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-accent-primary hover:bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Tracking...
                  </>
                ) : (
                  <>
                    <FiSearch />
                    Track Package
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full px-6 lg:px-12 py-12">
        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6 flex items-start gap-4">
              <div className="text-red-400 text-2xl">⚠</div>
              <div>
                <p className="text-red-400 font-semibold text-lg">Package Not Found</p>
                <p className="text-gray-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Result */}
        {result && currentStatus && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Status Overview */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Tracking Number</p>
                  <p className="text-3xl font-bold text-white">{result.tracking_number}</p>
                </div>
                <div className={`${currentStatus.bg} ${currentStatus.border} border-2 rounded-xl px-6 py-4 flex items-center gap-3`}>
                  <StatusIcon className={`${currentStatus.color} text-3xl`} />
                  <div>
                    <p className={`${currentStatus.color} font-bold text-xl`}>{currentStatus.label}</p>
                    <p className="text-gray-400 text-sm">Current Status</p>
                  </div>
                </div>
              </div>

              {/* Package Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-dark-bg border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <FiMapPin className="text-blue-400 text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm mb-2">From</p>
                      <p className="text-white font-semibold text-lg">{result.sender_name}</p>
                      <p className="text-gray-400">{result.sender_location}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-dark-bg border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                      <FiMapPin className="text-green-400 text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm mb-2">To</p>
                      <p className="text-white font-semibold text-lg">{result.receiver_name}</p>
                      <p className="text-gray-400">{result.receiver_location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FiClock className="text-accent-primary" />
                Tracking History
              </h3>
              
              {result.history && result.history.length > 0 ? (
                <div className="space-y-6">
                  {result.history.map((event, idx) => {
                    const eventStatus = statusConfig[event.status] || statusConfig.pending
                    const EventIcon = eventStatus.icon
                    const isLatest = idx === 0
                    
                    return (
                      <div key={idx} className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className={`${isLatest ? eventStatus.bg : 'bg-dark-bg'} ${isLatest ? eventStatus.border : 'border-dark-border'} border-2 p-4 rounded-xl`}>
                            <EventIcon className={`${isLatest ? eventStatus.color : 'text-gray-600'} text-2xl`} />
                          </div>
                          {idx < result.history.length - 1 && (
                            <div className="w-0.5 h-full bg-dark-border my-2"></div>
                          )}
                        </div>
                        <div className={`flex-1 pb-6 ${isLatest ? 'bg-dark-bg border border-dark-border rounded-xl p-6' : ''}`}>
                          <p className={`font-bold text-lg ${isLatest ? eventStatus.color : 'text-gray-300'}`}>
                            {eventStatus.label}
                          </p>
                          <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                            <FiClock size={14} />
                            {new Date(event.timestamp).toLocaleString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiPackage className="text-gray-600 text-6xl mx-auto mb-4" />
                  <p className="text-gray-400">No tracking history available yet</p>
                </div>
              )}
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
              <p className="text-gray-300 mb-6">If you have questions about your shipment, contact our support team.</p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="bg-dark-card p-3 rounded-lg">
                    <FiPhone className="text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-semibold">+234 800 SWIFT</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="bg-dark-card p-3 rounded-lg">
                    <FiMail className="text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold">support@swiftship.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!result && !error && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-card border border-dark-border rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">How to Track Your Package</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-accent-primary/10 text-accent-primary font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">1</div>
                  <p className="text-gray-300">Enter your tracking number in the search box above</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent-primary/10 text-accent-primary font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">2</div>
                  <p className="text-gray-300">Click "Track Package" to view real-time status</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent-primary/10 text-accent-primary font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">3</div>
                  <p className="text-gray-300">View detailed tracking history and delivery updates</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
