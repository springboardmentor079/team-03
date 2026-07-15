// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: [true, 'Material name is required'],
    // Enforces the exact material categories from the specifications document
    enum: ['Cement', 'Steel', 'Bricks', 'Sand', 'Concrete', 'Electrical Materials', 'Plumbing Materials']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Inventory items must be allocated to a project site']
  },
  quantityAvailable: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unitOfMeasurement: {
    type: String,
    required: [true, 'Unit (e.g., Bags, Tons, Units) is required'],
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);