import { inventoryData } from '../mocks/inventoryData';

const STORAGE_KEY = 'buildtrack_inventory';

const getStoredInventory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryData));
      return [...inventoryData];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading inventory data from storage:', err);
    return [...inventoryData];
  }
};

const saveStoredInventory = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving inventory data to storage:', err);
  }
};

/**
 * Retrieves inventory items for a specific project ID.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<Array>} Resolves to array of matching inventory items after 500ms.
 */
export const getInventoryByProjectId = (projectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredInventory();
      const filtered = all.filter((item) => item.projectId === projectId);
      resolve([...filtered]);
    }, 500);
  });
};

/**
 * Adds a new construction material or equipment item.
 * @param {Object} newItem - Item payload containing projectId, itemName, quantity, unit, lowStockThreshold.
 * @returns {Promise<Object>} Resolves to newly created item object after 500ms.
 */
export const addInventoryItem = (newItem) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemToAdd = {
        _id: 'inv-' + Math.random().toString(36).substring(2, 11),
        projectId: newItem.projectId,
        itemName: newItem.itemName,
        quantity: Number(newItem.quantity) || 0,
        unit: newItem.unit || 'Units',
        lowStockThreshold: Number(newItem.lowStockThreshold) || 0
      };

      const all = getStoredInventory();
      all.push(itemToAdd);
      saveStoredInventory(all);

      inventoryData.push(itemToAdd);

      resolve({ ...itemToAdd });
    }, 500);
  });
};

/**
 * Updates stock quantity for a specific inventory item.
 * @param {string} itemId - The ID of the inventory item.
 * @param {number} newQuantity - The updated quantity number.
 * @returns {Promise<Object>} Resolves to updated item object after 500ms.
 */
export const updateStockQuantity = (itemId, newQuantity) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const all = getStoredInventory();
      const index = all.findIndex((item) => item._id === itemId);
      if (index !== -1) {
        all[index].quantity = Number(newQuantity) || 0;
        saveStoredInventory(all);

        const dummyIdx = inventoryData.findIndex((item) => item._id === itemId);
        if (dummyIdx !== -1) {
          inventoryData[dummyIdx].quantity = Number(newQuantity) || 0;
        }

        resolve({ ...all[index] });
      } else {
        reject(new Error('Inventory item not found'));
      }
    }, 500);
  });
};
