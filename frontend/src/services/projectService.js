import { dummyProjects } from '../mocks/projectData';
import axios from 'axios';

const STORAGE_KEY = 'buildtrack_projects';
const API_URL = '/api/projects';

// Helper to initialize and retrieve projects from persistent storage
const getStoredProjects = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyProjects));
      return [...dummyProjects];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading projects from storage:', err);
    return [...dummyProjects];
  }
};

// Helper to save projects list back to persistent storage
const saveStoredProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to storage:', err);
  }
};

/**
 * Fetches all projects (with persistent storage & API fallback).
 * @returns {Promise<Array>}
 */
export const getProjects = async () => {
  try {
    // Attempt backend API call first
    const response = await axios.get(API_URL);
    if (response.data && Array.isArray(response.data)) {
      saveStoredProjects(response.data);
      return response.data;
    }
  } catch (err) {
    // Fallback to persistent storage if API is not active
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProjects());
    }, 300);
  });
};

/**
 * Creates a new project and saves it persistently to storage/database.
 * @param {Object} newProject 
 * @returns {Promise<Object>}
 */
export const createProject = async (newProject) => {
  const createdProjectPayload = {
    ...newProject,
    _id: newProject._id || 'proj-' + Math.random().toString(36).substring(2, 11),
    status: newProject.status || 'Planning',
    budget: newProject.budget ? Number(newProject.budget) : 0,
    createdAt: new Date().toISOString()
  };

  try {
    // Attempt backend API post
    const response = await axios.post(API_URL, newProject);
    if (response.data) {
      const projects = getStoredProjects();
      projects.push(response.data);
      saveStoredProjects(projects);
      return response.data;
    }
  } catch (err) {
    // Fallback to local persistent storage
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const projects = getStoredProjects();
      projects.push(createdProjectPayload);
      saveStoredProjects(projects);
      
      // Also sync dummyProjects in-memory array for backward compatibility
      dummyProjects.push(createdProjectPayload);

      resolve(createdProjectPayload);
    }, 300);
  });
};

/**
 * Updates an existing project persistently.
 * @param {string} id 
 * @param {Object} updatedData 
 * @returns {Promise<Object>}
 */
export const updateProject = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    if (response.data) {
      const projects = getStoredProjects();
      const idx = projects.findIndex((p) => p._id === id);
      if (idx !== -1) {
        projects[idx] = response.data;
        saveStoredProjects(projects);
      }
      return response.data;
    }
  } catch (err) {
    // Fallback to local persistent storage
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projects = getStoredProjects();
      const index = projects.findIndex((p) => p._id === id);
      if (index !== -1) {
        projects[index] = {
          ...projects[index],
          ...updatedData,
          budget: updatedData.budget ? Number(updatedData.budget) : projects[index].budget
        };
        saveStoredProjects(projects);

        // Sync dummyProjects in-memory
        const dummyIdx = dummyProjects.findIndex((p) => p._id === id);
        if (dummyIdx !== -1) {
          dummyProjects[dummyIdx] = projects[index];
        }

        resolve(projects[index]);
      } else {
        reject(new Error('Project not found'));
      }
    }, 300);
  });
};

/**
 * Deletes an existing project persistently.
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export const deleteProject = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (err) {
    // Fallback to local persistent storage
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projects = getStoredProjects();
      const index = projects.findIndex((p) => p._id === id);
      if (index !== -1) {
        projects.splice(index, 1);
        saveStoredProjects(projects);

        const dummyIdx = dummyProjects.findIndex((p) => p._id === id);
        if (dummyIdx !== -1) {
          dummyProjects.splice(dummyIdx, 1);
        }

        resolve(true);
      } else {
        reject(new Error('Project not found'));
      }
    }, 300);
  });
};
