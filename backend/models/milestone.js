// backend/models/milestone.js
const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required']
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    progressCategory: {
      type: String,
      required: [true, 'Progress category is required'],
      enum: {
        values: [
          'Foundation',
          'Structural Work',
          'Electrical Work',
          'Plumbing Work',
          'Finishing Work',
          'Inspection Work'
        ],
        message: '{VALUE} is not a valid progress category'
      }
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Pending', 'In Progress', 'Completed', 'Delayed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Pending'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Milestone', milestoneSchema, 'project_milestones');