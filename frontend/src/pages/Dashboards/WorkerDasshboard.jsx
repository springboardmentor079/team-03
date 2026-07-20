import { useState } from 'react';

const WorkerDashboard = () => {
  const metrics = [
    { label: 'Hours Logged This Week', value: '34.5 hrs', change: 'Overtime: 2.5 hrs', status: 'normal' },
    { label: 'Upcoming Shifts', value: '5 Shifts', change: 'Next: July 17, 08:00 AM', status: 'normal' },
    { label: 'Safety Notices', value: '1 Active', change: 'Hard hat policy update', status: 'warning' }
  ];

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Attend morning Toolbox Safety Meeting', checked: true },
    { id: 2, text: 'Verify scaffolding stability certification on Zone C', checked: true },
    { id: 3, text: 'Collect and inspect electrical power tools from inventory', checked: false },
    { id: 4, text: 'Begin masonry wall construction along gridline D', checked: false },
    { id: 5, text: 'Clear work area debris and lock tool chest at shift end', checked: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Worker Dashboard</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Log shift hours, check safety mandates, and check-off daily assigned duties.</p>
        </div>
        <button style={{
          backgroundColor: '#00d053',
          color: '#1e1e24',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}>
          Clock In Shift
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
            <span style={{ color: '#a0a0a0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{metric.label}</span>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '12px 0 6px 0',
              color: metric.label === 'Safety Notices' ? '#ffb300' : '#00d053'
            }}>
              {metric.value}
            </div>
            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>{metric.change}</span>
          </div>
        ))}
      </div>

      {/* Middle Row: My Assigned Tasks Today */}
      <div style={{
        backgroundColor: '#2a2a35',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        maxWidth: '700px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>My Assigned Tasks Today</h3>
          <span style={{
            fontSize: '12px',
            color: '#a0a0a0',
            fontWeight: 'bold'
          }}>
            {tasks.filter(t => t.checked).length} / {tasks.length} Completed
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map((task) => (
            <label key={task.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#1e1e24',
              borderRadius: '8px',
              border: '1px solid #3a3a45',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.2s'
            }}>
              <input
                type="checkbox"
                checked={task.checked}
                onChange={() => toggleTask(task.id)}
                style={{
                  marginRight: '16px',
                  width: '18px',
                  height: '18px',
                  accentColor: '#00d053',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                fontSize: '14px',
                color: task.checked ? '#a0a0a0' : '#ffffff',
                textDecoration: task.checked ? 'line-through' : 'none',
                transition: 'color 0.2s'
              }}>
                {task.text}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
