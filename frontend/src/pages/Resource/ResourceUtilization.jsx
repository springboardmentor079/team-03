import { useState } from 'react';

const ResourceUtilization = () => {
  // Interactive utilization coefficients
  const [machineryUtil, setMachineryUtil] = useState(65);
  const [carpentryUtil, setCarpentryUtil] = useState(82);
  const [electricalUtil, setElectricalUtil] = useState(48);
  const [plumbingUtil, setPlumbingUtil] = useState(70);

  const totalUtilization = Math.round((machineryUtil + carpentryUtil + electricalUtil + plumbingUtil) / 4);

  const metrics = [
    { label: 'Total Tracked Assets', value: '184', desc: 'Across all active sectors' },
    { label: 'Overall Utilization Rate', value: `${totalUtilization}%`, desc: 'Average capacity deployment' },
    { label: 'Active Crew Shifts', value: '12 / Daily', desc: 'Running 24-hour logs' }
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Resource Capacity Utilization</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Analyze department-level deployment rates, load forecasts, and average operational runtimes.</p>
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
              color: '#00d053'
            }}>
              {metric.value}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>{metric.desc}</span>
          </div>
        ))}
      </div>

      {/* Grid containing sliders and progress bars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Sliders adjustments */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Simulate Utilization Thresholds</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span>Heavy Machinery Utilization</span>
                <span style={{ color: '#00d053', fontWeight: 'bold' }}>{machineryUtil}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={machineryUtil}
                onChange={(e) => setMachineryUtil(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00d053', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span>Carpentry & Timber Deployment</span>
                <span style={{ color: '#00d053', fontWeight: 'bold' }}>{carpentryUtil}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={carpentryUtil}
                onChange={(e) => setCarpentryUtil(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00d053', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span>MEP & Electrical Staffing</span>
                <span style={{ color: '#00d053', fontWeight: 'bold' }}>{electricalUtil}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={electricalUtil}
                onChange={(e) => setElectricalUtil(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00d053', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span>Plumbing & Piping Allocation</span>
                <span style={{ color: '#00d053', fontWeight: 'bold' }}>{plumbingUtil}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={plumbingUtil}
                onChange={(e) => setPlumbingUtil(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00d053', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Graphical Fills rendering */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Departmental Load Utilization</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Machinery bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a0a0a0', marginBottom: '6px' }}>
                <span>Heavy Machinery & Rigging</span>
                <span>{machineryUtil}% Load</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#1e1e24', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${machineryUtil}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '5px', transition: 'width 0.2s' }} />
              </div>
            </div>

            {/* Carpentry bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a0a0a0', marginBottom: '6px' }}>
                <span>Carpentry & Timber Framing</span>
                <span>{carpentryUtil}% Load</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#1e1e24', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${carpentryUtil}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '5px', transition: 'width 0.2s' }} />
              </div>
            </div>

            {/* Electrical bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a0a0a0', marginBottom: '6px' }}>
                <span>MEP & Electrical Routing</span>
                <span>{electricalUtil}% Load</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#1e1e24', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${electricalUtil}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '5px', transition: 'width 0.2s' }} />
              </div>
            </div>

            {/* Plumbing bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a0a0a0', marginBottom: '6px' }}>
                <span>Plumbing & HVAC Ducting</span>
                <span>{plumbingUtil}% Load</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#1e1e24', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${plumbingUtil}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '5px', transition: 'width 0.2s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUtilization;
