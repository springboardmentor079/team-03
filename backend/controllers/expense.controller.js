const Expense = require('../models/expense');

const ALLOWED_CATEGORIES = [
  'Materials',
  'Labor',
  'Equipment',
  'Subcontractor',
  'Utilities',
  'Miscellaneous',
];

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('projectId')
      .populate('recordedBy', '-password')
      .sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { projectId, amount, category, date, description } = req.body;

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    const expense = await Expense.create({
      projectId,
      amount,
      category,
      date, // optional — schema defaults to now if omitted
      description,
      recordedBy: req.user.id, // taken from the verified JWT, never trusted from the request body
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { category } = req.body;

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};