import { useState } from 'react';

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Marcus Aurelius', trade: 'Mason', contact: '+1 (555) 019-2834', status: 'Active', initial: 'MA' },
    { id: 2, name: 'John Doe', trade: 'Carpenter', contact: '+1 (555) 014-9847', status: 'Active', initial: 'JD' },
    { id: 3, name: 'Sarah Connor', trade: 'Electrician', contact: '+1 (555) 017-3829', status: 'Active', initial: 'SC' },
    { id: 4, name: 'Ellen Ripley', trade: 'Welder', contact: '+1 (555) 012-4938', status: 'Active', initial: 'ER' },
    { id: 5, name: 'T-800', trade: 'Mason', contact: '+1 (555) 018-4720', status: 'Inactive', initial: 'T8' },
    { id: 6, name: 'John Connor', trade: 'Carpenter', contact: '+1 (555) 011-2049', status: 'Active', initial: 'JC' },
    { id: 7, name: 'Ellen Vance', trade: 'Electrician', contact: '+1 (555) 015-8493', status: 'Inactive', initial: 'EV' },
    { id: 8, name: 'Gordon Freeman', trade: 'Welder', contact: '+1 (555) 019-3847', status: 'Active', initial: 'GF' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All');

  // Add Worker Modal Overlay states
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', trade: 'Electrician', contact: '', status: 'Active' });

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.contact.includes(searchQuery);
    const matchesTrade = tradeFilter === 'All' || w.trade === tradeFilter;
    return matchesSearch && matchesTrade;
  });

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    
    const initials = form.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    const newWorker = {
      id: Date.now(),
      name: form.name,
      trade: form.trade,
      contact: form.contact,
      status: form.status,
      initial: initials || 'WK'
    };

    setWorkers([newWorker, ...workers]);
    setShowAddModal(false);
    setForm({ name: '', trade: 'Electrician', contact: '', status: 'Active' });
  };

  const toggleStatus = (id) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w));
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
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Workforce Directory</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Manage structural trade accounts, contacts, and active status updates.</p>
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
          + Add New Worker
        </button>
      </div>

      {/* Filters Row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search workers by name or contact number..."
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
              outline: 'none'
            }}
          />
        </div>

        {/* Trade Selector */}
        <div style={{ minWidth: '180px' }}>
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
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
            <option value="All">All Trades</option>
            <option value="Electrician">Electrician</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Welder">Welder</option>
            <option value="Mason">Mason</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map(worker => (
            <div key={worker.id} style={{
              backgroundColor: '#2a2a35',
              border: '1px solid #3a3a45',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              opacity: worker.status === 'Inactive' ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#1e1e24',
                  border: '1px solid #3a3a45',
                  color: '#00d053',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {worker.initial}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{worker.name}</h4>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 208, 83, 0.1)',
                    color: '#00d053'
                  }}>{worker.trade}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #3a3a45', paddingTop: '16px', fontSize: '13px', color: '#a0a0a0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Contact:</span>
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>{worker.contact}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Status:</span>
                  <span style={{
                    fontWeight: 'bold',
                    color: worker.status === 'Active' ? '#00d053' : '#ff4d4d'
                  }}>{worker.status}</span>
                </div>
              </div>

              <button
                onClick={() => toggleStatus(worker.id)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  border: '1px solid #3a3a45',
                  padding: '8px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                Toggle Status 🔄
              </button>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: '#a0a0a0' }}>
            No workers found matching your search.
          </div>
        )}
      </div>

      {/* Add Worker Overlay Modal */}
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
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Register New Worker</h3>
            <form onSubmit={handleAddWorker}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Connor"
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

              <div style={{ marginBottom: '16px' }}>
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Contact Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +1 (555) 011-2049"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Initial Status</label>
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
                    outline: 'none',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerManagement;
