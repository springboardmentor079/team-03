import { invoiceData } from '../mocks/invoiceData';

const STORAGE_KEY = 'buildtrack_invoices';

const getStoredInvoices = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceData));
      return [...invoiceData];
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error('Error reading invoice data from localStorage:', err);
    return [...invoiceData];
  }
};

const saveStoredInvoices = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving invoice data to localStorage:', err);
  }
};

/**
 * Fetches all invoices (simulated async API call with 500ms delay)
 * @returns {Promise<Array>} List of invoice objects
 */
export const getAllInvoices = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredInvoices());
    }, 500);
  });
};

/**
 * Uploads/Logs a new invoice linked to a purchase order
 * @param {Object} newInvoiceData - Invoice details
 * @returns {Promise<Object>} Created invoice
 */
export const createInvoice = (newInvoiceData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoices = getStoredInvoices();
      const created = {
        _id: `INV-${Date.now().toString().slice(-4)}`,
        paymentStatus: newInvoiceData.paymentStatus || 'Pending',
        amount: Number(newInvoiceData.amount) || 0,
        ...newInvoiceData
      };
      invoices.unshift(created);
      saveStoredInvoices(invoices);
      resolve(created);
    }, 500);
  });
};

/**
 * Updates status of an existing invoice
 * @param {string} invoiceId - Invoice ID
 * @param {string} newStatus - "Paid", "Pending", "Overdue"
 * @returns {Promise<Object>} Updated invoice
 */
export const updateInvoiceStatus = (invoiceId, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const invoices = getStoredInvoices();
      const index = invoices.findIndex((inv) => inv._id === invoiceId);
      if (index !== -1) {
        invoices[index].paymentStatus = newStatus;
        saveStoredInvoices(invoices);
        resolve({ ...invoices[index] });
      } else {
        reject(new Error('Invoice not found'));
      }
    }, 500);
  });
};
