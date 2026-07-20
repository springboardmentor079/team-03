import { useState } from 'react';

const StockMonitoring = () => {
  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, name: 'Portland Cement (Grade 53)', stock: 12, minLimit: 100, unit: 'Bags', category: 'Cement' },
    { id: 2, name: 'Deformed Steel Rebars (16mm)', stock: 0.8, minLimit: 3.0, unit: 'Tons', category: 'Steel' },
    { id: 3, name: 'Copper Wiring Coil (12 AWG)', stock: 2, minLimit: 10, unit: 'Coils', category: 'Electrical' },
    { id: 4, name: 'Premium Plywood Sheets (4x8)', stock: 8, minLimit: 25, unit: 'Sheets', category: 'Wood' },
    { id: 5, name: 'Electrical Conduit Pipe (2")', stock: 15, minLimit: 50, unit: 'Pipes', category: 'Electrical' }
  ]);

  // Track which item IDs have active reorder success confirmations
  const [reorderedIds, setReorderedIds] = useState([]);

  const handleQuickReorder = (id) => {
    setReorderedIds(prev => [...prev, id]);
    setTimeout(() => {
      // Defer removal of reordered item from low stock list to simulate restock!
      setLowStockItems(prevItems => prevItems.filter(item => item.id !== id));
      setReorderedIds(prev => prev.filter(x => x !== id));
    }, 2000);
  };

  const metrics = [
    { label: 'Total Tracked Material Lines', value: '42', desc: 'Registered in warehouse' },
    { label: 'Items Low on Stock', value: lowStockItems.length, desc: 'Below critical threshold levels' },
    { label: 'Pending Restocks', value: '3', desc: 'Active shipping routes' }
  ];

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Panel */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Critical Inventory Alerts</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Review critical thresholds, reorder supply pipelines, and manage shipping variances.</p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {metrics.map((metric, i) => (
          <div key={i} style={{
            backgroundColor: '#2a2a35',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #3a3a45',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{metric.label}</span>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '12px 0 6px 0',
              color: metric.label === 'Items Low on Stock' && metric.value > 0 ? '#ffb300' : '#00d053'
            }}>
              {metric.value}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>{metric.desc}</span>
          </div>
        ))}
      </div>

      {/* Main Section low stock cards */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '28px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Low Stock Alert List</h3>
        
        {lowStockItems.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {lowStockItems.map(item => {
              const isReordered = reorderedIds.includes(item.id);
              
              return (
                <div key={item.id} style={{
                  backgroundColor: '#1e1e24',
                  borderRadius: '8px',
                  border: '1px solid #3a3a45',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        backgroundColor: 'rgba(255,179,0,0.1)',
                        color: '#ffb300',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>{item.category}</span>
                      
                      <span style={{ fontSize: '12px', color: '#ff4d4d', fontWeight: 'bold' }}>⚠️ Low Stock</span>
                    </div>
                    
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold' }}>{item.name}</h4>
                    
                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px', marginTop: '12px' }}>
                      <div>
                        <div style={{ color: '#a0a0a0', fontSize: '11px', textTransform: 'uppercase' }}>Current Qty</div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#ffb300', marginTop: '2px' }}>
                          {item.stock} {item.unit}
                        </div>
                      </div>
                      <div style={{ width: '1px', backgroundColor: '#3a3a45' }} />
                      <div>
                        <div style={{ color: '#a0a0a0', fontSize: '11px', textTransform: 'uppercase' }}>Min Threshold</div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#ffffff', marginTop: '2px' }}>
                          {item.minLimit} {item.unit}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isReordered}
                    onClick={() => handleQuickReorder(item.id)}
                    style={{
                      backgroundColor: isReordered ? 'rgba(0, 208, 83, 0.1)' : '#00d053',
                      color: isReordered ? '#00d053' : '#1e1e24',
                      border: isReordered ? '1px solid #00d053' : 'none',
                      padding: '10px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: isReordered ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    {isReordered ? 'Order Placed! ✓' : 'Quick Reorder'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#a0a0a0' }}>
            🎉 All warehouse material stocks are currently above minimum threshold logs.
          </div>
        )}
      </div>
    </div>
  );
};

export default StockMonitoring;
