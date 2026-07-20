import { useState } from 'react';

const ShiftScheduling = () => {
  const [shifts, setShifts] = useState([
    { id: 1, name: 'Marcus Aurelius', trade: 'Mason', day: 'Monday', time: 'Morning (07:00 AM - 03:00 PM)' },
    { id: 2, name: 'John Doe', trade: 'Carpenter', day: 'Monday', time: 'Night (11:00 PM - 07:00 AM)' },
    { id: 3, name: 'Sarah Connor', trade: 'Electrician', day: 'Tuesday', time: 'Morning (07:00 AM - 03:00 PM)' },
    { id: 4, name: 'Ellen Ripley', trade: 'Welder', day: 'Wednesday', time: 'Morning (07:00 AM - 03:00 PM)' },
    { id: 5, name: 'Gordon Freeman', trade: 'Welder', day: 'Thursday', time: 'Night (11:00 PM - 07:00 AM)' },
    { id: 6, name: 'John Connor', trade: 'Carpenter', day: 'Friday', time: 'Morning (07:00 AM - 03:00 PM)' },
    { id: 7, name: 'T-800', trade: 'Mason', day: 'Friday', time: 'Night (11:00 PM - 07:00 AM)' }
  ]);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', trade: 'Electrician', day: 'Monday', time: 'Morning (07:00 AM - 03:00 PM)' });

  const handleAssignShift = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const newShift = {
      id: Date.now(),
      ...form
    };

    setShifts([...shifts, newShift]);
    setShowAddModal(false);
    setForm({ name: '', trade: 'Electrician', day: 'Monday', time: 'Morning (07:00 AM - 03:00 PM)' });
  };

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Banner Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Weekly Shift Planner</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Schedule Morning and Night shift rotations across carpentry, welding, and electrical teams.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
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
          Assign Shift
        </button>
      </div>

      {/* Week Calendar Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        alignItems: 'start',
        overflowX: 'auto'
      }}>
        {weekdays.map(day => {
          const dayShifts = shifts.filter(s => s.day === day);
          
          return (
            <div key={day} style={{
              backgroundColor: '#2a2a35',
              borderRadius: '10px',
              border: '1px solid #3a3a45',
              padding: '16px',
              minHeight: '400px'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '15px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#00d053',
                borderBottom: '1px solid #3a3a45',
                paddingBottom: '10px'
              }}>{day}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dayShifts.length > 0 ? (
                  dayShifts.map(s => (
                    <div key={s.id} style={{
                      backgroundColor: '#1e1e24',
                      borderRadius: '6px',
                      border: '1px solid #3a3a45',
                      padding: '12px',
                      fontSize: '12px'
                    }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>{s.name}</div>
                      <div style={{ color: '#00d053', marginBottom: '6px' }}>{s.trade}</div>
                      <div style={{ color: '#a0a0a0', fontSize: '11px' }}>{s.time}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#a0a0a0', padding: '24px 0', fontSize: '11px', border: '1px dashed #3a3a45', borderRadius: '6px' }}>
                    No shifts assigned
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Shift Form Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#2a2a35',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid #3a3a45',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Assign Worker Shift</h3>
            <form onSubmit={handleAssignShift}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Worker Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gordon Freeman"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Trade Specialty</label>
                  <select
                    value={form.trade}
                    onChange={(e) => setForm({ ...form, trade: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: '#1e1e24',
                      border: '1px solid #3a3a45',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#ffffff',
                      outline: 'none',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Welder">Welder</option>
                    <option value="Mason">Mason</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Day of Week</label>
                  <select
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: '#1e1e24',
                      border: '1px solid #3a3a45',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#ffffff',
                      outline: 'none',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Shift Hours</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Morning (07:00 AM - 03:00 PM)">Morning (07:00 AM - 03:00 PM)</option>
                  <option value="Night (11:00 PM - 07:00 AM)">Night (11:00 PM - 07:00 AM)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#a0a0a0',
                    border: '1px solid #3a3a45',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#00d053',
                    color: '#1e1e24',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Assign Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftScheduling;
