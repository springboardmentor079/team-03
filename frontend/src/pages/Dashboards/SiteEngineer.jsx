import { useState } from 'react';

const SiteEngineerDashboard = () => {
  // Tasks Checklist State
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Morning toolbox safety briefing', checked: true },
    { id: 2, text: 'Inspect foundation reinforcement steel layout (Zone C)', checked: true },
    { id: 3, text: 'Sign off concrete pour test certificates', checked: false },
    { id: 4, text: 'Coordinate tower crane load schedule', checked: false },
    { id: 5, text: 'Approve level 2 rough electric work inspection', checked: false }
  ]);

  // Inventory Stock Alert State
  const [materials, setMaterials] = useState([
    { id: 1, item: 'Portland Cement (Grade 53)', stock: '12 Bags remaining', minRequired: '100 Bags', requested: false },
    { id: 2, item: 'Deformed Rebars (16mm)', stock: '0.8 Tons remaining', minRequired: '3.0 Tons', requested: false },
    { id: 3, item: 'Ready-Mix Concrete (M25)', stock: '4 Cubic Meters', minRequired: '20 Cubic Meters', requested: false },
    { id: 4, item: 'Electrical Conduits (2")', stock: '15 Pipes remaining', minRequired: '80 Pipes', requested: true }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const handleRestockRequest = (id) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, requested: true } : m));
  };

  const metrics = [
    { label: 'Workers on Site', value: '45', desc: '12 subcontractors' },
    { label: 'Material Alerts', value: materials.filter(m => !m.requested).length, desc: 'Low stock items' },
    { label: 'Active Equipment', value: '8', desc: 'Running on site' },
    { label: 'Tasks Pending', value: tasks.filter(t => !t.checked).length, desc: 'Assigned today' }
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Site Engineer Dashboard</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>On-site construction checklists, safety mandates, and immediate supply alerts.</p>
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

      {/* Split Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Daily Task Checklist */}
        <div style={{
          backgroundColor: '#2a2a35',
          padding: '28px',
          borderRadius: '12px',
          border: '1px solid #3a3a45'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Daily Task Checklist</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tasks.map(task => (
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

        {/* Material Inventory Alerts */}
        <div style={{
          backgroundColor: '#2a2a35',
          padding: '28px',
          borderRadius: '12px',
          border: '1px solid #3a3a45'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Material Inventory Alerts</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Material Item</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Current Stock</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Min Threshold</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(mat => (
                  <tr key={mat.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{mat.item}</td>
                    <td style={{ padding: '16px', color: '#ffb300', fontWeight: '500' }}>{mat.stock}</td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{mat.minRequired}</td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => handleRestockRequest(mat.id)}
                        disabled={mat.requested}
                        style={{
                          backgroundColor: mat.requested ? 'rgba(0, 208, 83, 0.1)' : '#00d053',
                          color: mat.requested ? '#00d053' : '#1e1e24',
                          border: mat.requested ? '1px solid #00d053' : 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: mat.requested ? 'default' : 'pointer',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {mat.requested ? 'Requested ✓' : 'Request Restock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteEngineerDashboard;
