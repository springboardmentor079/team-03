const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Materials', 'Labor', 'Equipment', 'Subcontractor', 'Utilities', 'Miscellaneous'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Task 3: Compound index for financial dashboard reports by project, category, and date range
expenseSchema.index({ projectId: 1, date: -1 });
expenseSchema.index({ projectId: 1, category: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);