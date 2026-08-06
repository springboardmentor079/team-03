import React, { useState, useEffect } from 'react';
import { getAllVendors, createVendor } from '../services/vendorService';

const VendorDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    vendorName: '',
    contactEmail: '',
    contactPhone: '',
    category: 'Raw Materials',
    performanceRating: 4.5,
    status: 'Active'
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await getAllVendors();
      setVendors(data);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!formData.vendorName || !formData.contactEmail) return;

    setSubmitting(true);
    try {
      await createVendor(formData);
      setToastMsg(`Vendor "${formData.vendorName}" added successfully!`);
      setShowAddModal(false);
      setFormData({
        vendorName: '',
        contactEmail: '',
        contactPhone: '',
        category: 'Raw Materials',
        performanceRating: 4.5,
        status: 'Active'
      });
      await fetchVendors();
    } catch (err) {
      console.error('Failed to add vendor:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVendors = vendors.filter((v) =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.category && v.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCount = vendors.filter((v) => v.status === 'Active').length;
  const avgRating = vendors.length
    ? (vendors.reduce((acc, v) => acc + (Number(v.performanceRating) || 0), 0) / vendors.length).toFixed(1)
    : 'N/A';

  return (
    <div className="vendor-dashboard">
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

      {/* Header & Add Vendor Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Vendor & Supplier Management</h2>
          <p className="text-muted mb-0">
            Manage approved supplier profiles, track performance ratings, and maintain contact records.
          </p>
        </div>
        <button
          className="btn btn-success fw-semibold shadow-sm text-nowrap"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Vendor
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3">
            <span className="text-muted fs-7 text-uppercase fw-bold">Total Vendors</span>
            <h3 className="fw-bold text-dark my-1">{vendors.length}</h3>
            <span className="text-secondary small">Registered suppliers</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-success border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Active Vendors</span>
            <h3 className="fw-bold text-success my-1">{activeCount}</h3>
            <span className="text-muted small">Eligible for purchase orders</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white rounded-3 p-3 border-start border-primary border-4">
            <span className="text-muted fs-7 text-uppercase fw-bold">Avg Performance Rating</span>
            <h3 className="fw-bold text-primary my-1">⭐ {avgRating} / 5.0</h3>
            <span className="text-muted small">Based on fulfillment quality</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 bg-light rounded-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">🔍</span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search vendor name, email, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">Approved Vendors Directory</h5>
          <span className="badge bg-secondary">{filteredVendors.length} Suppliers Found</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="text-muted mt-2">Loading vendors directory...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No vendors found matching your query.</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Vendor ID</th>
                    <th>Vendor Name</th>
                    <th>Contact Email</th>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id}>
                      <td className="ps-3 fw-bold text-secondary">{vendor._id}</td>
                      <td className="fw-bold text-dark">{vendor.vendorName}</td>
                      <td>
                        <a href={`mailto:${vendor.contactEmail}`} className="text-decoration-none text-primary">
                          {vendor.contactEmail}
                        </a>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {vendor.category || 'General'}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-dark">⭐ {vendor.performanceRating || '4.0'}</span>
                      </td>
                      <td>
                        {vendor.status === 'Active' ? (
                          <span className="badge bg-success px-3 py-2">Active</span>
                        ) : (
                          <span className="badge bg-secondary px-3 py-2">Inactive</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div
          className="modal show d-block fade animate-fade-in"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
          onClick={() => setShowAddModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Add New Vendor Profile</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddVendor}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Vendor Name *</label>
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
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Contact Email *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      className="form-control"
                      placeholder="e.g. sales@acmemetal.com"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="Raw Materials">Raw Materials</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Machinery">Machinery</option>
                        <option value="Safety Equipment">Safety Equipment</option>
                        <option value="Office Supplies">Office Supplies</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success fw-bold" disabled={submitting}>
                    {submitting ? 'Saving Vendor...' : 'Save Vendor Profile'}
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

export default VendorDashboard;
