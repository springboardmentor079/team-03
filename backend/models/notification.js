// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId, // Links to a specific User recipient
    ref: 'User',
    required: [true, 'Notification must target a recipient user']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    // Enforces required notification features[cite: 2]
    enum: ['Project Updates', 'Task Assignments', 'Procurement Alerts', 'Attendance Alerts', 'Deadline Notifications', 'System Notifications']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);