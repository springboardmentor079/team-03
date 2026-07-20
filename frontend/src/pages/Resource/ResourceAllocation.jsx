import { useState } from 'react';

const ResourceAllocation = () => {
  const [allocations, setAllocations] = useState([
    { id: 1, name: 'Tower Crane C1', type: 'Equipment', project: 'Downtown Heights Phase 1', start: '2026-07-01', end: '2026-12-31' },
    { id: 2, name: 'Structural Welding Team (4 Crew)', type: 'Manpower', project: 'Riverfront Luxury Residences', start: '2026-07-10', end: '2026-08-30' },
    { id: 3, name: 'Heavy Excavator E2', type: 'Equipment', project: 'Westside Logistics Warehouses', start: '2026-06-15', end: '2026-08-15' },
    { id: 4, name: 'Concrete Pouring Crew (8 Crew)', type: 'Manpower', project: 'Downtown Heights Phase 1', start: '2026-07-12', end: '2026-07-25' },
    { id: 5, name: 'Primary Safety Inspector', type: 'Manpower', project: 'Green Valley Solar Array', start: '2026-07-05', end: '2027-01-31' }
  ]);

  const [form, setForm] = useState({
    name: '',
    type: 'Manpower',
    project: 'Downtown Heights Phase 1',
    start: '',
    end: ''
  });

  const [toast, setToast] = useState({ show: false, message: '' });

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!form.name || !form.start || !form.end) {
      triggerToast('Please fill out all allocation parameters.');
      return;
    }

    const newAlloc = {
      id: Date.now(),
      ...form
    };

    setAllocations([newAlloc, ...allocations]);
    triggerToast(`Allocated "${form.name}" successfully!`);
    setForm({
      name: '',
      type: 'Manpower',
      project: 'Downtown Heights Phase 1',
      start: '',
      end: ''
    });
  };

  const handleDeallocate = (id, name) => {
    if (window.confirm(`Are you sure you want to release resource "${name}"?`)) {
      setAllocations(allocations.filter(a => a.id !== id));
      triggerToast(`Released "${name}" allocation.`);
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
      {/* Toast Alert */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#00d053',
          color: '#1e1e24',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 'bold',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toast.message}
        </div>
      )}

      {/* Header Panel */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Resource Allocation Portal</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Deploy manpower crew configurations and heavy machinery units to active project sectors.</p>
      </div>

      {/* Two Card Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Card: Allocator Form */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Assign New Resource</h3>
          <form onSubmit={handleAllocate}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Resource Name *</label>
              <input
                type="text"
                placeholder="e.g. Excavator unit #4, Carpentry Crew A"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#1e1e24',
                  border: '1px solid #3a3a45',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Resource Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Manpower">Manpower</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>
              
              <div style={{ flex: 1.5 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Assigned Project</label>
                <select
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Downtown Heights Phase 1">Downtown Heights Phase 1</option>
                  <option value="Riverfront Luxury Residences">Riverfront Luxury Residences</option>
                  <option value="Westside Logistics Warehouses">Westside Logistics Warehouses</option>
                  <option value="Green Valley Solar Array">Green Valley Solar Array</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Allocation Start *</label>
                <input
                  type="date"
                  required
                  value={form.start}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Allocation End *</label>
                <input
                  type="date"
                  required
                  value={form.end}
                  onChange={(e) => setForm({ ...form, end: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
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
                transition: 'background-color 0.2s',
                outline: 'none'
              }}
            >
              Allocate Resource
            </button>
          </form>
        </div>

        {/* Right Card: Current Allocations Table */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Active Allocation Registry</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Resource Details</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Project Sector</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Timeline</th>
                  <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(alloc => (
                  <tr key={alloc.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{alloc.name}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: alloc.type === 'Equipment' ? 'rgba(0,208,83,0.1)' : 'rgba(255,255,255,0.05)',
                        color: alloc.type === 'Equipment' ? '#00d053' : '#a0a0a0'
                      }}>
                        {alloc.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{alloc.project}</td>
                    <td style={{ padding: '16px', fontSize: '12px' }}>
                      <div>{alloc.start}</div>
                      <div style={{ color: '#a0a0a0', marginTop: '2px' }}>to {alloc.end}</div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeallocate(alloc.id, alloc.name)}
                        style={{
                          backgroundColor: 'rgba(255,77,77,0.1)',
                          color: '#ff4d4d',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        Deallocate
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

export default ResourceAllocation;
