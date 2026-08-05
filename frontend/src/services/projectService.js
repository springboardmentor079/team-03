import axios from 'axios';

const API_URL = '/api/projects';

// Explicitly clear legacy local storage key
localStorage.removeItem('buildtrack_projects');

const getAuthHeader = () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

/**
 * Fetches all projects directly from the backend MongoDB database.
 * @returns {Promise<Array>} Array of project objects
 */
export const getProjects = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    const data = Array.isArray(response.data) ? response.data : response.data.projects || [];
    return data.map((p) => ({
      ...p,
      title: p.title || p.name
    }));
  } catch (err) {
    console.error('Failed to fetch projects from database:', err);
    throw err;
  }
};

/**
 * Fetches a single project by ID directly from the database.
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const getProjectById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    const p = response.data;
    return p ? { ...p, title: p.title || p.name } : null;
  } catch (err) {
    console.error(`Failed to fetch project ${id}:`, err);
    throw err;
  }
};

/**
 * Creates a new project directly in the backend MongoDB database.
 * @param {Object} newProject 
 * @returns {Promise<Object>} The newly created project
 */
export const createProject = async (newProject) => {
  try {
    const payload = {
      ...newProject,
      name: newProject.name || newProject.title
    };
    const response = await axios.post(API_URL, payload, getAuthHeader());
    const created = response.data.project || response.data;
    return { ...created, title: created.title || created.name };
  } catch (err) {
    console.error('Failed to create project in database:', err);
    throw err;
  }
};

/**
 * Updates an existing project directly in the backend database.
 * @param {string} id 
 * @param {Object} updatedData 
 * @returns {Promise<Object>}
 */
export const updateProject = async (id, updatedData) => {
  try {
    const payload = {
      ...updatedData,
      name: updatedData.name || updatedData.title
    };
    const response = await axios.put(`${API_URL}/${id}`, payload, getAuthHeader());
    const updated = response.data.project || response.data;
    return { ...updated, title: updated.title || updated.name };
  } catch (err) {
    console.error(`Failed to update project ${id}:`, err);
    throw err;
  }
};

/**
 * Deletes an existing project directly from the backend database.
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export const deleteProject = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return true;
  } catch (err) {
    console.error(`Failed to delete project ${id}:`, err);
    throw err;
  }
};
