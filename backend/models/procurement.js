const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    vendorName: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be greater than 0'],
    },
    estimatedCost: {
      type: Number,
      required: [true, 'Estimated cost is required'],
      min: [0, 'Estimated cost must be greater than or equal to 0'],
    },
    procurementCategory: {
      type: String,
      required: [true, 'Procurement category is required'],
      enum: {
        values: [
          'Raw Materials',
          'Equipment',
          'Machinery',
          'Safety Equipment',
          'Office Supplies',
        ],
        message: '{VALUE} is not a valid procurement category',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Pending Approval', 'Approved', 'Ordered', 'Delivered'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending Approval',
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
  }
);

const Procurement = mongoose.model('Procurement', procurementSchema);

module.exports = Procurement;