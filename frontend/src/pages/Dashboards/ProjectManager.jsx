import { useState } from 'react';

const ProjectManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  // Dummy Projects Array
  const [projects] = useState([
    { id: 1, name: 'Downtown Heights', manager: 'Sarah Connor', progress: 85, status: 'On Track', budget: '$4.2M', category: 'Residential' },
    { id: 2, name: 'Westside Logistics Park', manager: 'John Doe', progress: 42, status: 'At Risk', budget: '$2.8M', category: 'Commercial' },
    { id: 3, name: 'Riverfront Residences', manager: 'Ellen Ripley', progress: 91, status: 'On Track', budget: '$5.5M', category: 'Residential' },
    { id: 4, name: 'Green Valley Solar', manager: 'Marcus Aurelius', progress: 12, status: 'Delayed', budget: '$1.9M', category: 'Infrastructure' },
    { id: 5, name: 'Oakwood Commercial Center', manager: 'Sarah Connor', progress: 60, status: 'On Track', budget: '$3.1M', category: 'Commercial' }
  ]);

  // Dummy Milestones Array
  const [milestones, setMilestones] = useState([
    { id: 1, task: 'Finalize structural framing inspection', project: 'Downtown Heights', dueDate: 'July 20, 2026', completed: false },
    { id: 2, task: 'Complete utility rough-ins (Level 4)', project: 'Riverfront Residences', dueDate: 'July 22, 2026', completed: true },
    { id: 3, task: 'Deliver solar inverter modules', project: 'Green Valley Solar', dueDate: 'July 25, 2026', completed: false },
    { id: 4, task: 'Inspect plumbing lines pressure test', project: 'Westside Logistics Park', dueDate: 'July 28, 2026', completed: false },
    { id: 5, task: 'Complete site grading audit report', project: 'Oakwood Commercial Center', dueDate: 'July 30, 2026', completed: true }
  ]);

  const toggleMilestone = (id) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const metrics = [
    { label: 'Total Projects', value: projects.length, desc: 'Active in portfolio' },
    { label: 'Pending Milestones', value: milestones.filter(m => !m.completed).length, desc: 'Due this month' },
    { label: 'Budget Variance', value: '+$142,500', desc: 'Under budget overall' },
    { label: 'Resource Utilization', value: '88.4%', desc: 'Workforce efficiency' }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'On Track': return { backgroundColor: 'rgba(0, 208, 83, 0.1)', color: '#00d053' };
      case 'At Risk': return { backgroundColor: 'rgba(255, 179, 0, 0.1)', color: '#ffb300' };
      case 'Delayed': return { backgroundColor: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d' };
      default: return { backgroundColor: 'rgba(160, 160, 160, 0.1)', color: '#a0a0a0' };
    }
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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Project Manager Dashboard</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Overview of project portfolios, timeline milestones, and resource allocation efficiency.</p>
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

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '16px',
        borderBottom: '1px solid #3a3a45',
        marginBottom: '24px',
        paddingBottom: '1px'
      }}>
        {['Overview', 'Milestones'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab ? '#00d053' : '#a0a0a0',
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '3px solid #00d053' : '3px solid transparent',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div style={{
        backgroundColor: '#2a2a35',
        padding: '28px',
        borderRadius: '12px',
        border: '1px solid #3a3a45'
      }}>
        {activeTab === 'Overview' ? (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Active Projects Summary</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                    <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Project Title</th>
                    <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Manager</th>
                    <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Budget</th>
                    <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Progress</th>
                    <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(proj => (
                    <tr key={proj.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>{proj.name}</td>
                      <td style={{ padding: '16px', color: '#a0a0a0' }}>{proj.category}</td>
                      <td style={{ padding: '16px' }}>{proj.manager}</td>
                      <td style={{ padding: '16px' }}>{proj.budget}</td>
                      <td style={{ padding: '16px', width: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: '#1e1e24', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${proj.progress}%`, height: '100%', backgroundColor: '#00d053', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{proj.progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          ...getStatusStyle(proj.status)
                        }}>
                          {proj.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Pending & Completed Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {milestones.map(m => (
                <div key={m.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#1e1e24',
                  borderRadius: '8px',
                  border: '1px solid #3a3a45'
                }}>
                  <div>
                    <span style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(0, 208, 83, 0.1)',
                      color: '#00d053',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      {m.project}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: m.completed ? '#a0a0a0' : '#ffffff',
                      textDecoration: m.completed ? 'line-through' : 'none'
                    }}>
                      {m.task}
                    </span>
                    <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '6px' }}>Due Date: {m.dueDate}</div>
                  </div>
                  <button
                    onClick={() => toggleMilestone(m.id)}
                    style={{
                      backgroundColor: m.completed ? 'rgba(160,160,160,0.1)' : '#00d053',
                      color: m.completed ? '#a0a0a0' : '#1e1e24',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      outline: 'none'
                    }}
                  >
                    {m.completed ? 'Reopen' : 'Mark Complete'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
