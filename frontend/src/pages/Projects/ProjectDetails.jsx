import { useState } from 'react';

const ProjectDetails = () => {
  const [project] = useState({
    name: 'Downtown Heights Phase 1',
    status: 'Active',
    budget: '$4,200,000',
    spent: '$2,850,000',
    timeline: 'Sept 2025 - Dec 2026',
    progress: 75,
    location: '742 Evergreen Terrace, Sector 7G',
    description: 'High-density multi-use commercial and residential infrastructure project featuring energy-efficient ventilation designs and structural grade steel framing.'
  });

  const [team] = useState([
    { id: 1, name: 'Sarah Connor', role: 'Lead Project Manager', initial: 'SC' },
    { id: 2, name: 'John Doe', role: 'Senior Site Engineer', initial: 'JD' },
    { id: 3, name: 'Ellen Ripley', role: 'General Subcontractor', initial: 'ER' },
    { id: 4, name: 'Marcus Aurelius', role: 'Primary Quality Lead', initial: 'MA' }
  ]);

  const [activities, setActivities] = useState([
    { id: 1, action: 'Completed concrete pouring audits for main elevators shafts.', user: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Approved budget clearance request for level 3 MEP routing.', user: 'Sarah Connor', time: '1 day ago' },
    { id: 3, action: 'Delivered reinforcement rebars shipment (15 Tons).', user: 'Ellen Ripley', time: '3 days ago' },
    { id: 4, action: 'Conducted bi-weekly site safety briefing with active contractors.', user: 'Marcus Aurelius', time: '5 days ago' }
  ]);

  const [newUpdate, setNewUpdate] = useState('');

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!newUpdate.trim()) return;
    const newLog = {
      id: Date.now(),
      action: newUpdate,
      user: 'Admin User',
      time: 'Just now'
    };
    setActivities([newLog, ...activities]);
    setNewUpdate('');
  };

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
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>{project.name}</h1>
              <span style={{
                backgroundColor: 'rgba(0, 208, 83, 0.1)',
                color: '#00d053',
                border: '1px solid #00d053',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>{project.status}</span>
            </div>
            <p style={{ color: '#a0a0a0', margin: 0, fontSize: '14px' }}>📌 Location: {project.location}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00d053' }}>{project.budget}</div>
            <span style={{ fontSize: '13px', color: '#a0a0a0' }}>Total Project Allocation</span>
          </div>
        </div>

        {/* High-level stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          borderTop: '1px solid #3a3a45',
          paddingTop: '20px'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: '#a0a0a0', textTransform: 'uppercase' }}>Project Duration</span>
            <div style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '4px' }}>{project.timeline}</div>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#a0a0a0', textTransform: 'uppercase' }}>Spent to Date</span>
            <div style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '4px', color: '#ffb300' }}>{project.spent}</div>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#a0a0a0', textTransform: 'uppercase' }}>Target Progress</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#1e1e24', borderRadius: '3px' }}>
                <div style={{ width: `${project.progress}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '3px' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{project.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Columns Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Team list */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Assigned Project Team</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {team.map(member => (
              <div key={member.id} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#1e1e24',
                  border: '1px solid #3a3a45',
                  color: '#00d053',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {member.initial}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{member.name}</div>
                  <div style={{ color: '#a0a0a0', fontSize: '12px', marginTop: '2px' }}>{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Activity Logs Feed */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>Recent Site Activity Logs</h3>

          {/* Quick status poster */}
          <form onSubmit={handlePostUpdate} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Post a new site activity update..."
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#1e1e24',
                border: '1px solid #3a3a45',
                borderRadius: '6px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#00d053',
                color: '#1e1e24',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Post
            </button>
          </form>

          {/* Vertically mapped timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.map(act => (
              <div key={act.id} style={{
                padding: '14px',
                backgroundColor: '#1e1e24',
                borderRadius: '8px',
                border: '1px solid #3a3a45'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', lineHeight: '1.4' }}>{act.action}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a0a0a0' }}>
                  <span>Logged by: {act.user}</span>
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
