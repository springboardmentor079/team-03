const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  resourceName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Heavy Machinery', 'Vehicle', 'Tooling', 'Safety Gear', 'IT Equipment'],
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'In Use', 'Under Maintenance', 'Decommissioned'],
    default: 'Available',
    required: true
  }
}, { timestamps: true });

// Task 3: Compound index for project resource availability queries
resourceSchema.index({ projectId: 1, availabilityStatus: 1 });

module.exports = mongoose.model('Resource', resourceSchema);