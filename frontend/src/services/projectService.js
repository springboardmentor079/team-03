import { dummyProjects } from '../mocks/projectData';

/**
 * Simulates fetching all projects with a 500ms network delay.
 * @returns {Promise<Array>} A promise resolving to the list of projects.
 */
export const getProjects = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...dummyProjects]);
    }, 500);
  });
};

/**
 * Simulates creating a new project.
 * Appends a random ID and a default status of "Planning".
 * Resolves with the created project after a 500ms delay.
 * @param {Object} newProject The new project details.
 * @returns {Promise<Object>} A promise resolving to the created project.
 */
export const createProject = (newProject) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const created = {
        ...newProject,
        _id: 'proj-' + Math.random().toString(36).substring(2, 11),
        status: 'Planning',
        // Convert budget to number if it is a numeric string
        budget: newProject.budget ? Number(newProject.budget) : 0
      };
      dummyProjects.push(created);
      resolve(created);
    }, 500);
  });
};

/**
 * Simulates updating an existing project.
 * @param {string} id The ID of the project to update.
 * @param {Object} updatedData The updated project details.
 * @returns {Promise<Object>} A promise resolving to the updated project.
 */
export const updateProject = (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = dummyProjects.findIndex((p) => p._id === id);
      if (index !== -1) {
        dummyProjects[index] = {
          ...dummyProjects[index],
          ...updatedData,
          budget: updatedData.budget ? Number(updatedData.budget) : dummyProjects[index].budget
        };
        resolve(dummyProjects[index]);
      } else {
        reject(new Error('Project not found'));
      }
    }, 500);
  });
};

/**
 * Simulates deleting an existing project.
 * @param {string} id The ID of the project to delete.
 * @returns {Promise<boolean>} A promise resolving to true if deleted.
 */
export const deleteProject = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = dummyProjects.findIndex((p) => p._id === id);
      if (index !== -1) {
        dummyProjects.splice(index, 1);
        resolve(true);
      } else {
        reject(new Error('Project not found'));
      }
    }, 500);
  });
};

