const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    required: true, // e.g., 'kg', 'bags', 'units', 'meters'
    trim: true
  },
  reorderLevel: {
    type: Number,
    required: true,
    min: 0,
    default: 10
  }
}, { timestamps: true });

// Task 3: Compound index for project stock searching
inventorySchema.index({ projectId: 1, itemName: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);