// models/Procurement.js
const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Procurement requests must be tied to a project']
  },
  vendorName: {
    type: String,
    required: [true, 'Supplier/Vendor management identification is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Procurement item category is required'],
    // Enforces categories directly from the document[cite: 2]
    enum: ['Raw Materials', 'Equipment', 'Machinery', 'Safety Equipment', 'Office Supplies']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Invoice tracking / Purchase order total cost is required']
  },
  status: {
    type: String,
    enum: ['Requested', 'Ordered', 'Invoiced', 'Delivered', 'Cancelled'],
    default: 'Requested'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Must track the specific internal requestor']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Procurement', procurementSchema);