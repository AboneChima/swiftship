import { useState, useEffect, useRef } from 'react'
import axios from '../config/axios'
import { useReactToPrint } from 'react-to-print'
import { FiPackage, FiUsers, FiPlus, FiEdit2, FiTrash2, FiPrinter, FiX, FiSave, FiCheckCircle, FiTruck, FiClock, FiBox, FiMail } from 'react-icons/fi'
import EmailNotification from '../components/EmailNotification'
import PackageForm from '../components/PackageForm'
import Receipt from '../components/Receipt'

function OldReceipt({ packageData }) {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div style={{
      width: '210mm',
      height: '297mm',
      padding: '12mm',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      boxSizing: 'border-box',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact'
    }}>
      {/* Red Border */}
      <div style={{
        position: 'absolute',
        top: '8mm',
        left: '8mm',
        right: '8mm',
        bottom: '8mm',
        border: '3px solid #dc2626',
        pointerEvents: 'none',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}></div>

      {/* Diagonal Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.08
      }}>
        <img 
          src="/watermark.png" 
          alt="Watermark" 
          style={{ 
            width: '600px',
            height: 'auto'
          }} 
        />
      </div>

      {/* Certified True Copy Text Watermark - Small Left Side Top */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '15%',
        transform: 'rotate(-50deg)',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0.5,
        fontSize: '28px',
        fontWeight: '400',
        color: '#1f2937',
        whiteSpace: 'nowrap',
        letterSpacing: '2px',
        fontFamily: 'Arial, sans-serif',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}>
        Certified True Copy
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header with Logo and Image */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '18px',
          borderBottom: '3px solid #e5e7eb',
          paddingBottom: '15px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{
                width: '55px',
                height: '55px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '30px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}>
                <span style={{ transform: 'rotate(-10deg)' }}>✈</span>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold',
                  color: '#1e3a8a',
                  margin: 0,
                  letterSpacing: '1.5px',
                  lineHeight: '1.1'
                }}>SWIFTSHIP EXPRESS</h1>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#6b7280',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  marginTop: '2px'
                }}>GLOBAL LOGISTICS SOLUTIONS</div>
              </div>
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#000'
            }}>
              Tracking Number: <span style={{ 
                color: '#dc2626',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>{packageData.tracking_number}</span>
            </div>
          </div>
          <div style={{ 
            width: '240px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img 
              src="/top-right-image.png" 
              alt="Logistics" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>

        {/* Company Info */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '20px',
          padding: '14px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}>
          <h2 style={{ 
            fontSize: '19px', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            color: '#1e3a8a',
            letterSpacing: '0.5px'
          }}>SwiftShip Express</h2>
          <div style={{ 
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.6'
          }}>
            <strong>Address:</strong> 87 George Street DURHAM DH6 6YK | <strong>Email:</strong> info@swiftshipexpress.com | <strong>Website:</strong> www.swiftshipexpress.com
          </div>
        </div>

        {/* Sender and Receiver Info */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Sender */}
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #fbbf24',
            minHeight: '85px',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>FROM (SENDER)</h3>
            <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: '#000' }}>
              {packageData.sender_name}
            </div>
            <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.6' }}>
              <div><strong>Address:</strong> {packageData.sender_location}</div>
              <div><strong>Origin:</strong> SwiftShip Express</div>
            </div>
          </div>

          {/* Receiver */}
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            minHeight: '85px',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>TO (CONSIGNEE)</h3>
            <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '6px', color: '#000' }}>
              {packageData.receiver_name}
            </div>
            <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.6' }}>
              <div><strong>Phone:</strong> +1234567890</div>
              <div><strong>Address:</strong> {packageData.receiver_location}</div>
            </div>
          </div>

          {/* Barcode and Order Info */}
          <div>
            <div style={{
              border: '2px solid #000',
              padding: '10px',
              textAlign: 'center',
              marginBottom: '10px',
              backgroundColor: '#fff',
              borderRadius: '6px'
            }}>
              <img 
                src="/new barcode.png" 
                alt="Barcode" 
                style={{ 
                  width: '100%',
                  height: '70px',
                  objectFit: 'contain',
                  marginBottom: '6px'
                }} 
              />
              <div style={{ 
                fontSize: '10px', 
                fontFamily: 'monospace', 
                fontWeight: 'bold',
                color: '#000',
                letterSpacing: '0.5px'
              }}>
                {packageData.tracking_number}
              </div>
            </div>
            <div style={{ 
              fontSize: '12px', 
              lineHeight: '1.8',
              backgroundColor: '#f9fafb',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db'
            }}>
              <div><strong>Order ID:</strong> {packageData.id || '2089'}</div>
              <div><strong>Payment Due:</strong> {currentDate.toISOString().split('T')[0]}</div>
              <div><strong>Booking Mode:</strong> <span style={{ 
                border: '1px solid #000', 
                padding: '2px 8px',
                display: 'inline-block',
                fontWeight: 'bold'
              }}>Express</span></div>
              <div><strong>Insurance:</strong> 0 Gift</div>
              <div><strong>Luggage:</strong> {packageData.weight} kg</div>
            </div>
          </div>
        </div>

        {/* Shipment Details Table */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginBottom: '20px',
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: '#fff',
              borderBottom: '3px solid #1e3a8a',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #2563eb', fontWeight: 'bold' }}>Qty</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #2563eb', fontWeight: 'bold' }}>Product</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #2563eb', fontWeight: 'bold' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #2563eb', fontWeight: 'bold' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #2563eb', fontWeight: 'bold' }}>Shipping</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #2563eb', fontWeight: 'bold' }}>Clearance</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #2563eb', fontWeight: 'bold' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ 
              backgroundColor: '#f8fafc',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: '600' }}>1</td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: '600' }}>shipment</td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db' }}>
                <span style={{ 
                  border: '2px solid #000', 
                  padding: '4px 10px',
                  display: 'inline-block',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>{packageData.status}</span>
              </td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db' }}>Shipping</td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: '600' }}>$ 45.00</td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: '600' }}>$ 2430.00</td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: 'bold', fontSize: '15px' }}>$ 2475.00</td>
            </tr>
          </tbody>
        </table>

        {/* Footer with Payment Methods and Stamp */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          gap: '30px'
        }}>
          {/* Payment Methods */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', color: '#000' }}>Payment Methods:</h3>
            <div style={{
              border: '2px solid #e5e7eb',
              padding: '14px',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              marginBottom: '8px',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '10px',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  padding: '6px 10px',
                  backgroundColor: '#fff',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#000'
                }}>SECURED BY GeoTrust</div>
                <div style={{ 
                  padding: '6px 10px',
                  backgroundColor: '#1a1f71',
                  color: '#fff',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}>VISA</div>
                <div style={{ 
                  padding: '6px 10px',
                  background: 'linear-gradient(90deg, #eb001b 0%, #f79e1b 100%)',
                  color: '#fff',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}>Mastercard</div>
                <div style={{ 
                  padding: '6px 10px',
                  backgroundColor: '#003087',
                  color: '#fff',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact'
                }}>PayPal</div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#000',
                fontWeight: 'bold'
              }}>
                SAFE SHOPPING
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.5' }}>
              For your convenience we have SwiftShip Express several payment reliable, fast, secure.
            </p>
          </div>

          {/* Official Stamp */}
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: 'bold', 
              marginBottom: '10px',
              color: '#000'
            }}>
              Official Stamp/{formattedDate}
            </div>
            <div style={{
              width: '150px',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/watermark.png" 
                alt="Official Stamp" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }} 
              />
            </div>
            <div style={{ 
              fontSize: '11px', 
              marginTop: '8px', 
              fontWeight: 'bold',
              color: '#4b5563'
            }}>
              Stamp Duty:
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' },
  picked_up: { icon: FiBox, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Picked Up' },
  in_transit: { icon: FiTruck, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'In Transit' },
  out_for_delivery: { icon: FiTruck, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Out for Delivery' },
  delivered: { icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Delivered' }
}

export default function Admin() {
  const [packages, setPackages] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [activeTab, setActiveTab] = useState('packages')
  const [formData, setFormData] = useState({
    tracking_number: '',
    sender_name: '',
    sender_phone: '',
    sender_id: '',
    sender_email: '',
    sender_country: '',
    sender_location: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_email: '',
    receiver_country: '',
    receiver_location: '',
    product_name: '',
    weight: '',
    shipping_cost: '',
    clearance_cost: '',
    collection_date: '',
    collection_time: '',
    delivery_date: '',
    arrival_date: '',
    status: 'pending'
  })
  const [printPackage, setPrintPackage] = useState(null)
  const receiptRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt-${printPackage?.tracking_number || 'SwiftShip'}`,
    onAfterPrint: () => setPrintPackage(null),
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  useEffect(() => {
    if (printPackage) {
      handlePrint()
    }
  }, [printPackage, handlePrint])

  const fetchPackages = async () => {
    try {
      const res = await axios.get('/admin/packages')
      setPackages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPackage) {
        await axios.put(`/admin/packages?id=${editingPackage.id}`, formData)
      } else {
        await axios.post('/admin/packages', formData)
      }
      fetchPackages()
      resetForm()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving package')
    }
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg)
    setFormData({
      tracking_number: pkg.tracking_number,
      sender_name: pkg.sender_name,
      sender_phone: pkg.sender_phone || '',
      sender_id: pkg.sender_id || '',
      sender_email: pkg.sender_email || '',
      sender_country: pkg.sender_country || '',
      sender_location: pkg.sender_location,
      receiver_name: pkg.receiver_name,
      receiver_phone: pkg.receiver_phone || '',
      receiver_email: pkg.receiver_email || '',
      receiver_country: pkg.receiver_country || '',
      receiver_location: pkg.receiver_location,
      product_name: pkg.product_name || '',
      weight: pkg.weight,
      shipping_cost: pkg.shipping_cost || '',
      clearance_cost: pkg.clearance_cost || '',
      collection_date: pkg.collection_date || '',
      collection_time: pkg.collection_time || '',
      delivery_date: pkg.delivery_date || '',
      arrival_date: pkg.arrival_date || '',
      status: pkg.status
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return
    try {
      await axios.delete(`/admin/packages?id=${id}`)
      fetchPackages()
    } catch (err) {
      alert('Error deleting package')
    }
  }



  const resetForm = () => {
    setFormData({
      tracking_number: '',
      sender_name: '',
      sender_phone: '',
      sender_id: '',
      sender_email: '',
      sender_country: '',
      sender_location: '',
      receiver_name: '',
      receiver_phone: '',
      receiver_email: '',
      receiver_country: '',
      receiver_location: '',
      product_name: '',
      weight: '',
      shipping_cost: '',
      clearance_cost: '',
      collection_date: '',
      collection_time: '',
      delivery_date: '',
      arrival_date: '',
      status: 'pending'
    })
    setEditingPackage(null)
    setShowForm(false)
  }

  const stats = {
    totalPackages: packages.length,
    delivered: packages.filter(p => p.status === 'delivered').length,
    inTransit: packages.filter(p => p.status === 'in_transit' || p.status === 'out_for_delivery').length
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Simple Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage shipments and notifications</p>
        </div>

        {/* Clean Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Packages</p>
                <p className="text-2xl font-semibold text-white">{stats.totalPackages}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FiBox className="text-blue-500 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Delivered</p>
                <p className="text-2xl font-semibold text-white">{stats.delivered}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-green-500 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">In Transit</p>
                <p className="text-2xl font-semibold text-white">{stats.inTransit}</p>
              </div>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <FiTruck className="text-orange-500 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Simple Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === 'packages' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-[#111]'
              }`}
            >
              Packages
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === 'email' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-[#111]'
              }`}
            >
              Email
            </button>
          </div>
          
          {activeTab === 'packages' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              {showForm ? <FiX /> : <FiPlus />}
              {showForm ? 'Cancel' : 'Add Package'}
            </button>
          )}
        </div>

        {activeTab === 'packages' && (
          <>
            {showForm && (
              <div className="bg-[#111] border border-gray-800 rounded-lg p-6 mb-4">
                <h2 className="text-lg font-semibold text-white mb-4">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h2>
                <PackageForm 
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  editingPackage={editingPackage}
                />
              </div>
            )}

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-3">
              {packages.map((pkg) => {
                const status = statusConfig[pkg.status] || statusConfig.pending
                const StatusIcon = status.icon
                return (
                  <div key={pkg.id} className="bg-[#111] border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Tracking</p>
                        <p className="text-white font-mono text-sm font-medium">{pkg.tracking_number}</p>
                      </div>
                      <span className={`${status.bg} ${status.color} px-2 py-1 rounded text-xs font-medium flex items-center gap-1`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Sender</p>
                        <p className="text-gray-300">{pkg.sender_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Receiver</p>
                        <p className="text-gray-300">{pkg.receiver_name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-800">
                      <button onClick={() => handleEdit(pkg)} className="flex-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 py-2 rounded text-sm transition flex items-center justify-center gap-1">
                        <FiEdit2 size={14} />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(pkg.id)} className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded text-sm transition flex items-center justify-center gap-1">
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                      <button onClick={() => setPrintPackage(pkg)} className="flex-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 py-2 rounded text-sm transition flex items-center justify-center gap-1">
                        <FiPrinter size={14} />
                        Print
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tracking</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Sender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Receiver</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => {
                    const status = statusConfig[pkg.status] || statusConfig.pending
                    const StatusIcon = status.icon
                    return (
                      <tr key={pkg.id} className="border-b border-gray-800 hover:bg-[#0a0a0a] transition">
                        <td className="px-4 py-3 text-white font-mono text-sm">{pkg.tracking_number}</td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{pkg.sender_name}</td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{pkg.receiver_name}</td>
                        <td className="px-4 py-3">
                          <span className={`${status.bg} ${status.color} px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(pkg)} className="text-blue-400 hover:text-blue-300 transition p-1">
                              <FiEdit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(pkg.id)} className="text-red-400 hover:text-red-300 transition p-1">
                              <FiTrash2 size={16} />
                            </button>
                            <button onClick={() => setPrintPackage(pkg)} className="text-green-400 hover:text-green-300 transition p-1">
                              <FiPrinter size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'email' && (
          <EmailNotification />
        )}
      </div>

      {printPackage && (
        <div style={{ display: 'none' }}>
          <div ref={receiptRef}>
            <Receipt packageData={printPackage} />
          </div>
        </div>
      )}
    </div>
  )
}
