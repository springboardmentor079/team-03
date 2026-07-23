import { milestoneData } from '../mocks/milestoneData';

/**
 * Simulates fetching milestones for a specific project ID with a 500ms network delay.
 * @param {string} projectId - The ID of the project to retrieve milestones for.
 * @returns {Promise<Array>} A Promise resolving to the filtered milestones array.
 */
export const getMilestonesByProjectId = (projectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = milestoneData.filter((ms) => ms.projectId === projectId);
      resolve([...filtered]);
    }, 500);
  });
};

/**
 * Simulates creating a new milestone for a project.
 * @param {Object} newMilestone - The milestone details.
 * @returns {Promise<Object>} A Promise resolving to the newly created milestone object.
 */
export const createMilestone = (newMilestone) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const created = {
        ...newMilestone,
        _id: 'ms-' + Math.random().toString(36).substring(2, 11),
        completionStatus: newMilestone.completionStatus || 'Pending'
      };
      milestoneData.push(created);
      resolve({ ...created });
    }, 500);
  });
};

/**
 * Simulates updating the completion status or details of a specific milestone with a 500ms delay.
 * @param {string} milestoneId - The ID of the milestone to update.
 * @param {string|Object} newStatusOrData - The new status string or updated fields object.
 * @returns {Promise<Object>} A Promise resolving to the updated milestone object.
 */
export const updateMilestoneStatus = (milestoneId, newStatusOrData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = milestoneData.findIndex((ms) => ms._id === milestoneId);
      if (index !== -1) {
        const updatePayload = typeof newStatusOrData === 'string'
          ? { completionStatus: newStatusOrData }
          : newStatusOrData;

        milestoneData[index] = {
          ...milestoneData[index],
          ...updatePayload
        };
        resolve({ ...milestoneData[index] });
      } else {
        reject(new Error('Milestone not found'));
      }
    }, 500);
  });
};

/**
 * Simulates deleting a milestone with a 500ms delay.
 * @param {string} milestoneId - The ID of the milestone to delete.
 * @returns {Promise<boolean>}
 */
export const deleteMilestone = (milestoneId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = milestoneData.findIndex((ms) => ms._id === milestoneId);
      if (index !== -1) {
        milestoneData.splice(index, 1);
        resolve(true);
      } else {
        reject(new Error('Milestone not found'));
      }
    }, 500);
  });
};
