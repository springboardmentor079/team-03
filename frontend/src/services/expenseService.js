import { expenseData } from '../mocks/expenseData';

const STORAGE_KEY = 'buildtrack_expenses';

const getStoredExpenses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenseData));
      return [...expenseData];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading expense data from storage:', err);
    return [...expenseData];
  }
};

const saveStoredExpenses = (expenses) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Error saving expense data to storage:', err);
  }
};

/**
 * Retrieves itemized expenses for a specific project ID.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<Array>} Resolves to array of matching expenses after 500ms.
 */
export const getExpensesByProjectId = (projectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredExpenses();
      const filtered = all.filter((expense) => expense.projectId === projectId);
      resolve([...filtered]);
    }, 500);
  });
};

/**
 * Logs a new expense item for a project.
 * @param {Object} data - Expense payload containing projectId, description, amount, optional date.
 * @returns {Promise<Object>} Resolves to new expense object after 500ms.
 */
export const logExpense = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExpense = {
        _id: 'exp-' + Math.random().toString(36).substring(2, 11),
        projectId: data.projectId,
        description: data.description,
        amount: Number(data.amount) || 0,
        date: data.date || new Date().toISOString().split('T')[0]
      };

      const all = getStoredExpenses();
      all.push(newExpense);
      saveStoredExpenses(all);

      expenseData.push(newExpense);

      resolve({ ...newExpense });
    }, 500);
  });
};
