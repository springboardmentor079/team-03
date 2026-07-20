import { useState } from 'react';

const ProjectProgress = () => {
  const [projects] = useState([
    { id: 1, name: 'Downtown Commercial Hub', category: 'Commercial', progress: 78, lead: 'Alice Vance', start: 'Oct 2025' },
    { id: 2, name: 'Greenway Residential Estate', category: 'Residential', progress: 42, lead: 'Bob Miller', start: 'Dec 2025' },
    { id: 3, name: 'High-Tech Office Suites', category: 'Commercial', progress: 91, lead: 'Charlie Jenkins', start: 'Aug 2025' },
    { id: 4, name: 'Industrial Warehouse Expansion', category: 'Industrial', progress: 15, lead: 'David Kross', start: 'Feb 2026' },
    { id: 5, name: 'Metro Overpass Linkway', category: 'Infrastructure', progress: 60, lead: 'Eva Stone', start: 'Nov 2025' }
  ]);

  const [activeReportProject, setActiveReportProject] = useState(null);

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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Project Portfolio Progress</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Review overall completion rates, site milestones, and generate progress audits.</p>
      </div>

      {/* Main layout containing checklist grid and report generator */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Side: Projects Roster progress */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold' }}>Active Portfolio Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {projects.map(p => (
              <div key={p.id} style={{
                backgroundColor: '#1e1e24',
                borderRadius: '8px',
                border: '1px solid #3a3a45',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold' }}>{p.name}</h4>
                    <span style={{ fontSize: '12px', color: '#a0a0a0' }}>Lead: {p.lead} &bull; Started {p.start}</span>
                  </div>
                  <button
                    onClick={() => setActiveReportProject(p)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #00d053',
                      color: '#00d053',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    View Audit Report
                  </button>
                </div>

                {/* Progress bar fill */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a0a0a0', marginBottom: '6px' }}>
                    <span>Milestone Progress</span>
                    <span style={{ color: '#00d053', fontWeight: 'bold' }}>{p.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', backgroundColor: '#2a2a35', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '6px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Audit report details */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minHeight: '440px'
        }}>
          {activeReportProject ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Progress Audit Report</h3>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(0, 208, 83, 0.1)',
                  color: '#00d053',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>{activeReportProject.category}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div style={{ borderBottom: '1px solid #3a3a45', paddingBottom: '12px' }}>
                  <div style={{ color: '#a0a0a0', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Project Name</div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{activeReportProject.name}</div>
                </div>

                <div style={{ borderBottom: '1px solid #3a3a45', paddingBottom: '12px' }}>
                  <div style={{ color: '#a0a0a0', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Project Lead</div>
                  <div style={{ fontWeight: 'bold' }}>{activeReportProject.lead}</div>
                </div>

                <div style={{ borderBottom: '1px solid #3a3a45', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ color: '#a0a0a0', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Start Month</div>
                    <div style={{ fontWeight: 'bold' }}>{activeReportProject.start}</div>
                  </div>
                  <div>
                    <div style={{ color: '#a0a0a0', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Current Progress</div>
                    <div style={{ fontWeight: 'bold', color: '#00d053' }}>{activeReportProject.progress}%</div>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <button
                    onClick={() => alert(`Report Generated for ${activeReportProject.name}!\nCompletion: ${activeReportProject.progress}%`)}
                    style={{
                      width: '100%',
                      backgroundColor: '#00d053',
                      color: '#1e1e24',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Generate Export Document
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '380px',
              color: '#a0a0a0',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '16px' }}>📊</span>
              <h4>No Project Selected</h4>
              <p style={{ maxWidth: '280px', fontSize: '13px', margin: '8px 0 0 0' }}>Select "View Audit Report" on any active portfolio card to load details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;
