import { useState } from 'react';

const AttendanceTracking = () => {
  const [roster, setRoster] = useState([
    { id: 1, name: 'Marcus Aurelius', trade: 'Mason', status: 'Present' },
    { id: 2, name: 'John Doe', trade: 'Carpenter', status: 'Present' },
    { id: 3, name: 'Sarah Connor', trade: 'Electrician', status: 'Late' },
    { id: 4, name: 'Ellen Ripley', trade: 'Welder', status: 'Absent' },
    { id: 5, name: 'T-800', trade: 'Mason', status: 'Absent' },
    { id: 6, name: 'John Connor', trade: 'Carpenter', status: 'Present' },
    { id: 7, name: 'Ellen Vance', trade: 'Electrician', status: 'Present' },
    { id: 8, name: 'Gordon Freeman', trade: 'Welder', status: 'Late' }
  ]);

  const updateAttendance = (id, newStatus) => {
    setRoster(roster.map(worker => worker.id === id ? { ...worker, status: newStatus } : worker));
  };

  const totalExpected = roster.length;
  const presentCount = roster.filter(w => w.status === 'Present' || w.status === 'Late').length;
  const absentCount = roster.filter(w => w.status === 'Absent').length;
  const lateCount = roster.filter(w => w.status === 'Late').length;

  const metrics = [
    { label: 'Total Expected Crew', value: totalExpected, desc: 'Scheduled for today' },
    { label: 'Currently Present', value: presentCount, desc: `Includes ${lateCount} marked late`, color: '#00d053' },
    { label: 'Absent Personnel', value: absentCount, desc: 'Requires replacement call', color: absentCount > 0 ? '#ff4d4d' : '#00d053' }
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Daily Attendance Roster</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Monitor site occupancy ratios, contractor check-ins, and late shift logs.</p>
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
              color: metric.color || '#ffffff'
            }}>
              {metric.value}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>{metric.desc}</span>
          </div>
        ))}
      </div>

      {/* Roster Ledger Table Card */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '28px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Active Roster Checklist</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Worker Name</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Trade / Class</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Current Status</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Log Attendance Status</th>
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
                      backgroundColor: 
                        worker.status === 'Present' ? 'rgba(0, 208, 83, 0.1)' : 
                        worker.status === 'Late' ? 'rgba(255, 179, 0, 0.1)' : 
                        'rgba(255, 77, 77, 0.1)',
                      color: 
                        worker.status === 'Present' ? '#00d053' : 
                        worker.status === 'Late' ? '#ffb300' : 
                        '#ff4d4d'
                    }}>
                      {worker.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => updateAttendance(worker.id, 'Present')}
                        style={{
                          backgroundColor: worker.status === 'Present' ? '#00d053' : 'rgba(255,255,255,0.05)',
                          color: worker.status === 'Present' ? '#1e1e24' : '#ffffff',
                          border: worker.status === 'Present' ? 'none' : '1px solid #3a3a45',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => updateAttendance(worker.id, 'Late')}
                        style={{
                          backgroundColor: worker.status === 'Late' ? '#ffb300' : 'rgba(255,255,255,0.05)',
                          color: worker.status === 'Late' ? '#1e1e24' : '#ffffff',
                          border: worker.status === 'Late' ? 'none' : '1px solid #3a3a45',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => updateAttendance(worker.id, 'Absent')}
                        style={{
                          backgroundColor: worker.status === 'Absent' ? '#ff4d4d' : 'rgba(255,255,255,0.05)',
                          color: worker.status === 'Absent' ? '#ffffff' : '#a0a0a0',
                          border: worker.status === 'Absent' ? 'none' : '1px solid #3a3a45',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Absent
                      </button>
                    </div>
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

export default AttendanceTracking;
