import React, { useState, useEffect } from 'react';
import { getAllProcurements, updateOrderStatus } from '../services/procurementService';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActionButtons from './OrderActionButtons';

/**
 * ProcurementDashboard Component
 * Displays a table of all purchase orders, allowing status updates via next-step action buttons.
 */
const ProcurementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProcurements();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch procurement orders:', err);
      setError('Failed to load purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 font-weight-bold text-dark mb-0">Procurement Tracking Dashboard</h2>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
          <p className="mt-2 text-muted">Loading purchase orders...</p>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-bordered table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Vendor Name</th>
                <th scope="col">Item Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Est. Cost ($)</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-bold">{order._id}</td>
                    <td>{order.vendorName}</td>
                    <td>{order.itemName}</td>
                    <td>{Number(order.quantity || 0).toLocaleString()}</td>
                    <td>${Number(order.estimatedCost || 0).toLocaleString()}</td>
                    <td>{order.procurementCategory || order.category || 'General'}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="text-center">
                      {updatingId === order._id ? (
                        <span className="spinner-border spinner-border-sm text-secondary" role="status" />
                      ) : (
                        <OrderActionButtons order={order} onUpdateStatus={handleStatusUpdate} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProcurementDashboard;
