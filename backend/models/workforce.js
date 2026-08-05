const mongoose = require('mongoose');

const workforceSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  workerName: {
    type: String,
    required: true,
    trim: true
  },
  trade: {
    type: String,
    required: true, // e.g., 'Electrician', 'Plumber', 'Mason', 'Carpenter', 'General Laborer'
    trim: true
  },
  role: {
    type: String,
    enum: ['Site Supervisor', 'Foreman', 'Skilled Technician', 'Laborer'],
    default: 'Laborer'
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Terminated'],
    default: 'Active'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Optional link to a registered platform user
  }
}, { timestamps: true });

// Task 3: Compound index for workforce filtering by trade and status per project
workforceSchema.index({ projectId: 1, trade: 1, status: 1 });

module.exports = mongoose.model('Workforce', workforceSchema);