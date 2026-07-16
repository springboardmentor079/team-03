import { useState } from 'react';

const ContractorDashboard = () => {
  // Roster Attendance State
  const [roster, setRoster] = useState([
    { id: 1, name: 'Marcus Aurelius', trade: 'Masonry Supervisor', status: 'On Site' },
    { id: 2, name: 'John Doe', trade: 'Concrete Technician', status: 'Off Duty' },
    { id: 3, name: 'Sarah Connor', trade: 'Safety Lead', status: 'On Site' },
    { id: 4, name: 'Ellen Ripley', trade: 'Structural Welder', status: 'On Site' },
    { id: 5, name: 'T-800', trade: 'Heavy Machinery Specialist', status: 'Off Duty' }
  ]);

  // Shifts schedule data
  const shifts = [
    { id: 1, day: 'Monday, July 20', task: 'Zone C Concrete Pouring', hours: '07:00 AM - 04:00 PM', lead: 'Marcus Aurelius' },
    { id: 2, day: 'Tuesday, July 21', task: 'Zone A Rebar Installation', hours: '08:00 AM - 05:00 PM', lead: 'Ellen Ripley' },
    { id: 3, day: 'Wednesday, July 22', task: 'Structural Welding Audit', hours: '07:30 AM - 04:30 PM', lead: 'Sarah Connor' },
    { id: 4, day: 'Thursday, July 23', task: 'Utility Rough-ins Setup', hours: '08:00 AM - 05:00 PM', lead: 'John Doe' }
  ];

  const handleClockIn = (id) => {
    setRoster(roster.map(r => r.id === id ? { ...r, status: 'On Site' } : r));
  };

  const handleClockOut = (id) => {
    setRoster(roster.map(r => r.id === id ? { ...r, status: 'Off Duty' } : r));
  };

  const metrics = [
    { label: 'Assigned Projects', value: '3', desc: 'Active construction zones' },
    { label: 'Active Workers', value: roster.filter(r => r.status === 'On Site').length, desc: 'Clocked in today' },
    { label: 'Upcoming Shifts', value: shifts.length, desc: 'Scheduled this week' }
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Contractor Dashboard</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Attendance logging, subcontractor trades tracking, and daily shifts ledger.</p>
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

      {/* Main Section */}
      <div style={{
        backgroundColor: '#2a2a35',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Worker Attendance Panel</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Worker Name</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Specialist Trade</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Live Status</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Attendance Log Actions</th>
              </tr>
            </thead>
            <tbody>
              {roster.map(worker => (
                <tr key={worker.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{worker.name}</td>
                  <td style={{ padding: '16px', color: '#a0a0a0' }}>{worker.trade}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: worker.status === 'On Site' ? 'rgba(0, 208, 83, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                      color: worker.status === 'On Site' ? '#00d053' : '#ff4d4d'
                    }}>
                      {worker.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleClockIn(worker.id)}
                      style={{
                        backgroundColor: worker.status === 'On Site' ? '#00d053' : 'rgba(255,255,255,0.05)',
                        color: worker.status === 'On Site' ? '#1e1e24' : '#ffffff',
                        border: worker.status === 'On Site' ? 'none' : '1px solid #3a3a45',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        marginRight: '8px',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    >
                      Clock In
                    </button>
                    <button
                      onClick={() => handleClockOut(worker.id)}
                      style={{
                        backgroundColor: worker.status === 'Off Duty' ? '#ff4d4d' : 'rgba(255,255,255,0.05)',
                        color: worker.status === 'Off Duty' ? '#ffffff' : '#a0a0a0',
                        border: worker.status === 'Off Duty' ? 'none' : '1px solid #3a3a45',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    >
                      Clock Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Shifts schedule list */}
      <div style={{
        backgroundColor: '#2a2a35',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid #3a3a45'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Upcoming Shifts Ledger</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {shifts.map(shift => (
            <div key={shift.id} style={{
              backgroundColor: '#1e1e24',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #3a3a45'
            }}>
              <div style={{ fontSize: '13px', color: '#00d053', fontWeight: 'bold', marginBottom: '8px' }}>{shift.day}</div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold' }}>{shift.task}</h4>
              <p style={{ margin: '0 0 12px 0', color: '#a0a0a0', fontSize: '13px' }}>Hours: {shift.hours}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#a0a0a0' }}>Supervisor:</span>
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{shift.lead}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
