// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Resource category is required'],
    // Enforces the exact categories from the specifications document
    enum: ['Excavators', 'Concrete Mixers', 'Cranes', 'Dump Trucks', 'Generators', 'Safety Equipment']
  },
  currentProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null // Null means it's available in the central yard
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Allocated', 'Under Maintenance'],
    default: 'Available'
  },
  nextMaintenanceDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', resourceSchema);