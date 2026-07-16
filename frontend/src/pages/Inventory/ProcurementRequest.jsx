import { useState } from 'react';

const ProcurementRequest = () => {
  const [requests, setRequests] = useState([
    { id: 1, item: 'High-Tensile Steel Bolts (M20)', qty: 500, unit: 'Units', priority: 'High', date: '2026-07-25', status: 'Pending Approval' },
    { id: 2, item: 'Structural Timber Studs (2x4)', qty: 150, unit: 'Pieces', priority: 'Normal', date: '2026-07-30', status: 'Approved' },
    { id: 3, item: 'Portland Cement (Grade 53)', qty: 200, unit: 'Bags', priority: 'High', date: '2026-07-22', status: 'Dispatched' }
  ]);

  const [form, setForm] = useState({
    item: '',
    qty: '',
    unit: 'Bags',
    priority: 'Normal',
    date: ''
  });

  const [toast, setToast] = useState({ show: false, message: '' });

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!form.item || !form.qty || !form.date) {
      triggerToast('Please complete all form input fields.');
      return;
    }

    const newRequest = {
      id: Date.now(),
      item: form.item,
      qty: Number(form.qty) || 0,
      unit: form.unit,
      priority: form.priority,
      date: form.date,
      status: 'Pending Approval'
    };

    setRequests([newRequest, ...requests]);
    triggerToast(`Procurement request for "${form.item}" created!`);
    setForm({
      item: '',
      qty: '',
      unit: 'Bags',
      priority: 'Normal',
      date: ''
    });
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return { color: '#ff4d4d', backgroundColor: 'rgba(255, 77, 77, 0.1)', border: '1px solid #ff4d4d' };
      case 'Normal':
        return { color: '#ffb300', backgroundColor: 'rgba(255, 179, 0, 0.1)', border: '1px solid #ffb300' };
      default:
        return { color: '#00d053', backgroundColor: 'rgba(0, 208, 83, 0.1)', border: '1px solid #00d053' };
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Procurement Ordering</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Initiate formal purchase orders and audit recent material request statuses.</p>
      </div>

      {/* Split layout grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Side Form */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>New Procurement Request</h3>
          <form onSubmit={handleSubmitRequest}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Material Item Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Grade 53 Portland Cement, Copper Cables"
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
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
              <div style={{ flex: 1.2 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Quantity Required *</label>
                <input
                  type="number"
                  required
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
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
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Unit Type</label>
                <input
                  type="text"
                  required
                  placeholder="Bags, Tons..."
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
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

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Priority Level</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div style={{ flex: 1.2 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Required By Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
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
              Submit Order Request
            </button>
          </form>
        </div>

        {/* Right Side List */}
        <div style={{
          backgroundColor: '#2a2a35',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          padding: '28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Recent Requests Ledger</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {requests.map(req => (
              <div key={req.id} style={{
                backgroundColor: '#1e1e24',
                padding: '18px',
                borderRadius: '8px',
                border: '1px solid #3a3a45',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold' }}>{req.item}</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#a0a0a0' }}>
                    Quantity: <strong>{req.qty} {req.unit}</strong> &bull; Target Date: {req.date}
                  </p>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    ...getPriorityStyle(req.priority)
                  }}>
                    {req.priority} Priority
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: req.status === 'Approved' || req.status === 'Dispatched' ? '#00d053' : '#ffb300',
                    backgroundColor: req.status === 'Approved' || req.status === 'Dispatched' ? 'rgba(0,208,83,0.1)' : 'rgba(255,179,0,0.1)',
                    padding: '6px 12px',
                    borderRadius: '20px'
                  }}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementRequest;
