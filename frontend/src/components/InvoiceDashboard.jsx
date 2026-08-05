import React, { useState, useEffect } from 'react';
import { getAllInvoices, createInvoice, updateInvoiceStatus } from '../services/invoiceService';

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    purchaseOrderId: '',
    vendorName: '',
    amount: '',
    dueDate: '',
    paymentStatus: 'Pending'
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getAllInvoices();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadInvoice = async (e) => {
    e.preventDefault();
    if (!formData.purchaseOrderId || !formData.vendorName || !formData.amount) return;

    setSubmitting(true);
    try {
      await createInvoice(formData);
      setToastMsg(`Invoice logged for PO "${formData.purchaseOrderId}" successfully!`);
      setShowUploadModal(false);
      setFormData({
        purchaseOrderId: '',
        vendorName: '',
        amount: '',
        dueDate: '',
        paymentStatus: 'Pending'
      });
      await fetchInvoices();
    } catch (err) {
      console.error('Failed to upload invoice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus);
      setToastMsg(`Invoice #${invoiceId} updated to status "${newStatus}"`);
      await fetchInvoices();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.purchaseOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Invoice KPI Totals
  const totalAmount = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.paymentStatus === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const pendingAmount = invoices
    .filter((inv) => inv.paymentStatus === 'Pending')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const overdueCount = invoices.filter((inv) => inv.paymentStatus === 'Overdue').length;

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="badge bg-success px-3 py-2">Paid</span>;
      case 'Pending':
        return <span className="badge bg-warning text-dark px-3 py-2">Pending</span>;
      case 'Overdue':
        return <span className="badge bg-danger px-3 py-2">Overdue</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{status}</span>;
    }
  };

  return (
    <div className="invoice-dashboard">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div className="toast show bg-dark text-white shadow-lg border-success">
            <div className="toast-body d-flex justify-content-between align-items-center">
              <span>{toastMsg}</span>
              <button
                type="button"
                className="btn-close btn-close-white ms-3"
                onClick={() => setToastMsg('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Upload Invoice Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Invoice Tracking System</h2>
          <p className="text-muted mb-0">
            Log financial invoices, verify payment statuses, and balance purchase order audit trails.
          </p>
        </div>
        <button
          className="btn btn-primary fw-semibold shadow-sm text-nowrap"
          onClick={() => setShowUploadModal(true)}
        >
          📄 Upload Invoice
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3">
            <span className="text-muted fs-7 text-uppercase fw-bold">Total Invoiced</span>
            <h3 className="fw-bold text-dark my-1">${totalAmount.toLocaleString()}</h3>
            <span className="text-secondary small">{invoices.length} total invoices</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-success border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Total Paid</span>
            <h3 className="fw-bold text-success my-1">${paidAmount.toLocaleString()}</h3>
            <span className="text-muted small">Cleared payments</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-warning border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Pending Approval</span>
            <h3 className="fw-bold text-warning my-1">${pendingAmount.toLocaleString()}</h3>
            <span className="text-muted small">Awaiting disbursement</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-danger border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Overdue Invoices</span>
            <h3 className="fw-bold text-danger my-1">{overdueCount}</h3>
            <span className="text-muted small">Requires immediate action</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 bg-light rounded-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">🔍</span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search invoice ID, PO Ref, or vendor name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex align-items-center">
                <label className="me-2 fw-semibold text-muted text-nowrap">Payment Status:</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">Financial Invoices Ledger</h5>
          <span className="badge bg-secondary">{filteredInvoices.length} Invoices Found</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading invoice data...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No invoices match your filter criteria.</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Invoice Ref</th>
                    <th>Linked Purchase Order</th>
                    <th>Vendor Name</th>
                    <th>Amount ($)</th>
                    <th>Due Date</th>
                    <th>Payment Status</th>
                    <th className="text-end pe-4">Quick Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv._id}>
                      <td className="ps-3 fw-bold text-secondary">{inv._id}</td>
                      <td className="fw-bold text-dark">{inv.purchaseOrderId}</td>
                      <td className="fw-semibold text-secondary">{inv.vendorName}</td>
                      <td className="fw-bold text-success">${Number(inv.amount).toLocaleString()}</td>
                      <td className="text-muted">{inv.dueDate}</td>
                      <td>{renderStatusBadge(inv.paymentStatus)}</td>
                      <td className="text-end pe-4">
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={inv.paymentStatus}
                          onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                        >
                          <option value="Paid">Mark Paid</option>
                          <option value="Pending">Mark Pending</option>
                          <option value="Overdue">Mark Overdue</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Invoice Modal */}
      {showUploadModal && (
        <div
          className="modal show d-block fade animate-fade-in"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
          onClick={() => setShowUploadModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Log / Upload Financial Invoice</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowUploadModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUploadInvoice}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Linked Purchase Order ID *</label>
                    <input
                      type="text"
                      name="purchaseOrderId"
                      className="form-control"
                      placeholder="e.g. PO-1001"
                      value={formData.purchaseOrderId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Vendor / Supplier Name *</label>
                    <input
                      type="text"
                      name="vendorName"
                      className="form-control"
                      placeholder="e.g. Acme Metal Supplies"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Invoice Amount ($) *</label>
                      <input
                        type="number"
                        name="amount"
                        className="form-control"
                        placeholder="e.g. 8500"
                        min="1"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Payment Due Date *</label>
                      <input
                        type="date"
                        name="dueDate"
                        className="form-control"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Initial Payment Status</label>
                    <select
                      name="paymentStatus"
                      className="form-select"
                      value={formData.paymentStatus}
                      onChange={handleInputChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-bold" disabled={submitting}>
                    {submitting ? 'Uploading Invoice...' : 'Log Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDashboard;
