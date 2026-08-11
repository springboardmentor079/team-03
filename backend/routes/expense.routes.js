const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');

router.get('/', authMiddleware, getAllExpenses);
router.post('/', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), createExpense);
router.put('/:id', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), updateExpense);
router.delete('/:id', authMiddleware, authorizeRoles('Administrator'), deleteExpense);

module.exports = router;