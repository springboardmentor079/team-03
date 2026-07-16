import { useState } from 'react';

const ProjectStatus = () => {
  // Summary Vitals States
  const [health] = useState('Stable');
  const [variance] = useState('+1.8%');
  const [completedPhases] = useState(2);

  // Risk Register State
  const [risks, setRisks] = useState([
    { id: 1, risk: 'Subcontractor masonry labor shortage', impact: 'Medium', status: 'Active', mitigation: 'Partner with local vocational agency for direct hiring pool.' },
    { id: 2, risk: 'Monsoon delays for Zone C excavation', impact: 'High', status: 'Active', mitigation: 'Expedite drainage channel piping and run backup shifts.' },
    { id: 3, risk: 'HVAC steel alloy delivery lag times', impact: 'Low', status: 'Active', mitigation: 'Procure generic specifications standard ducts as placeholder alternative.' },
    { id: 4, risk: 'MEP regulatory permit delay', impact: 'High', status: 'Resolved', mitigation: 'Obtained approval stamps on level 3 layouts after city appeal hearings.' }
  ]);

  const handleMitigateRisk = (id) => {
    setRisks(risks.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  const metrics = [
    { label: 'Overall Project Health', value: health, desc: 'Quality audits passed' },
    { label: 'Identified Active Risks', value: risks.filter(r => r.status === 'Active').length, desc: 'Vitals require mitigation' },
    { label: 'Schedule Variance', value: variance, desc: 'Ahead of target projections' },
    { label: 'Completed Deliverables', value: `${completedPhases}/5`, desc: 'Phases checked off' }
  ];

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Header Row */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Project Executive Status</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Executive summary tracker for site compliance vitals, timelines, and active risk mitigation.</p>
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
              color: metric.label === 'Identified Active Risks' && metric.value > 0 ? '#ffb300' : '#00d053'
            }}>
              {metric.value}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>{metric.desc}</span>
          </div>
        ))}
      </div>

      {/* Split Columns Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Risk Register Table */}
        <div style={{
          backgroundColor: '#2a2a35',
          padding: '28px',
          borderRadius: '12px',
          border: '1px solid #3a3a45'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Active Risk Register Ledger</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Risk Description</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Impact</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Mitigation Plan</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {risks.map(risk => (
                  <tr key={risk.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{risk.risk}</td>
                    <td style={{ padding: '16px', color: risk.impact === 'High' ? '#ff4d4d' : '#ffb300' }}>{risk.impact}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: risk.status === 'Active' ? 'rgba(255, 179, 0, 0.1)' : 'rgba(0, 208, 83, 0.1)',
                        color: risk.status === 'Active' ? '#ffb300' : '#00d053'
                      }}>
                        {risk.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#a0a0a0', fontSize: '13px', maxWidth: '280px' }}>{risk.mitigation}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {risk.status === 'Active' && (
                        <button
                          onClick={() => handleMitigateRisk(risk.id)}
                          style={{
                            backgroundColor: '#00d053',
                            color: '#1e1e24',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer',
                            outline: 'none',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Mitigate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Burn-down Chart Panel */}
        <div style={{
          backgroundColor: '#2a2a35',
          padding: '28px',
          borderRadius: '12px',
          border: '1px solid #3a3a45'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Budget Burn-down</h3>
            <span style={{ fontSize: '12px', color: '#a0a0a0' }}>Cumulative Spent Ledger</span>
          </div>

          <div style={{
            height: '240px',
            backgroundColor: '#1e1e24',
            borderRadius: '8px',
            border: '1px solid #3a3a45',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            padding: '24px 16px 16px 16px',
            position: 'relative'
          }}>
            {/* Visual graph bars */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '32px', height: '180px', backgroundColor: 'rgba(0, 208, 83, 0.8)', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '8px' }}>Q1 2026</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '32px', height: '140px', backgroundColor: 'rgba(0, 208, 83, 0.8)', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '8px' }}>Q2 2026</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '32px', height: '90px', backgroundColor: '#00d053', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: 'bold', marginTop: '8px' }}>Q3 (Active)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '32px', height: '60px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px 4px 0 0', border: '1px dashed #3a3a45' }} />
              <span style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '8px' }}>Q4 (Est)</span>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#1e1e24', borderRadius: '8px', border: '1px solid #3a3a45' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: '#a0a0a0' }}>Cumulative Allocation:</span>
              <span style={{ fontWeight: 'bold' }}>$4,200,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#a0a0a0' }}>Current Burn Amount:</span>
              <span style={{ fontWeight: 'bold', color: '#ffb300' }}>$2,850,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
