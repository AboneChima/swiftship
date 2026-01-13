export default function Receipt({ packageData }) {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }

  const totalCost = (parseFloat(packageData.shipping_cost) || 0) + (parseFloat(packageData.clearance_cost) || 0)

  return (
    <div style={{
      width: '210mm',
      height: '297mm',
      padding: '15mm',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      boxSizing: 'border-box',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact',
      fontSize: '14px'
    }}>
      {/* Red Border */}
      <div style={{
        position: 'absolute',
        top: '8mm',
        left: '8mm',
        right: '8mm',
        bottom: '8mm',
        border: '4px solid #dc2626',
        pointerEvents: 'none',
        borderRadius: '4px'
      }}></div>

      {/* Certified True Copy Text Watermark */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '20%',
        transform: 'rotate(-45deg)',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0.15,
        fontSize: '48px',
        fontWeight: '600',
        color: '#374151',
        whiteSpace: 'nowrap',
        letterSpacing: '4px',
        fontFamily: 'Arial, sans-serif',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}>
        Certified True Copy
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header with Logo and Tracking */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              <span style={{ transform: 'rotate(-10deg)' }}>✈</span>
            </div>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#1e40af',
                margin: '0 0 4px 0',
                letterSpacing: '1px'
              }}>SWIFTSHIP EXPRESS</h1>
              <div style={{ 
                fontSize: '11px', 
                color: '#6b7280',
                fontWeight: '600',
                letterSpacing: '1px'
              }}>GLOBAL LOGISTICS SOLUTIONS</div>
            </div>
          </div>
          <div style={{ 
            width: '140px',
            height: '90px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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

        {/* Tracking Number */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Tracking Number: </span>
          <span style={{ 
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#dc2626',
            fontFamily: 'monospace',
            letterSpacing: '1px'
          }}>{packageData.tracking_number}</span>
        </div>

        {/* Company Info Box */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            color: '#1e40af'
          }}>SwiftShip Express</h2>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
            <strong>Address:</strong> 87 George Street DURHAM DH6 6YK | <strong>Email:</strong> info@swiftshipexpress.com | <strong>Website:</strong> www.swiftshipexpress.com
          </div>
        </div>

        {/* Three Column Layout: Sender, Receiver, Barcode */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {/* Sender */}
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #fbbf24',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#000',
              textTransform: 'uppercase'
            }}>FROM (SENDER)</h3>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
              {packageData.sender_name}
            </div>
            <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.7' }}>
              <div><strong>Address:</strong> {packageData.sender_location}</div>
              <div><strong>Origin:</strong> SwiftShip Express</div>
            </div>
          </div>

          {/* Receiver */}
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#000',
              textTransform: 'uppercase'
            }}>TO (CONSIGNEE)</h3>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
              {packageData.receiver_name}
            </div>
            <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.7' }}>
              <div><strong>Phone:</strong> {packageData.receiver_phone || '+1234567890'}</div>
              <div><strong>Address:</strong> {packageData.receiver_location}</div>
            </div>
          </div>

          {/* Barcode and Order Info */}
          <div>
            <div style={{
              border: '2px solid #000',
              padding: '12px',
              textAlign: 'center',
              marginBottom: '12px',
              backgroundColor: '#fff',
              borderRadius: '6px'
            }}>
              <img 
                src="/new barcode.png" 
                alt="Barcode" 
                style={{ 
                  width: '100%',
                  height: '80px',
                  objectFit: 'contain',
                  marginBottom: '8px'
                }} 
              />
              <div style={{ 
                fontSize: '11px', 
                fontFamily: 'monospace', 
                fontWeight: 'bold',
                color: '#000'
              }}>
                {packageData.tracking_number}
              </div>
            </div>
            <div style={{ 
              fontSize: '12px', 
              lineHeight: '1.9',
              backgroundColor: '#f9fafb',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db'
            }}>
              <div><strong>Order ID:</strong> {packageData.id || '2'}</div>
              <div><strong>Payment Due:</strong> {formatDate(packageData.delivery_date)}</div>
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
          fontSize: '13px'
        }}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: '#fff',
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
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: '600' }}>$ {parseFloat(packageData.shipping_cost || 0).toFixed(2)}</td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: '600' }}>$ {parseFloat(packageData.clearance_cost || 0).toFixed(2)}</td>
              <td style={{ padding: '12px', border: '1px solid #d1d5db', fontWeight: 'bold', fontSize: '15px' }}>$ {totalCost.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Official Stamp and Payment Methods */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
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
                fontSize: '13px',
                color: '#000',
                fontWeight: 'bold'
              }}>
                SAFE SHOPPING
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
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
              width: '140px',
              height: '140px',
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
              color: '#6b7280',
              marginTop: '8px'
            }}>
              Stamp Duty:
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
