import { useState } from 'react';

const MilestoneTracking = () => {
  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Geotechnical Investigation & Survey', date: 'Completed Oct 2025', desc: 'Soil boring test cores and topographical boundaries certified by district auditor.', status: 'completed' },
    { id: 2, title: 'Concrete Foundation Pouring', date: 'Completed Jan 2026', desc: 'Main tower base concrete structures cure strength testing passed (> 40 MPa).', status: 'completed' },
    { id: 3, title: 'Structural Framing & Decking', date: 'Current Target July 2026', desc: 'Erecting structural columns and metal pan decking for floors 1 to 5.', status: 'active' },
    { id: 4, title: 'HVAC Ductwork & MEP Rough-ins', date: 'Estimated Sept 2026', desc: 'Installation of main air handling loops and primary electrical utility runs.', status: 'pending' },
    { id: 5, title: 'Interior Drywall & Trim Out', date: 'Estimated Nov 2026', desc: 'Hanging fire-rated drywall boards and perimeter insulation buffers.', status: 'pending' },
    { id: 6, title: 'Final Handover & Occupancy Clearance', date: 'Estimated Jan 2027', desc: 'Acquiring city fire marshal occupancy signoff and owner inspection handover.', status: 'pending' }
  ]);

  const handleCompleteActive = () => {
    const activeIdx = milestones.findIndex(m => m.status === 'active');
    if (activeIdx === -1) return;

    const updated = milestones.map((m, idx) => {
      if (idx === activeIdx) {
        return { ...m, status: 'completed', date: `Completed ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` };
      }
      if (idx === activeIdx + 1) {
        return { ...m, status: 'active' };
      }
      return m;
    });
    setMilestones(updated);
  };

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
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Milestone Tracking</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Progressive timeline tracker for critical construction phases and deliverables.</p>
        </div>
        
        {milestones.some(m => m.status === 'active') && (
          <button
            onClick={handleCompleteActive}
            style={{
              backgroundColor: '#00d053',
              color: '#1e1e24',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              outline: 'none'
            }}
          >
            Mark Active Milestone Complete
          </button>
        )}
      </div>

      {/* Timeline Card */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>
          
          {/* Vertical axis line */}
          <div style={{
            position: 'absolute',
            left: '21px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            backgroundColor: '#3a3a45',
            zIndex: 1
          }} />

          {milestones.map((m, index) => {
            const isCompleted = m.status === 'completed';
            const isActive = m.status === 'active';
            const isPending = m.status === 'pending';

            return (
              <div key={m.id} style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 2,
                opacity: isPending ? 0.5 : 1,
                transition: 'opacity 0.3s'
              }}>
                {/* Node icon indicator */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#00d053' : isActive ? 'rgba(0, 208, 83, 0.1)' : '#2a2a35',
                  border: isCompleted ? '2px solid #00d053' : isActive ? '2px solid #00d053' : '2px solid #3a3a45',
                  color: isCompleted ? '#1e1e24' : isActive ? '#00d053' : '#a0a0a0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 0 12px rgba(0, 208, 83, 0.4)' : 'none',
                  animation: isActive ? 'pulse 2s infinite' : 'none'
                }}>
                  {isCompleted ? '✓' : index + 1}
                </div>

                {/* Content description box */}
                <div style={{
                  flex: 1,
                  backgroundColor: isActive ? 'rgba(0, 208, 83, 0.02)' : 'transparent',
                  padding: isActive ? '16px' : '0',
                  borderRadius: isActive ? '8px' : '0',
                  border: isActive ? '1px solid rgba(0, 208, 83, 0.15)' : 'none',
                  marginTop: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '17px',
                      fontWeight: 'bold',
                      color: isCompleted || isActive ? '#ffffff' : '#a0a0a0'
                    }}>
                      {m.title}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: isActive ? '#00d053' : '#a0a0a0'
                    }}>
                      {m.date}
                    </span>
                  </div>
                  <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '14px',
                    color: '#a0a0a0',
                    lineHeight: '1.5'
                  }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Injection for Pulsing Active Milestone */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 208, 83, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(0, 208, 83, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 208, 83, 0); }
        }
      `}</style>
    </div>
  );
};

export default MilestoneTracking;
