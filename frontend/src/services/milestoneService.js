import axios from 'axios';

const API_BASE = '/api';

// Explicitly clear legacy local storage key
localStorage.removeItem('buildtrack_milestones');

const getAuthHeader = () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

/**
 * Fetches milestones for a specific project ID directly from the backend database.
 * @param {string} projectId - The ID of the project to retrieve milestones for.
 * @returns {Promise<Array>} Milestones array
 */
export const getMilestonesByProjectId = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/milestones`, getAuthHeader());
    return Array.isArray(response.data) ? response.data : response.data.milestones || [];
  } catch (err) {
    console.error(`Failed to fetch milestones for project ${projectId}:`, err);
    throw err;
  }
};

/**
 * Creates a new milestone for a project directly in the backend database.
 * @param {Object} newMilestone - The milestone details (must contain projectId/project).
 * @returns {Promise<Object>} The newly created milestone object
 */
export const createMilestone = async (newMilestone) => {
  try {
    const projId = newMilestone.projectId || newMilestone.project;
    const response = await axios.post(`${API_BASE}/projects/${projId}/milestones`, newMilestone, getAuthHeader());
    return response.data.milestone || response.data;
  } catch (err) {
    console.error('Failed to create milestone in database:', err);
    throw err;
  }
};

/**
 * Updates completion status or details of a specific milestone directly in the database.
 * @param {string} milestoneId - The ID of the milestone to update.
 * @param {string|Object} newStatusOrData - Status string or fields object.
 * @returns {Promise<Object>} Updated milestone object
 */
export const updateMilestoneStatus = async (milestoneId, newStatusOrData) => {
  try {
    const updatePayload = typeof newStatusOrData === 'string'
      ? { completionStatus: newStatusOrData }
      : newStatusOrData;

    const response = await axios.put(`${API_BASE}/milestones/${milestoneId}`, updatePayload, getAuthHeader());
    return response.data.milestone || response.data;
  } catch (err) {
    console.error(`Failed to update milestone ${milestoneId}:`, err);
    throw err;
  }
};

/**
 * Deletes a milestone directly from the backend database.
 * @param {string} milestoneId - The ID of the milestone to delete.
 * @returns {Promise<boolean>}
 */
export const deleteMilestone = async (milestoneId) => {
  try {
    await axios.delete(`${API_BASE}/milestones/${milestoneId}`, getAuthHeader());
    return true;
  } catch (err) {
    console.error(`Failed to delete milestone ${milestoneId}:`, err);
    throw err;
  }
};
