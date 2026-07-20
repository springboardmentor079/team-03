import { useState } from 'react';

const ProjectListing = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Downtown Heights Phase 1', manager: 'Sarah Connor', deadline: '2026-10-15', status: 'Active', budget: '$4.2M' },
    { id: 2, name: 'Westside Logistics Warehouses', manager: 'John Doe', deadline: '2026-12-01', status: 'Delayed', budget: '$2.8M' },
    { id: 3, name: 'Riverfront Luxury Residences', manager: 'Ellen Ripley', deadline: '2026-08-20', status: 'Completed', budget: '$5.5M' },
    { id: 4, name: 'Green Valley Solar Array', manager: 'Marcus Aurelius', deadline: '2027-02-10', status: 'Active', budget: '$1.9M' },
    { id: 5, name: 'Oakwood Shopping Complex', manager: 'Sarah Connor', deadline: '2026-11-30', status: 'Active', budget: '$3.1M' },
    { id: 6, name: 'Metropolitan Water Conduit', manager: 'John Doe', deadline: '2026-07-28', status: 'Delayed', budget: '$1.2M' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Dynamic project creation modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', manager: '', deadline: '', status: 'Active', budget: '' });

  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active':
        return { backgroundColor: 'rgba(0, 208, 83, 0.1)', color: '#00d053', border: '1px solid #00d053' };
      case 'Completed':
        return { backgroundColor: 'rgba(0, 208, 83, 0.15)', color: '#00d053', border: '1px solid #00d053' };
      case 'Delayed':
        return { backgroundColor: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', border: '1px solid #ff4d4d' };
      default:
        return { backgroundColor: 'rgba(160, 160, 160, 0.1)', color: '#a0a0a0', border: '1px solid #a0a0a0' };
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!form.name || !form.manager || !form.budget) return;
    const newProj = {
      id: Date.now(),
      name: form.name,
      manager: form.manager,
      deadline: form.deadline || 'TBD',
      status: form.status,
      budget: form.budget
    };
    setProjects([newProj, ...projects]);
    setShowAddModal(false);
    setForm({ name: '', manager: '', deadline: '', status: 'Active', budget: '' });
  };

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>BuildTrack Projects</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Register and audit global construction initiatives, budgets, and milestones.</p>
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
          + Add New Project
        </button>
      </div>

      {/* Filter and search controllers */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search projects by title or manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#2a2a35',
              border: '1px solid #3a3a45',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        {/* Filter Dropdown */}
        <div style={{ minWidth: '180px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#2a2a35',
              border: '1px solid #3a3a45',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Main projects grid table */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Project Name</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Assigned PM</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Deadline</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Budget</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map(proj => (
                  <tr key={proj.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{proj.name}</td>
                    <td style={{ padding: '16px' }}>{proj.manager}</td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{proj.deadline}</td>
                    <td style={{ padding: '16px', color: '#ffffff' }}>{proj.budget}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        ...getStatusBadgeStyle(proj.status)
                      }}>
                        {proj.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#a0a0a0' }}>
                    No projects match the search filter requirements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Overlay Form Modal */}
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
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Add New Project</h3>
            <form onSubmit={handleAddProject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Project Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Assigned PM *</label>
                <input
                  type="text"
                  required
                  value={form.manager}
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Budget *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $2.5M"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: '#1e1e24',
                      border: '1px solid #3a3a45',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: '#1e1e24',
                      border: '1px solid #3a3a45',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Completed">Completed</option>
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
                    cursor: 'pointer'
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
                    cursor: 'pointer'
                  }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListing;
