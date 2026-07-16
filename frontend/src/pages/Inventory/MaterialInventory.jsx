import { useState } from 'react';

const MaterialInventory = () => {
  const [materials, setMaterials] = useState([
    { id: 1, code: 'MAT-CEM-01', name: 'Portland Cement (Grade 53)', category: 'Cement', stock: 120, unit: 'Bags' },
    { id: 2, code: 'MAT-STL-16', name: 'Deformed Steel Rebars (16mm)', category: 'Steel', stock: 8.5, unit: 'Tons' },
    { id: 3, code: 'MAT-WOD-04', name: 'Premium Plywood Sheets (4x8)', category: 'Wood', stock: 45, unit: 'Sheets' },
    { id: 4, code: 'MAT-ELE-12', name: 'Copper Wiring Coil (12 AWG)', category: 'Electrical', stock: 14, unit: 'Coils' },
    { id: 5, code: 'MAT-CEM-02', name: 'White Portland Cement', category: 'Cement', stock: 35, unit: 'Bags' },
    { id: 6, code: 'MAT-STL-20', name: 'Deformed Steel Rebars (20mm)', category: 'Steel', stock: 12.0, unit: 'Tons' },
    { id: 7, code: 'MAT-WOD-02', name: 'Structural Timber Studs (2x4)', category: 'Wood', stock: 180, unit: 'Pieces' },
    { id: 8, code: 'MAT-ELE-10', name: 'Electrical Conduit Pipe (2")', category: 'Electrical', stock: 85, unit: 'Pipes' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Add material modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Cement', stock: '', unit: 'Bags' });

  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mat.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || mat.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!form.name || !form.stock || !form.unit) return;
    
    // Generate a code prefix based on category
    const catCode = form.category.substring(0,3).toUpperCase();
    const newCode = `MAT-${catCode}-${Math.floor(Math.random() * 90 + 10)}`;

    const newMat = {
      id: Date.now(),
      code: newCode,
      name: form.name,
      category: form.category,
      stock: Number(form.stock) || 0,
      unit: form.unit
    };

    setMaterials([newMat, ...materials]);
    setShowAddModal(false);
    setForm({ name: '', category: 'Cement', stock: '', unit: 'Bags' });
  };

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Banner Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Material Stock Registry</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>Monitor current warehouse inventories, item specifications, and deployment totals.</p>
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
          + Add New Material
        </button>
      </div>

      {/* Filters Row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search materials by name or item code..."
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

        {/* Category Selector */}
        <div style={{ minWidth: '180px' }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            <option value="All">All Categories</option>
            <option value="Cement">Cement</option>
            <option value="Steel">Steel</option>
            <option value="Wood">Wood</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>
      </div>

      {/* Inventory Table Container */}
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
              <tr style={{ borderBottom: '2px solid #00d053' }}>
                <th style={{ padding: '16px', color: '#00d053', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Code</th>
                <th style={{ padding: '16px', color: '#00d053', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Material Description</th>
                <th style={{ padding: '16px', color: '#00d053', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                <th style={{ padding: '16px', color: '#00d053', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Quantity in Stock</th>
                <th style={{ padding: '16px', color: '#00d053', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map(mat => (
                  <tr key={mat.id} style={{ borderBottom: '1px solid #3a3a45', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#a0a0a0' }}>{mat.code}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{mat.name}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: '#a0a0a0'
                      }}>{mat.category}</span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#00d053' }}>{mat.stock}</td>
                    <td style={{ padding: '16px', color: '#a0a0a0' }}>{mat.unit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#a0a0a0' }}>
                    No materials found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Material Form Modal Overlay */}
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
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Register New Material</h3>
            <form onSubmit={handleAddMaterial}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Material Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portland Cement (Grade 43)"
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

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1.2 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                    <option value="Cement">Cement</option>
                    <option value="Steel">Steel</option>
                    <option value="Wood">Wood</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Qty in Stock *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
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

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Unit *</label>
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
                      padding: '10px',
                      color: '#ffffff',
                      outline: 'none',
                      fontSize: '13px'
                    }}
                  />
                </div>
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
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialInventory;
