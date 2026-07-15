// models/Worker.js
const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Workforce category is required'],
    // Enforces the exact roles from the specifications document
    enum: ['Engineers', 'Supervisors', 'Contractors', 'Skilled Workers', 'Unskilled Workers', 'Consultants']
  },
  assignedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  dailyWageRate: {
    type: Number,
    required: [true, 'Daily payroll monitoring rate is required']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Worker', workerSchema);