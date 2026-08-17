import React, { useState } from 'react';

const SiteMapViewer = ({ projects = [] }) => {
  const defaultProjects = projects.length > 0 ? projects : [
    { id: 'p1', title: 'Oakwood Commercial Center', category: 'Commercial', siteAddress: '104 Oakwood Boulevard, Zone A', latitude: 37.7749, longitude: -122.4194, status: 'In Progress' },
    { id: 'p2', title: 'Downtown Office Tower', category: 'Infrastructure', siteAddress: '550 Market Street, Block C', latitude: 37.7833, longitude: -122.4167, status: 'Planning' },
    { id: 'p3', title: 'Riverside Housing Project', category: 'Residential', siteAddress: '88 Riverbed Road, Phase 2', latitude: 37.7650, longitude: -122.4300, status: 'Completed' }
  ];

  const [selectedSite, setSelectedSite] = useState(defaultProjects[0]);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>🗺️ Construction Site Location & GIS Map</h3>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Real-time GPS site monitoring & geographic boundary tracking</p>
        </div>
        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
          GPS Online • {defaultProjects.length} Active Sites
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Interactive Map Visualizer Container */}
        <div style={{
          position: 'relative',
          height: '340px',
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #1e293b'
        }}>
          {/* Simulated Satellite Grid overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.8
          }} />

          {/* Interactive Map Pins */}
          {defaultProjects.map((p, idx) => {
            const isSelected = selectedSite && (selectedSite.id === p.id || selectedSite._id === p._id);
            // Derive pin coordinates on grid canvas
            const left = 25 + (idx * 30) + '%';
            const top = 30 + (idx * 20) + '%';

            return (
              <div
                key={p.id || p._id || idx}
                onClick={() => setSelectedSite(p)}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 2,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: isSelected ? '#00c938' : '#1e293b',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: `2px solid ${isSelected ? '#ffffff' : '#334155'}`,
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  <span style={{ fontSize: '14px' }}>📍</span>
                  {p.title || p.name}
                </div>
              </div>
            );
          })}

          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            padding: '8px 12px',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '11px',
            border: '1px solid #334155'
          }}>
            Coordinate Bounds: {selectedSite.latitude || 37.7749}° N, {selectedSite.longitude || -122.4194}° W
          </div>
        </div>

        {/* Selected Location Details Card */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              backgroundColor: selectedSite.status === 'Completed' ? '#dcfce7' : selectedSite.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
              color: selectedSite.status === 'Completed' ? '#15803d' : selectedSite.status === 'In Progress' ? '#1d4ed8' : '#b45309',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              marginBottom: '10px'
            }}>
              {selectedSite.status || 'Active'}
            </span>
            <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '16px', fontWeight: '700' }}>
              {selectedSite.title || selectedSite.name}
            </h4>
            <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '13px', lineHeight: '1.4' }}>
              📍 <strong>Address:</strong><br />{selectedSite.siteAddress || '104 Oakwood Boulevard, Zone A'}
            </p>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'grid', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category:</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedSite.category || 'Commercial'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Latitude:</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedSite.latitude || '37.7749'}° N</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Longitude:</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedSite.longitude || '-122.4194'}° W</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(`Opening live satellite GPS feed for ${selectedSite.title || selectedSite.name}`)}
            style={{
              marginTop: '16px',
              width: '100%',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            🛰️ Open Satellite Feed
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteMapViewer;
