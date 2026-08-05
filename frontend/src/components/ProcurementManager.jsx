import React, { useState, useEffect } from 'react';
import CreatePurchaseOrderForm from './CreatePurchaseOrderForm';
import {
  getAllProcurements,
  updateOrderStatus,
  updateProcurementStatus,
  deleteProcurementOrder
} from '../services/procurementService';
import { useAuth } from '../context/auth';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActionButtons from './OrderActionButtons';

const CATEGORIES = [
  'All',
  'Raw Materials',
  'Equipment',
  'Machinery',
  'Safety Equipment',
  'Office Supplies'
];

const STATUSES = ['All', 'Pending Approval', 'Approved', 'Rejected', 'Dispatched', 'Delivered'];

const ProcurementManager = ({ projectId }) => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, [projectId]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllProcurements();
      const filtered = projectId
        ? data.filter((o) => o.projectId === projectId)
        : data;
      setOrders(filtered);
    } catch (err) {
      console.error('Failed to fetch procurement orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setActionLoadingId(orderId);
    try {
      await updateProcurementStatus(orderId, newStatus);
      setToastMessage(
        newStatus === 'Delivered'
          ? `Order #${orderId} marked as Delivered & synchronized to Inventory!`
          : `Order #${orderId} status updated to "${newStatus}"`
      );
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      setToastMessage('Error updating order status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) return;

    setActionLoadingId(orderId);
    try {
      await deleteProcurementOrder(orderId);
      setToastMessage(`Purchase order #${orderId} deleted.`);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to delete order:', err);
      setToastMessage('Error deleting purchase order.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOrderCreated = () => {
    setShowFormModal(false);
    setToastMessage('New purchase order logged successfully!');
    fetchOrders();
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.createdBy && order.createdBy.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || order.procurementCategory === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || order.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  const totalSpend = orders.reduce((sum, o) => sum + (Number(o.estimatedCost) || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending Approval').length;
  const approvedCount = orders.filter((o) => o.status === 'Approved' || o.status === 'Dispatched').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Approval':
        return <span className="badge bg-warning text-dark px-3 py-2 fs-6">Pending Approval</span>;
      case 'Approved':
        return <span className="badge bg-primary px-3 py-2 fs-6">Approved</span>;
      case 'Rejected':
        return <span className="badge bg-danger px-3 py-2 fs-6">Rejected</span>;
      case 'Dispatched':
        return <span className="badge bg-info text-dark px-3 py-2 fs-6">In Transit</span>;
      case 'Delivered':
        return <span className="badge bg-success px-3 py-2 fs-6">✓ Delivered & In Stock</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 fs-6">{status}</span>;
    }
  };

  return (
    <div className="procurement-manager">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div className="toast show bg-dark text-white shadow-lg border-success">
            <div className="toast-body d-flex align-items-center justify-content-between py-3">
              <span>{toastMessage}</span>
              <button
                type="button"
                className="btn-close btn-close-white ms-3"
                onClick={() => setToastMessage('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Header & New PO Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Procurement Management</h2>
          <p className="text-muted mb-0">
            Track material orders, process vendor approvals, and sync inventory automatically.
          </p>
        </div>
        <button
          className="btn btn-success btn-lg fw-semibold shadow-sm text-nowrap"
          onClick={() => setShowFormModal(!showFormModal)}
        >
          {showFormModal ? '✕ Close Form' : '+ New Purchase Order'}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3">
            <span className="text-muted fs-7 text-uppercase fw-bold">Total Estimated Spend</span>
            <h3 className="fw-bold text-dark my-1">${totalSpend.toLocaleString()}</h3>
            <span className="text-secondary small">{orders.length} total orders logged</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-warning border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Pending Approvals</span>
            <h3 className="fw-bold text-warning my-1">{pendingCount}</h3>
            <span className="text-muted small">Requires 2nd eye approval</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-primary border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Approved / In Transit</span>
            <h3 className="fw-bold text-primary my-1">{approvedCount}</h3>
            <span className="text-muted small">Order fulfillment active</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-success border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Delivered & In Stock</span>
            <h3 className="fw-bold text-success my-1">{deliveredCount}</h3>
            <span className="text-muted small">Added to inventory</span>
          </div>
        </div>
      </div>

      {/* Collapsible Form Section */}
      {showFormModal && (
        <div className="card shadow border-0 mb-4 animate__animated animate__fadeIn">
          <div className="card-body p-0">
            <CreatePurchaseOrderForm
              projectId={projectId || 'PROJ-101'}
              onOrderCreated={handleOrderCreated}
            />
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3 bg-light rounded-3">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">🔍</span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search item, vendor, requester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <label className="me-2 fw-semibold text-muted text-nowrap">Category:</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <label className="me-2 fw-semibold text-muted text-nowrap">Status:</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Orders Ledger */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="fw-bold mb-0 text-dark">Purchase Orders Ledger</h5>
          <span className="badge bg-secondary">{filteredOrders.length} Orders Found</span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading procurement data...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No purchase orders match your filter criteria.</h5>
              <p className="mb-0">Try clearing filters or adding a new purchase order.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">PO Ref ID</th>
                    <th>Item & Category</th>
                    <th>Requested By</th>
                    <th>Vendor</th>
                    <th>Qty & Cost</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Approval Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const isUpdating = actionLoadingId === order._id;

                    // Four-Eyes Principle Checks
                    const isApproverRole = ['Administrator', 'Project Manager'].includes(user?.role);
                    const currentUserName = user?.name || user?.username || '';
                    const isSelfOrder =
                      currentUserName &&
                      order.createdBy &&
                      currentUserName.toLowerCase() === order.createdBy.toLowerCase();
                    const canApproveOrReject = isApproverRole && !isSelfOrder;

                    return (
                      <tr key={order._id}>
                        <td className="ps-3 fw-bold text-secondary">{order._id}</td>

                        <td>
                          <div className="fw-bold text-dark">{order.itemName}</div>
                          <span className="badge bg-light text-dark border">
                            {order.procurementCategory}
                          </span>
                        </td>

                        <td>
                          <div className="fw-semibold text-dark">
                            {order.createdBy || 'Site Engineer'}
                          </div>
                          <small className="text-muted">
                            {order.createdByRole || 'Requester'}
                          </small>
                        </td>

                        <td className="fw-semibold text-secondary">{order.vendorName}</td>

                        <td>
                          <div>
                            <span className="fw-bold">{order.quantity}</span> units
                          </div>
                          <div className="fw-bold text-success small">
                            ${Number(order.estimatedCost).toLocaleString()}
                          </div>
                        </td>

                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>

                        <td className="text-end pe-4">
                          {isUpdating ? (
                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                          ) : (
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <OrderActionButtons order={order} onUpdateStatus={handleStatusChange} />
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleDelete(order._id)}
                                title="Delete Order"
                              >
                                🗑
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcurementManager;
