import { procurementData } from '../mocks/procurementData';
import { addInventoryItem } from './inventoryService';
import { createNotification } from './notificationService';

const STORAGE_KEY = 'buildtrack_procurement';

const getStoredProcurements = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(procurementData));
      return [...procurementData];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading procurement data from storage:', err);
    return [...procurementData];
  }
};

const saveStoredProcurements = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving procurement data to storage:', err);
  }
};

/**
 * Fetch all purchase orders (simulated async API call with 500ms delay)
 * @returns {Promise<Array>} List of procurement orders
 */
export const getAllProcurements = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProcurements());
    }, 500);
  });
};

/**
 * Create a new purchase order (simulated async API call with 500ms delay)
 * @param {Object} orderData - The purchase order details
 * @returns {Promise<Object>} The newly created purchase order with _id and default status
 */
export const createPurchaseOrder = (orderData) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const newOrder = {
        _id: `PO-${Date.now()}`,
        status: 'Pending Approval',
        ...orderData,
        quantity: Number(orderData.quantity),
        estimatedCost: Number(orderData.estimatedCost)
      };

      const all = getStoredProcurements();
      all.unshift(newOrder);
      saveStoredProcurements(all);

      // Keep mock array updated
      procurementData.unshift(newOrder);

      // Trigger automatic system notification
      try {
        await createNotification({
          title: 'Purchase Order Submitted',
          message: `PO ${newOrder._id} for ${newOrder.itemName} was created and submitted for approval.`,
          type: 'Procurement Alerts'
        });
      } catch (e) {
        console.error('Notification creation failed:', e);
      }

      resolve(newOrder);
    }, 500);
  });
};

/**
 * Update status of an existing purchase order
 * @param {string} orderId - Purchase order ID
 * @param {string} newStatus - "Pending Approval", "Approved", "Rejected", "Ordered", "Dispatched", "Delivered"
 * @returns {Promise<Object>} Updated purchase order object
 */
export const updateOrderStatus = (orderId, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const all = getStoredProcurements();
      const index = all.findIndex((order) => order._id === orderId);

      if (index !== -1) {
        all[index].status = newStatus;
        saveStoredProcurements(all);

        const dummyIdx = procurementData.findIndex((order) => order._id === orderId);
        if (dummyIdx !== -1) {
          procurementData[dummyIdx].status = newStatus;
        }

        const updatedOrder = all[index];

        // Trigger automatic system notification
        try {
          await createNotification({
            title: `Order Status: ${newStatus}`,
            message: `Purchase Order ${updatedOrder._id} (${updatedOrder.itemName}) status changed to "${newStatus}".`,
            type: 'Procurement Alerts'
          });
        } catch (e) {
          console.error('Notification creation failed:', e);
        }

        // Auto-sync with Inventory Service if marked as Delivered
        if (newStatus === 'Delivered') {
          try {
            await addInventoryItem({
              projectId: updatedOrder.projectId || 'PROJ-101',
              itemName: updatedOrder.itemName,
              quantity: updatedOrder.quantity,
              unit: 'Units',
              lowStockThreshold: 10
            });
          } catch (err) {
            console.error('Auto inventory sync error:', err);
          }
        }

        resolve({ ...updatedOrder });
      } else {
        reject(new Error('Purchase order not found'));
      }
    }, 500);
  });
};

export const updateProcurementStatus = updateOrderStatus;

/**
 * Delete a purchase order
 * @param {string} orderId - Purchase order ID
 * @returns {Promise<boolean>} Resolves to true on success
 */
export const deleteProcurementOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const all = getStoredProcurements();
      const filtered = all.filter((order) => order._id !== orderId);

      if (filtered.length !== all.length) {
        saveStoredProcurements(filtered);
        resolve(true);
      } else {
        reject(new Error('Purchase order not found'));
      }
    }, 500);
  });
};
