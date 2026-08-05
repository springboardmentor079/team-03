const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave', 'Half Day'],
    required: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Task 3: Compound index for project daily attendance lookup
attendanceSchema.index({ projectId: 1, date: -1, status: 1 });
// Task 3: Compound index for individual user record queries
attendanceSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);