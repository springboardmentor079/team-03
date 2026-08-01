import React from 'react';
import ProcurementManager from '../../components/ProcurementManager';

const ProcurementRequest = () => {
  return (
    <div
      style={{
        padding: '32px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        color: '#212529'
      }}
    >
      <ProcurementManager />
    </div>
  );
};

export default ProcurementRequest;
