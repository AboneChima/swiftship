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
      month: 'short', 
      day: 'numeric' 
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
      fontSize: '16px'
    }}>
      {/* Red Border */}
      <div style={{
        position: 'absolute',
        top: '10mm',
        left: '10mm',
        right: '10mm',
        bottom: '10mm',
        border: '4px solid #dc2626',
        pointerEvents: 'none'
      }}></div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: '4px solid #1e40af',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold',
              color: '#1e40af',
              margin: '0 0 8px 0',
              letterSpacing: '2px'
            }}>SWIFTSHIP EXPRESS</h1>
            <div style={{ 
              fontSize: '16px', 
              color: '#6b7280',
              fontWeight: '600'
            }}>GLOBAL LOGISTICS SOLUTIONS</div>
          </div>
        </div>

        {/* Tracking Number - Large */}
        <div style={{ 
          textAlign: 'center',
          backgroundColor: '#dbeafe',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
          border: '3px solid #3b82f6'
        }}>
          <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px', fontWeight: 'bold' }}>
            TRACKING NUMBER
          </div>
          <div style={{ 
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1e40af',
            fontFamily: 'monospace',
            letterSpacing: '3px'
          }}>
            {packageData.tracking_number}
          </div>
        </div>

        {/* Product & Dates */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{ 
            backgroundColor: '#f0fdf4',
            padding: '18px',
            borderRadius: '10px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px' }}>
              PRODUCT
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>
              {packageData.product_name || 'Package'}
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280', marginTop: '5px' }}>
              Weight: {packageData.weight} kg
            </div>
          </div>
          <div style={{ 
            backgroundColor: '#fef3c7',
            padding: '18px',
            borderRadius: '10px',
            border: '2px solid #eab308'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px' }}>
              DATES
            </div>
            <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
              <div><strong>Collection:</strong> {formatDate(packageData.collection_date)} {packageData.collection_time || ''}</div>
              <div><strong>Delivery:</strong> {formatDate(packageData.delivery_date)}</div>
              <div><strong>Arrival:</strong> {formatDate(packageData.arrival_date)}</div>
            </div>
          </div>
        </div>

        {/* Sender & Receiver - Larger Text */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '25px'
        }}>
          {/* Sender */}
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '20px',
            borderRadius: '12px',
            border: '3px solid #fbbf24'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              marginBottom: '12px',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>FROM (SENDER)</h3>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>
              {packageData.sender_name}
            </div>
            <div style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.8' }}>
              <div><strong>Phone:</strong> {packageData.sender_phone || 'N/A'}</div>
              <div><strong>Email:</strong> {packageData.sender_email || 'N/A'}</div>
              <div><strong>ID:</strong> {packageData.sender_id || 'N/A'}</div>
              <div><strong>Country:</strong> {packageData.sender_country || 'N/A'}</div>
              <div><strong>Address:</strong> {packageData.sender_location}</div>
            </div>
          </div>

          {/* Receiver */}
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '20px',
            borderRadius: '12px',
            border: '3px solid #3b82f6'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              marginBottom: '12px',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>TO (CONSIGNEE)</h3>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>
              {packageData.receiver_name}
            </div>
            <div style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.8' }}>
              <div><strong>Phone:</strong> {packageData.receiver_phone || 'N/A'}</div>
              <div><strong>Email:</strong> {packageData.receiver_email || 'N/A'}</div>
              <div><strong>Country:</strong> {packageData.receiver_country || 'N/A'}</div>
              <div><strong>Address:</strong> {packageData.receiver_location}</div>
            </div>
          </div>
        </div>

        {/* Costs Table - Larger Text */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginBottom: '25px',
          fontSize: '16px'
        }}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: '#fff'
            }}>
              <th style={{ padding: '15px', textAlign: 'left', border: '2px solid #2563eb', fontSize: '17px' }}>Description</th>
              <th style={{ padding: '15px', textAlign: 'left', border: '2px solid #2563eb', fontSize: '17px' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'right', border: '2px solid #2563eb', fontSize: '17px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '15px', border: '2px solid #d1d5db', fontSize: '16px' }}>Shipping Cost</td>
              <td style={{ padding: '15px', border: '2px solid #d1d5db' }}>
                <span style={{ 
                  border: '2px solid #000', 
                  padding: '6px 12px',
                  display: 'inline-block',
                  fontWeight: 'bold',
                  fontSize: '15px'
                }}>{packageData.status?.toUpperCase()}</span>
              </td>
              <td style={{ padding: '15px', border: '2px solid #d1d5db', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                $ {parseFloat(packageData.shipping_cost || 0).toFixed(2)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#fff' }}>
              <td style={{ padding: '15px', border: '2px solid #d1d5db', fontSize: '16px' }}>Clearance Cost</td>
              <td style={{ padding: '15px', border: '2px solid #d1d5db' }}></td>
              <td style={{ padding: '15px', border: '2px solid #d1d5db', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                $ {parseFloat(packageData.clearance_cost || 0).toFixed(2)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#dbeafe' }}>
              <td style={{ padding: '15px', border: '2px solid #d1d5db', fontSize: '18px', fontWeight: 'bold' }}>TOTAL</td>
              <td style={{ padding: '15px', border: '2px solid #d1d5db' }}></td>
              <td style={{ padding: '15px', border: '2px solid #d1d5db', textAlign: 'right', fontWeight: 'bold', fontSize: '22px', color: '#1e40af' }}>
                $ {totalCost.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '3px solid #e5e7eb'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '12px' }}>Payment Methods:</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 14px', backgroundColor: '#1a1f71', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>VISA</div>
              <div style={{ padding: '8px 14px', background: 'linear-gradient(90deg, #eb001b 0%, #f79e1b 100%)', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>Mastercard</div>
              <div style={{ padding: '8px 14px', backgroundColor: '#003087', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>PayPal</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}>
              Official Stamp
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Company Footer */}
        <div style={{ 
          textAlign: 'center',
          marginTop: '25px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>SwiftShip Express</strong> | 87 George Street DURHAM DH6 6YK<br/>
          info@swiftshipexpress.com | www.swiftshipexpress.com
        </div>
      </div>
    </div>
  )
}
