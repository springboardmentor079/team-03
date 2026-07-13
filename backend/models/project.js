// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Project location/site address is required']
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId, // Connects directly to the User collection
    ref: 'User',
    required: [true, 'A project must be assigned to an authorized Project Manager']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    // Enforces the exact categories from the specifications document[cite: 2]
    enum: ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Government Projects']
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'On Hold', 'Completed'], // Standard tracked lifecycles
    default: 'Planning'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date // Targeted project completion date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);