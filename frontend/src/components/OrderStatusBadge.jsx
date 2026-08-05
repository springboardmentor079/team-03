import React from 'react';

/**
 * OrderStatusBadge Component
 * Displays a Bootstrap badge with styling based on purchase order status.
 * 
 * @param {Object} props
 * @param {string} props.status - Current order status
 */
const OrderStatusBadge = ({ status }) => {
  const getBadgeClass = (statusStr) => {
    switch (statusStr) {
      case 'Pending Approval':
        return 'badge bg-warning text-dark';
      case 'Approved':
        return 'badge bg-primary';
      case 'Ordered':
        return 'badge bg-info text-dark';
      case 'Delivered':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  };

  return (
    <span className={getBadgeClass(status)}>
      {status || 'Unknown'}
    </span>
  );
};

export default OrderStatusBadge;
