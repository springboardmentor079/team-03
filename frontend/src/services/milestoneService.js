import { milestoneData } from '../mocks/milestoneData';
import axios from 'axios';

const STORAGE_KEY = 'buildtrack_milestones';
const API_URL = '/api/milestones';

// Helper to initialize and retrieve milestones from persistent storage
const getStoredMilestones = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(milestoneData));
      return [...milestoneData];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading milestones from storage:', err);
    return [...milestoneData];
  }
};

// Helper to save milestones back to persistent storage
const saveStoredMilestones = (milestones) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
  } catch (err) {
    console.error('Error saving milestones to storage:', err);
  }
};

/**
 * Simulates / fetches milestones for a specific project ID with persistent storage & API fallback.
 * @param {string} projectId - The ID of the project to retrieve milestones for.
 * @returns {Promise<Array>} A Promise resolving to the filtered milestones array.
 */
export const getMilestonesByProjectId = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/project/${projectId}`);
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (err) {
    // Fallback to persistent storage
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredMilestones();
      const filtered = all.filter((ms) => ms.projectId === projectId || ms.project === projectId);
      resolve([...filtered]);
    }, 300);
  });
};

/**
 * Creates a new milestone for a project with persistent storage & API fallback.
 * @param {Object} newMilestone - The milestone details.
 * @returns {Promise<Object>} A Promise resolving to the newly created milestone object.
 */
export const createMilestone = async (newMilestone) => {
  const createdPayload = {
    ...newMilestone,
    _id: newMilestone._id || 'ms-' + Math.random().toString(36).substring(2, 11),
    completionStatus: newMilestone.completionStatus || 'Pending',
    createdAt: new Date().toISOString()
  };

  try {
    const response = await axios.post(API_URL, newMilestone);
    if (response.data) {
      const all = getStoredMilestones();
      all.push(response.data);
      saveStoredMilestones(all);
      return response.data;
    }
  } catch (err) {
    // Fallback to local persistent storage
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredMilestones();
      all.push(createdPayload);
      saveStoredMilestones(all);

      // Sync in-memory array
      milestoneData.push(createdPayload);

      resolve({ ...createdPayload });
    }, 300);
  });
};

/**
 * Updates the completion status or details of a specific milestone persistently.
 * @param {string} milestoneId - The ID of the milestone to update.
 * @param {string|Object} newStatusOrData - The new status string or updated fields object.
 * @returns {Promise<Object>} A Promise resolving to the updated milestone object.
 */
export const updateMilestoneStatus = async (milestoneId, newStatusOrData) => {
  const updatePayload = typeof newStatusOrData === 'string'
    ? { completionStatus: newStatusOrData }
    : newStatusOrData;

  try {
    const response = await axios.put(`${API_URL}/${milestoneId}`, updatePayload);
    if (response.data) {
      const all = getStoredMilestones();
      const idx = all.findIndex((ms) => ms._id === milestoneId);
      if (idx !== -1) {
        all[idx] = response.data;
        saveStoredMilestones(all);
      }
      return response.data;
    }
  } catch (err) {
    // Fallback to local persistent storage
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const all = getStoredMilestones();
      const index = all.findIndex((ms) => ms._id === milestoneId);
      if (index !== -1) {
        all[index] = {
          ...all[index],
          ...updatePayload
        };
        saveStoredMilestones(all);

        // Sync in-memory mock data
        const dummyIdx = milestoneData.findIndex((ms) => ms._id === milestoneId);
        if (dummyIdx !== -1) {
          milestoneData[dummyIdx] = all[index];
        }

        resolve({ ...all[index] });
      } else {
        reject(new Error('Milestone not found'));
      }
    }, 300);
  });
};

/**
 * Deletes a milestone persistently.
 * @param {string} milestoneId - The ID of the milestone to delete.
 * @returns {Promise<boolean>}
 */
export const deleteMilestone = async (milestoneId) => {
  try {
    await axios.delete(`${API_URL}/${milestoneId}`);
  } catch (err) {
    // Fallback to local persistent storage
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const all = getStoredMilestones();
      const index = all.findIndex((ms) => ms._id === milestoneId);
      if (index !== -1) {
        all.splice(index, 1);
        saveStoredMilestones(all);

        const dummyIdx = milestoneData.findIndex((ms) => ms._id === milestoneId);
        if (dummyIdx !== -1) {
          milestoneData.splice(dummyIdx, 1);
        }

        resolve(true);
      } else {
        reject(new Error('Milestone not found'));
      }
    }, 300);
  });
};
