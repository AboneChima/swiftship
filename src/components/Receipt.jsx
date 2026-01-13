export default function Receipt({ packageData }) {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
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
      padding: '12mm',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      boxSizing: 'border-box',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact',
      fontSize: '15px'
    }}>
      {/* Red Border */}
      <div style={{
        position: 'absolute',
        top: '8mm',
        left: '8mm',
        right: '8mm',
        bottom: '8mm',
        border: '3px solid #dc2626',
        pointerEvents: 'none'
      }}></div>

      {/* Certified True Copy Text Watermark */}
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
        {/* Header with Logo */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '10px',
          borderBottom: '3px solid #1e40af',
          paddingBottom: '8px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold',
              color: '#1e40af',
              margin: '0 0 5px 0',
              letterSpacing: '2px'
            }}>SWIFTSHIP EXPRESS</h1>
            <div style={{ 
              fontSize: '13px', 
              color: '#6b7280',
              fontWeight: '600'
            }}>GLOBAL LOGISTICS SOLUTIONS</div>
          </div>
          <div style={{ 
            width: '120px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/top-right-image.png" 
              alt="Logo" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>

        {/* Tracking Number - Large & Compact */}
        <div style={{ 
          textAlign: 'center',
          backgroundColor: '#dbeafe',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '10px',
          border: '3px solid #3b82f6'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px', fontWeight: 'bold' }}>
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

        {/* Product & Dates - Compact */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '10px'
        }}>
          <div style={{ 
            backgroundColor: '#f0fdf4',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '6px' }}>
              PRODUCT
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', marginBottom: '4px' }}>
              {packageData.product_name || 'Package'}
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>
              Weight: {packageData.weight} kg
            </div>
          </div>
          <div style={{ 
            backgroundColor: '#fef3c7',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #eab308'
          }}>
            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '6px' }}>
              DATES
            </div>
            <div style={{ fontSize: '15px', lineHeight: '1.5' }}>
              <div><strong>Collection:</strong> {formatDate(packageData.collection_date)}</div>
              <div><strong>Delivery:</strong> {formatDate(packageData.delivery_date)}</div>
              <div><strong>Arrival:</strong> {formatDate(packageData.arrival_date)}</div>
            </div>
          </div>
        </div>

        {/* Sender & Receiver - Compact but Large Text */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '10px'
        }}>
          {/* Sender */}
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #fbbf24'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '6px',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>FROM (SENDER)</h3>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px', color: '#000' }}>
              {packageData.sender_name}
            </div>
            <div style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.5' }}>
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
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #3b82f6'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '6px',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>TO (CONSIGNEE)</h3>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px', color: '#000' }}>
              {packageData.receiver_name}
            </div>
            <div style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.5' }}>
              <div><strong>Phone:</strong> {packageData.receiver_phone || 'N/A'}</div>
              <div><strong>Email:</strong> {packageData.receiver_email || 'N/A'}</div>
              <div><strong>Country:</strong> {packageData.receiver_country || 'N/A'}</div>
              <div><strong>Address:</strong> {packageData.receiver_location}</div>
            </div>
          </div>
        </div>

        {/* Costs Table - Large & Compact */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginBottom: '10px',
          fontSize: '16px'
        }}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: '#fff'
            }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '2px solid #2563eb', fontSize: '17px' }}>Description</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '2px solid #2563eb', fontSize: '17px' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'right', border: '2px solid #2563eb', fontSize: '17px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '10px', border: '2px solid #d1d5db', fontSize: '17px' }}>Shipping Cost</td>
              <td style={{ padding: '10px', border: '2px solid #d1d5db' }}>
                <span style={{ 
                  border: '2px solid #000', 
                  padding: '4px 10px',
                  display: 'inline-block',
                  fontWeight: 'bold',
                  fontSize: '15px'
                }}>{packageData.status?.toUpperCase()}</span>
              </td>
              <td style={{ padding: '10px', border: '2px solid #d1d5db', textAlign: 'right', fontWeight: 'bold', fontSize: '20px' }}>
                $ {parseFloat(packageData.shipping_cost || 0).toFixed(2)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#fff' }}>
              <td style={{ padding: '10px', border: '2px solid #d1d5db', fontSize: '17px' }}>Clearance Cost</td>
              <td style={{ padding: '10px', border: '2px solid #d1d5db' }}></td>
              <td style={{ padding: '10px', border: '2px solid #d1d5db', textAlign: 'right', fontWeight: 'bold', fontSize: '20px' }}>
                $ {parseFloat(packageData.clearance_cost || 0).toFixed(2)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#dbeafe' }}>
              <td style={{ padding: '10px', border: '2px solid #d1d5db', fontSize: '19px', fontWeight: 'bold' }}>TOTAL</td>
              <td style={{ padding: '10px', border: '2px solid #d1d5db' }}></td>
              <td style={{ padding: '10px', border: '2px solid #d1d5db', textAlign: 'right', fontWeight: 'bold', fontSize: '24px', color: '#1e40af' }}>
                $ {totalCost.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer - Compact */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '8px',
          borderTop: '2px solid #e5e7eb'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>Payment Methods:</h3>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <div style={{ padding: '5px 8px', backgroundColor: '#1a1f71', color: '#fff', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>VISA</div>
              <div style={{ padding: '5px 8px', background: 'linear-gradient(90deg, #eb001b 0%, #f79e1b 100%)', color: '#fff', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Mastercard</div>
              <div style={{ padding: '5px 8px', backgroundColor: '#003087', color: '#fff', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>PayPal</div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              marginBottom: '6px',
              color: '#000'
            }}>
              Official Stamp/{formattedDate}
            </div>
            <div style={{
              width: '100px',
              height: '100px',
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
          </div>
        </div>

        {/* Company Footer - Compact */}
        <div style={{ 
          textAlign: 'center',
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#6b7280'
        }}>
          <strong>SwiftShip Express</strong> | 87 George Street DURHAM DH6 6YK<br/>
          info@swiftshipexpress.com | www.swiftshipexpress.live
        </div>
      </div>
    </div>
  )
}
