import { workforceData } from '../mocks/workforceData';

const STORAGE_KEY = 'buildtrack_workforce';

const getStoredWorkforce = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workforceData));
      return [...workforceData];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading workforce data from storage:', err);
    return [...workforceData];
  }
};

const saveStoredWorkforce = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Error saving workforce data to storage:', err);
  }
};

/**
 * Retrieves timesheet entries for a specific project ID.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<Array>} Resolves to array of matching timesheets after 500ms.
 */
export const getTimesheetsByProjectId = (projectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredWorkforce();
      const filtered = all.filter((entry) => entry.projectId === projectId);
      resolve([...filtered]);
    }, 500);
  });
};

/**
 * Logs a new labor timesheet entry for a project.
 * @param {Object} newEntry - Payload containing projectId, workerName, date, hoursWorked, taskDescription.
 * @returns {Promise<Object>} Resolves to newly logged timesheet object after 500ms.
 */
export const logLaborHours = (newEntry) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entryToAdd = {
        _id: 'ts-' + Math.random().toString(36).substring(2, 11),
        projectId: newEntry.projectId,
        workerName: newEntry.workerName,
        date: newEntry.date || new Date().toISOString().split('T')[0],
        hoursWorked: Number(newEntry.hoursWorked) || 0,
        taskDescription: newEntry.taskDescription
      };

      const all = getStoredWorkforce();
      all.push(entryToAdd);
      saveStoredWorkforce(all);

      workforceData.push(entryToAdd);

      resolve({ ...entryToAdd });
    }, 500);
  });
};
