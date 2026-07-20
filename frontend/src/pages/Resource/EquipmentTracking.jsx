import { useState } from 'react';

const EquipmentTracking = () => {
  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Tower Crane T1', category: 'Lifting & Rigging', location: 'Zone A', status: 'Active' },
    { id: 2, name: 'Caterpillar Excavator 320D', category: 'Earthmoving', location: 'Zone C', status: 'Active' },
    { id: 3, name: 'Concrete Mixer Truck M2', category: 'Concrete Works', location: 'Zone B', status: 'Idle' },
    { id: 4, name: 'Volvo Loader L110H', category: 'Earthmoving', location: 'Zone C', status: 'Maintenance' },
    { id: 5, name: 'Generac Power Generator G4', category: 'Power Systems', location: 'Zone D', status: 'Active' },
    { id: 6, name: 'Terex Rough Terrain Crane RT', category: 'Lifting & Rigging', location: 'Zone A', status: 'Idle' },
    { id: 7, name: 'Bobcat Skid Steer Loader', category: 'Utility Vehicles', location: 'Zone B', status: 'Active' },
    { id: 8, name: 'Hamm Asphalt Roller R1', category: 'Paving', location: 'Zone E', status: 'Maintenance' }
  ]);

  const [statusFilter, setStatusFilter] = useState('All');

  const cycleStatus = (id) => {
    const statusCycle = ['Active', 'Maintenance', 'Idle'];
    setEquipment(equipment.map(item => {
      if (item.id === id) {
        const nextIdx = (statusCycle.indexOf(item.status) + 1) % statusCycle.length;
        return { ...item, status: statusCycle[nextIdx] };
      }
      return item;
    }));
  };

  const filteredEquipment = equipment.filter(item => {
    return statusFilter === 'All' || item.status === statusFilter;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active':
        return { backgroundColor: 'rgba(0, 208, 83, 0.1)', color: '#00d053', border: '1px solid #00d053' };
      case 'Maintenance':
        return { backgroundColor: 'rgba(255, 179, 0, 0.1)', color: '#ffb300', border: '1px solid #ffb300' };
      case 'Idle':
        return { backgroundColor: 'rgba(160, 160, 160, 0.1)', color: '#a0a0a0', border: '1px solid #a0a0a0' };
      default:
        return {};
    }
  };

  const metrics = [
    { label: 'Total Heavy Units', value: equipment.length, desc: 'Registered assets' },
    { label: 'Active Deployment', value: equipment.filter(e => e.status === 'Active').length, desc: 'Operational on site' },
    { label: 'In Maintenance', value: equipment.filter(e => e.status === 'Maintenance').length, desc: 'Awaiting repair logs' },
    { label: 'Idle Status', value: equipment.filter(e => e.status === 'Idle').length, desc: 'Available for allocation' }
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
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Heavy Equipment Tracking</h1>
        <p style={{ color: '#a0a0a0', margin: 0 }}>Monitor operational metrics, maintenance flags, and live sector location for machinery.</p>
      </div>

      {/* Metrics Grid */}
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

      {/* Filter and Table Card */}
      <div style={{
        backgroundColor: '#2a2a35',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        padding: '28px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Machinery Deployment Ledger</h3>
          
          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: '#1e1e24',
              border: '1px solid #3a3a45',
              borderRadius: '8px',
              padding: '10px 16px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Idle">Idle</option>
          </select>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #3a3a45' }}>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Equipment ID</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Item Name</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Category Class</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Live Sector Location</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#a0a0a0', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                    <td style={{ padding: '16px', color: '#00d053', fontWeight: 'bold' }}>EQ-00{item.id}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{item.category}</td>
                    <td style={{ padding: '16px' }}>📍 {item.location}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        ...getStatusBadgeStyle(item.status)
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => cycleStatus(item.id)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: '#ffffff',
                          border: '1px solid #3a3a45',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        Cycle Status 🔄
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#a0a0a0' }}>
                    No machinery units found matching selected filter status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipmentTracking;
