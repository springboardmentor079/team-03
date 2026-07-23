import React, { useState, useEffect } from 'react';
import {
  getInventoryByProjectId,
  addInventoryItem,
  updateStockQuantity
} from '../services/inventoryService';

const InventoryManager = ({ projectId }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: 'Bags',
    lowStockThreshold: ''
  });
  const [formError, setFormError] = useState('');

  // Quick edit quantity state dictionary: { [itemId]: number }
  const [editQuantities, setEditQuantities] = useState({});

  useEffect(() => {
    fetchInventory();
  }, [projectId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventoryByProjectId(projectId);
      setInventory(data);

      // Initialize editQuantities map
      const initialMap = {};
      data.forEach((item) => {
        initialMap[item._id] = item.quantity;
      });
      setEditQuantities(initialMap);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (
      !formData.itemName.trim() ||
      formData.quantity === '' ||
      Number(formData.quantity) < 0 ||
      formData.lowStockThreshold === '' ||
      Number(formData.lowStockThreshold) < 0
    ) {
      setFormError('Please fill out all fields with valid non-negative numbers.');
      return;
    }

    try {
      setSubmitting(true);
      const newItem = await addInventoryItem({
        projectId,
        itemName: formData.itemName,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        lowStockThreshold: Number(formData.lowStockThreshold)
      });

      setInventory((prev) => [...prev, newItem]);
      setEditQuantities((prev) => ({
        ...prev,
        [newItem._id]: newItem.quantity
      }));

      setFormData({
        itemName: '',
        quantity: '',
        unit: 'Bags',
        lowStockThreshold: ''
      });
    } catch (err) {
      setFormError('Failed to add inventory item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateQuantity = async (itemId) => {
    const newQty = editQuantities[itemId];
    if (newQty === undefined || newQty === '' || Number(newQty) < 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    try {
      setUpdatingId(itemId);
      const updated = await updateStockQuantity(itemId, Number(newQty));
      setInventory((prev) =>
        prev.map((item) => (item._id === itemId ? updated : item))
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity.');
    } finally {
      setUpdatingId(null);
    }
  };

  const lowStockItemsCount = inventory.filter(
    (item) => item.quantity < item.lowStockThreshold
  ).length;

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4 bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold text-dark mb-0">Inventory & Equipment Management</h5>
          <small className="text-muted">Track site materials, machinery, and low-stock alerts</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          {lowStockItemsCount > 0 && (
            <span className="badge bg-danger">
              ⚠️ {lowStockItemsCount} Low Stock Alert{lowStockItemsCount > 1 ? 's' : ''}
            </span>
          )}
          <span className="badge bg-light text-dark border">
            {inventory.length} Total Items
          </span>
        </div>
      </div>

      <div className="card-body p-4">
        {/* Add Material / Equipment Form */}
        <div className="bg-light p-3 p-md-4 rounded-3 border mb-4">
          <h6 className="fw-bold text-dark mb-3">Add Material / Equipment</h6>

          {formError && (
            <div className="alert alert-danger py-2 px-3 small" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-dark mb-1">Item Name *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Portland Cement"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Quantity *</label>
              <input
                type="number"
                min="0"
                className="form-control form-control-sm"
                placeholder="e.g. 500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Unit *</label>
              <select
                className="form-select form-select-sm"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="Bags">Bags</option>
                <option value="Tons">Tons</option>
                <option value="Units">Units</option>
                <option value="Sets">Sets</option>
                <option value="Cu. Meters">Cu. Meters</option>
                <option value="Liters">Liters</option>
              </select>
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Low Threshold *</label>
              <input
                type="number"
                min="0"
                className="form-control form-control-sm"
                placeholder="e.g. 50"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm w-100 fw-semibold"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : '+ Add Item'}
              </button>
            </div>
          </form>
        </div>

        {/* Stock Overview Table */}
        <h6 className="fw-bold text-dark mb-3">Stock Overview</h6>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span className="ms-2 small text-muted">Loading inventory items...</span>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3 text-muted border border-dashed">
            <p className="mb-0 small">No inventory items tracked for this project yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="small text-muted fw-semibold">Item Name</th>
                  <th scope="col" className="small text-muted fw-semibold">Current Quantity</th>
                  <th scope="col" className="small text-muted fw-semibold">Unit</th>
                  <th scope="col" className="small text-muted fw-semibold">Low Threshold</th>
                  <th scope="col" className="small text-muted fw-semibold">Status</th>
                  <th scope="col" className="small text-muted fw-semibold text-end">Adjust Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const isLowStock = item.quantity < item.lowStockThreshold;

                  return (
                    <tr
                      key={item._id}
                      className={isLowStock ? 'table-danger' : ''}
                    >
                      <td className="fw-semibold text-dark">
                        {item.itemName}
                        {isLowStock && (
                          <span className="ms-2 small text-danger fw-bold">
                            (Low Stock!)
                          </span>
                        )}
                      </td>
                      <td className="fw-bold fs-6">
                        <span className={isLowStock ? 'text-danger fw-bold' : 'text-dark'}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="text-muted small">{item.unit}</td>
                      <td className="text-muted small">{item.lowStockThreshold}</td>
                      <td>
                        {isLowStock ? (
                          <span className="badge bg-danger text-white">
                            Low Stock Warning
                          </span>
                        ) : (
                          <span className="badge bg-success text-white">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            className="form-control form-control-sm text-center"
                            style={{ width: '80px' }}
                            value={
                              editQuantities[item._id] !== undefined
                                ? editQuantities[item._id]
                                : item.quantity
                            }
                            onChange={(e) =>
                              setEditQuantities({
                                ...editQuantities,
                                [item._id]: e.target.value
                              })
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary fw-semibold"
                            onClick={() => handleUpdateQuantity(item._id)}
                            disabled={updatingId === item._id}
                          >
                            {updatingId === item._id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              />
                            ) : (
                              'Update'
                            )}
                          </button>
                        </div>
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
  );
};

export default InventoryManager;
