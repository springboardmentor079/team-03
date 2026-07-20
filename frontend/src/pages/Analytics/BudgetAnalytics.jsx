import { useState } from 'react';

const BudgetAnalytics = () => {
  const [quarter, setQuarter] = useState('All');

  // Quarterly financial datasets
  const dataMap = {
    All: { total: '$4,200,000', spent: '$2,850,000', remaining: '$1,350,000', spentPct: 68, monthly: [450, 380, 520, 410, 490, 600] },
    Q1: { total: '$1,200,000', spent: '$950,000', remaining: '$250,000', spentPct: 79, monthly: [320, 280, 350, 0, 0, 0] },
    Q2: { total: '$1,500,000', spent: '$1,100,000', remaining: '$400,000', spentPct: 73, monthly: [0, 0, 0, 360, 340, 400] },
    Q3: { total: '$1,500,000', spent: '$800,000', remaining: '$700,000', spentPct: 53, monthly: [0, 0, 0, 0, 0, 0] }
  };

  const currentData = dataMap[quarter] || dataMap.All;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Budget & Capital Analytics</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Review financial allocations, quarterly spent variances, and monthly cost schedules.</p>
        </div>
        <div>
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            style={{
              backgroundColor: '#2a2a35',
              border: '1px solid #3a3a45',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            <option value="All">Full Fiscal Year</option>
            <option value="Q1">Q1 Allocation</option>
            <option value="Q2">Q2 Allocation</option>
            <option value="Q3">Q3 Allocation</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#2a2a35',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Allocated Budget</span>
          <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '12px 0 6px 0', color: '#ffffff' }}>
            {currentData.total}
          </div>
          <span style={{ color: '#a0a0a0', fontSize: '13px' }}>Current quarter baseline</span>
        </div>

        <div style={{
          backgroundColor: '#2a2a35',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Capital Spent</span>
          <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '12px 0 6px 0', color: '#ff4d4d' }}>
            {currentData.spent}
          </div>
          <span style={{ color: '#a0a0a0', fontSize: '13px' }}>{currentData.spentPct}% of total allocation</span>
        </div>

        <div style={{
          backgroundColor: '#2a2a35',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining Balance</span>
          <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '12px 0 6px 0', color: '#00d053' }}>
            {currentData.remaining}
          </div>
          <span style={{ color: '#a0a0a0', fontSize: '13px' }}>Unspent capital resources</span>
        </div>
      </div>

      {/* Monthly spending bar chart mockup */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '28px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>Monthly Capital Spent Breakdown</h3>
        <p style={{ color: '#a0a0a0', fontSize: '13px', margin: '0 0 32px 0' }}>Values represented in Thousands of USD ($k)</p>
        
        {/* Chart plot container */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          height: '240px',
          borderBottom: '2px solid #3a3a45',
          paddingBottom: '16px',
          gap: '24px'
        }}>
          {currentData.monthly.map((val, idx) => {
            // max val is 600 for height percentage calculation
            const pct = Math.round((val / 600) * 100);
            
            return (
              <div key={idx} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'end'
              }}>
                {val > 0 && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#00d053',
                    marginBottom: '8px'
                  }}>${val}k</span>
                )}
                
                <div style={{
                  width: '100%',
                  maxWidth: '64px',
                  height: val > 0 ? `${pct}%` : '4px',
                  backgroundColor: val > 0 ? '#00d053' : '#3a3a45',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }} />
                
                <span style={{
                  marginTop: '12px',
                  fontSize: '13px',
                  color: '#a0a0a0'
                }}>{months[idx]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalytics;
