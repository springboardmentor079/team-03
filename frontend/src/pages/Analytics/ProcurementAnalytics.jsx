import { useState } from 'react';

const ProcurementAnalytics = () => {
  const [timeframe, setTimeframe] = useState('Monthly');

  const spendingData = {
    Monthly: {
      totalSpent: '$342,000',
      categories: [
        { name: 'Reinforced Steel Rebars', cost: 145000, pct: 42, count: '12 Orders' },
        { name: 'Portland Cement (Grade 53)', cost: 95000, pct: 28, count: '24 Orders' },
        { name: 'Timber & Structural Plywood', cost: 62000, pct: 18, count: '8 Orders' },
        { name: 'Electrical Cables & Pipes', cost: 40000, pct: 12, count: '15 Orders' }
      ]
    },
    Quarterly: {
      totalSpent: '$1,026,000',
      categories: [
        { name: 'Reinforced Steel Rebars', cost: 435000, pct: 42, count: '36 Orders' },
        { name: 'Portland Cement (Grade 53)', cost: 285000, pct: 28, count: '72 Orders' },
        { name: 'Timber & Structural Plywood', cost: 186000, pct: 18, count: '24 Orders' },
        { name: 'Electrical Cables & Pipes', cost: 120000, pct: 12, count: '45 Orders' }
      ]
    }
  };

  const current = spendingData[timeframe] || spendingData.Monthly;

  const colorPalettes = ['#00d053', '#00a340', '#00752e', '#00471c'];

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Banner Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Procurement & Spent Analytics</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Review material spending categories, order volume ratios, and vendor cost schedules.</p>
        </div>
        <div>
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#2a2a35',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #3a3a45'
          }}>
            <button
              onClick={() => setTimeframe('Monthly')}
              style={{
                backgroundColor: timeframe === 'Monthly' ? '#00d053' : 'transparent',
                color: timeframe === 'Monthly' ? '#1e1e24' : '#a0a0a0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('Quarterly')}
              style={{
                backgroundColor: timeframe === 'Quarterly' ? '#00d053' : 'transparent',
                color: timeframe === 'Quarterly' ? '#1e1e24' : '#a0a0a0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>

      {/* Stacked Horizontal Bar Representation */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Procurement Spent Volume</h3>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#00d053' }}>{current.totalSpent}</span>
        </div>

        {/* Stacked bar fill */}
        <div style={{
          width: '100%',
          height: '24px',
          backgroundColor: '#1e1e24',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '20px'
        }}>
          {current.categories.map((cat, i) => (
            <div
              key={i}
              title={`${cat.name}: ${cat.pct}%`}
              style={{
                width: `${cat.pct}%`,
                height: '100%',
                backgroundColor: colorPalettes[i % colorPalettes.length],
                transition: 'width 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Legends Row */}
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          fontSize: '13px'
        }}>
          {current.categories.map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                backgroundColor: colorPalettes[i % colorPalettes.length]
              }} />
              <span style={{ color: '#a0a0a0' }}>{cat.name} ({cat.pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger Table Section */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '28px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Expenses Ledger Breakdown</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Material Category</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Order Volume</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Total Capital Spent</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Spent Ratio</th>
              </tr>
            </thead>
            <tbody>
              {current.categories.map((cat, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{cat.name}</td>
                  <td style={{ padding: '16px', color: '#a0a0a0' }}>{cat.count}</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#00d053' }}>
                    ${cat.cost.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#a0a0a0' }}>
                    {cat.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcurementAnalytics;
