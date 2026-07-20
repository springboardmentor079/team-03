import { useState } from 'react';

const ClientDashboard = () => {
  // Dummy Project Milestones Stepper data
  const [milestones] = useState([
    { id: 1, title: 'Phase 1: Excavation & Earthwork', date: 'Completed Sept 2025', percent: 100, status: 'Done' },
    { id: 2, title: 'Phase 2: Foundation & Steel Structure', date: 'Completed Jan 2026', percent: 100, status: 'Done' },
    { id: 3, title: 'Phase 3: Concrete Pour & MEP rough-ins', date: 'Estimated Completion July 2026', percent: 80, status: 'Active' },
    { id: 4, title: 'Phase 4: Interior Drywall & Finishes', date: 'Estimated Completion Dec 2026', percent: 0, status: 'Upcoming' },
    { id: 5, title: 'Phase 5: Landscaping & Handover', date: 'Estimated Completion March 2027', percent: 0, status: 'Upcoming' }
  ]);

  // Dummy Site Updates Feed
  const [updates] = useState([
    {
      id: 1,
      imagePlaceholder: 'Concrete Pouring Zone C',
      desc: 'Completed concrete pour for Zone C structural core. Site quality checks approved by primary engineering audit team.',
      timestamp: 'Today at 09:12 AM',
      author: 'John Doe, Site Engineer'
    },
    {
      id: 2,
      imagePlaceholder: 'HVAC Duct Installation',
      desc: 'Delivered and commenced staging of building central HVAC units and major duct assemblies on Level 3.',
      timestamp: 'Yesterday at 04:30 PM',
      author: 'Sarah Connor, PM'
    },
    {
      id: 3,
      imagePlaceholder: 'Structural Welder Assembly',
      desc: 'Completed structural framing audits for the secondary logistics facility elevator shafts.',
      timestamp: 'July 14, 2026',
      author: 'Ellen Ripley, Contractor'
    }
  ]);

  const metrics = [
    { label: 'Overall Completion %', value: '75%', desc: 'Ahead of schedule by 8 days' },
    { label: 'Total Budget Spent', value: '$8.45M', desc: 'Out of $11.2M client fund pool' },
    { label: 'Next Major Milestone', value: 'Concrete Pour Phase 3', desc: 'Target: July 30, 2026' }
  ];

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Client Project Dashboard</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Live tracking, overall milestone progress, and verified site image updates for stakeholders.</p>
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

      {/* Main Section: Progress & Stepper */}
      <div style={{
        backgroundColor: '#2a2a35',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        marginBottom: '32px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Cumulative Infrastructure Progress</h3>
        
        {/* Large Prominent Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            <span>Target Phase Completion Progress</span>
            <span style={{ color: '#00d053' }}>75% Completed</span>
          </div>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#1e1e24',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #3a3a45'
          }}>
            <div style={{
              width: '75%',
              height: '100%',
              backgroundColor: '#00d053',
              borderRadius: '10px'
            }} />
          </div>
        </div>

        {/* Stepper Grid */}
        <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#a0a0a0', fontWeight: '600' }}>Project Phase Milestones Stepper</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          {milestones.map((m, idx) => (
            <div key={m.id} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {/* Node index */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: m.status === 'Done' ? '#00d053' : m.status === 'Active' ? 'rgba(0, 208, 83, 0.1)' : '#1e1e24',
                border: m.status === 'Active' ? '2px solid #00d053' : '2px solid #3a3a45',
                color: m.status === 'Done' ? '#1e1e24' : m.status === 'Active' ? '#00d053' : '#a0a0a0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                zIndex: 2,
                flexShrink: 0
              }}>
                {m.status === 'Done' ? '✓' : idx + 1}
              </div>
              {/* Info content */}
              <div style={{ paddingTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: m.status === 'Done' ? '#ffffff' : m.status === 'Active' ? '#00d053' : '#a0a0a0'
                  }}>
                    {m.title}
                  </span>
                  {m.percent > 0 && m.percent < 100 && (
                    <span style={{ fontSize: '11px', color: '#00d053', fontWeight: 'bold', backgroundColor: 'rgba(0,208,83,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {m.percent}% Done
                    </span>
                  )}
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '13px', marginTop: '4px' }}>{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Site Updates Feed */}
      <div style={{
        backgroundColor: '#2a2a35',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid #3a3a45'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Live Site Updates Feed</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {updates.map(update => (
            <div key={update.id} style={{
              backgroundColor: '#1e1e24',
              borderRadius: '12px',
              border: '1px solid #3a3a45',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {/* Image Placeholder */}
              <div style={{
                height: '160px',
                backgroundColor: '#2a2a35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #3a3a45',
                color: '#00d053',
                fontWeight: 'bold',
                fontSize: '14px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  Live Cam Update
                </div>
                {update.imagePlaceholder}
              </div>
              {/* Description Body */}
              <div style={{ padding: '20px' }}>
                <p style={{ margin: '0 0 16px 0', color: '#ffffff', fontSize: '14px', lineHeight: '1.5' }}>{update.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a0a0a0' }}>
                  <span>{update.author}</span>
                  <span>{update.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
