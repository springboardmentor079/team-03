import { resourceData } from '../mocks/resourceData';

const STORAGE_KEY = 'buildtrack_resources';

const getStoredResources = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resourceData));
      return [...resourceData];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading resource data from storage:', err);
    return [...resourceData];
  }
};

const saveStoredResources = (resources) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  } catch (err) {
    console.error('Error saving resource data to storage:', err);
  }
};

/**
 * Retrieves team members assigned to a specific project ID.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<Array>} Resolves to array of matching team members after 500ms.
 */
export const getTeamByProjectId = (projectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredResources();
      const filtered = all.filter((member) => member.assignedProjectId === projectId);
      resolve([...filtered]);
    }, 500);
  });
};

/**
 * Assigns a new team member to a project.
 * @param {string} projectId - Target project ID.
 * @param {Object} memberData - Details of team member (name, role, contact).
 * @returns {Promise<Object>} Resolves to new team member object after 500ms.
 */
export const assignTeamMember = (projectId, memberData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMember = {
        _id: 'res-' + Math.random().toString(36).substring(2, 11),
        assignedProjectId: projectId,
        name: memberData.name,
        role: memberData.role,
        contact: memberData.contact
      };

      const all = getStoredResources();
      all.push(newMember);
      saveStoredResources(all);

      resourceData.push(newMember);

      resolve({ ...newMember });
    }, 500);
  });
};
