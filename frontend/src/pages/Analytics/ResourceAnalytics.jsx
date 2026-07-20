import { useState } from 'react';

const ResourceAnalytics = () => {
  const [timeframe, setTimeframe] = useState('Monthly');

  const resourceData = {
    Monthly: {
      manHours: '14,820 hrs',
      uptime: '94.2%',
      plannedVsActual: '98% Alignment',
      topResources: [
        { name: 'Excavators & Rigs', utilization: 88, category: 'Heavy Equipment' },
        { name: 'Site Electricians', utilization: 82, category: 'Skilled Trade' },
        { name: 'Timber Carpentry Crew', utilization: 75, category: 'Skilled Trade' }
      ]
    },
    Weekly: {
      manHours: '3,450 hrs',
      uptime: '96.5%',
      plannedVsActual: '101% Alignment',
      topResources: [
        { name: 'Excavators & Rigs', utilization: 92, category: 'Heavy Equipment' },
        { name: 'Site Electricians', utilization: 85, category: 'Skilled Trade' },
        { name: 'Concrete Mixing Units', utilization: 79, category: 'Heavy Equipment' }
      ]
    }
  };

  const current = resourceData[timeframe] || resourceData.Monthly;

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
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Resource Utilization Analytics</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Monitor trade performance ratios, equipment uptime levels, and hour alignment schedules.</p>
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
              onClick={() => setTimeframe('Weekly')}
              style={{
                backgroundColor: timeframe === 'Weekly' ? '#00d053' : 'transparent',
                color: timeframe === 'Weekly' ? '#1e1e24' : '#a0a0a0',
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
              Weekly
            </button>
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
          </div>
        </div>
      </div>

      {/* Split layout grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Side Metrics Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            backgroundColor: '#2a2a35',
            padding: '28px',
            borderRadius: '12px',
            border: '1px solid #3a3a45',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Man-Hours Logged</span>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0 6px 0', color: '#00d053' }}>
              {current.manHours}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>Cumulative crew logs</span>
          </div>

          <div style={{
            backgroundColor: '#2a2a35',
            padding: '28px',
            borderRadius: '12px',
            border: '1px solid #3a3a45',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Equipment Uptime Rate</span>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0 6px 0', color: '#ffffff' }}>
              {current.uptime}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>Target uptime is 95.0%</span>
          </div>

          <div style={{
            backgroundColor: '#2a2a35',
            padding: '28px',
            borderRadius: '12px',
            border: '1px solid #3a3a45',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Planned vs. Actual Hours</span>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0 6px 0', color: '#00d053' }}>
              {current.plannedVsActual}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>Schedule alignment precision</span>
          </div>
        </div>

        {/* Right Side: Top Utilized Resources list */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Top Utilized Assets</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {current.topResources.map((res, i) => (
              <div key={i} style={{
                backgroundColor: '#1e1e24',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #3a3a45'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '15px' }}>{res.name}</span>
                    <span style={{ color: '#a0a0a0', fontSize: '12px' }}>Type: {res.category}</span>
                  </div>
                  <span style={{ color: '#00d053', fontWeight: 'bold', fontSize: '15px' }}>{res.utilization}% Load</span>
                </div>
                {/* Progress fill */}
                <div style={{ width: '100%', height: '8px', backgroundColor: '#2a2a35', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${res.utilization}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAnalytics;
