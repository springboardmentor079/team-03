// models/ProjectMilestone.js
const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId, // Connects directly to the parent Project[cite: 1]
    ref: 'Project',
    required: [true, 'Milestone must belong to a parent project']
  },
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true
  },
  description: {
    type: String
  },
  progressCategory: {
    type: String,
    required: [true, 'Progress category is required'],
    // Enforces the exact trackable construction phases from the document[cite: 2]
    enum: ['Foundation', 'Structural Work', 'Electrical Work', 'Plumbing Work', 'Finishing Work', 'Inspection Work']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Approved', 'Delayed'], // Tracked milestone states[cite: 1]
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  completedAt: {
    type: Date // Populated once status changes to Approved[cite: 1]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProjectMilestone', milestoneSchema);