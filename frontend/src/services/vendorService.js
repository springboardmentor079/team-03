import { vendorData } from '../mocks/vendorData';

const STORAGE_KEY = 'buildtrack_vendors';

const getStoredVendors = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vendorData));
      return [...vendorData];
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error('Error reading vendor data from localStorage:', err);
    return [...vendorData];
  }
};

const saveStoredVendors = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving vendor data to localStorage:', err);
  }
};

/**
 * Fetches all vendors (simulated async API call with 500ms delay)
 * @returns {Promise<Array>} List of vendor objects
 */
export const getAllVendors = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredVendors());
    }, 500);
  });
};

/**
 * Creates a new vendor profile
 * @param {Object} newVendorData - The vendor details
 * @returns {Promise<Object>} The newly created vendor object
 */
export const createVendor = (newVendorData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vendors = getStoredVendors();
      const created = {
        _id: `VND-${Date.now().toString().slice(-4)}`,
        performanceRating: Number(newVendorData.performanceRating) || 4.5,
        totalOrders: 0,
        status: newVendorData.status || 'Active',
        ...newVendorData
      };
      vendors.unshift(created);
      saveStoredVendors(vendors);
      resolve(created);
    }, 500);
  });
};
