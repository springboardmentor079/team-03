// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: [true, 'Attendance must be linked to a registered worker']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Site location project reference is required']
  },
  date: {
    type: Date,
    required: [true, 'Attendance date record is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day', 'Late'],
    required: true
  },
  shift: {
    type: String,
    enum: ['Day', 'Night'],
    default: 'Day'
  }
});

// Enforces a strict rule: A worker can only have one attendance entry per day per project
attendanceSchema.index({ worker: 1, project: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);