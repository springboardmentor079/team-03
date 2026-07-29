import React, { useState, useEffect } from 'react';
import { createPurchaseOrder } from '../services/procurementService';
import { useAuth } from '../context/auth';

const CATEGORIES = [
  'Raw Materials',
  'Equipment',
  'Machinery',
  'Safety Equipment',
  'Office Supplies'
];

/**
 * Component for creating and submitting a new Purchase Order.
 *
 * @param {Object} props
 * @param {string} [props.projectId] - Optional project ID to associate with the purchase order
 * @param {Function} [props.onOrderCreated] - Optional callback function triggered after successful creation
 */
const CreatePurchaseOrderForm = ({ projectId = 'PROJ-101', onOrderCreated }) => {
  const { user } = useAuth();

  const initialFormState = {
    vendorName: '',
    itemName: '',
    quantity: '',
    estimatedCost: '',
    procurementCategory: 'Raw Materials'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer;
    if (showSuccessAlert) {
      timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setShowSuccessAlert(false);

    // Basic Validation
    if (
      !formData.vendorName.trim() ||
      !formData.itemName.trim() ||
      !formData.quantity ||
      !formData.estimatedCost ||
      !formData.procurementCategory
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (Number(formData.quantity) <= 0 || Number(formData.estimatedCost) <= 0) {
      setErrorMessage('Quantity and Estimated Cost must be positive numbers.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        projectId,
        vendorName: formData.vendorName.trim(),
        itemName: formData.itemName.trim(),
        quantity: Number(formData.quantity),
        estimatedCost: Number(formData.estimatedCost),
        procurementCategory: formData.procurementCategory,
        createdBy: user?.name || user?.username || 'Current User',
        createdByRole: user?.role || 'Site Engineer'
      };

      const createdOrder = await createPurchaseOrder(orderPayload);

      // Show success alert and reset form
      setShowSuccessAlert(true);
      setFormData(initialFormState);

      if (onOrderCreated) {
        onOrderCreated(createdOrder);
      }
    } catch (err) {
      console.error('Failed to create purchase order:', err);
      setErrorMessage(err.message || 'Failed to submit purchase order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white py-3">
        <h5 className="card-title mb-0 fw-bold">Create Purchase Order</h5>
      </div>
      <div className="card-body p-4">
        {/* Success Alert */}
        {showSuccessAlert && (
          <div
            className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4"
            role="alert"
          >
            <span className="me-2 fw-bold">✓ Success:</span>
            <span>Purchase order was successfully logged!</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowSuccessAlert(false)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <span>{errorMessage}</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMessage('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            {/* Vendor Name */}
            <div className="col-md-6">
              <label htmlFor="vendorName" className="form-label fw-semibold">
                Vendor Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                className="form-control"
                placeholder="e.g. Acme Metal Supplies"
                value={formData.vendorName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Item Name */}
            <div className="col-md-6">
              <label htmlFor="itemName" className="form-label fw-semibold">
                Item Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                className="form-control"
                placeholder="e.g. Steel Rebars (12mm)"
                value={formData.itemName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Quantity */}
            <div className="col-md-6">
              <label htmlFor="quantity" className="form-label fw-semibold">
                Quantity <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-control"
                placeholder="e.g. 50"
                min="1"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Estimated Cost */}
            <div className="col-md-6">
              <label htmlFor="estimatedCost" className="form-label fw-semibold">
                Estimated Cost ($) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                className="form-control"
                placeholder="e.g. 15000"
                min="0.01"
                step="0.01"
                value={formData.estimatedCost}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Procurement Category */}
            <div className="col-12">
              <label htmlFor="procurementCategory" className="form-label fw-semibold">
                Procurement Category <span className="text-danger">*</span>
              </label>
              <select
                id="procurementCategory"
                name="procurementCategory"
                className="form-select"
                value={formData.procurementCategory}
                onChange={handleChange}
                disabled={loading}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving Purchase Order...
                  </>
                ) : (
                  'Submit Purchase Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderForm;
