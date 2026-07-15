// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Reports must belong to a project']
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author credentials are required']
  },
  reportType: {
    type: String,
    required: [true, 'Report category definition is required'],
    // Enforces the core reporting features[cite: 2]
    enum: ['Project Progress Reports', 'Resource Utilization Reports', 'Budget Reports', 'Workforce Reports', 'Procurement Reports']
  },
  fileUrl: {
    type: String,
    required: [true, 'Export document location (AWS S3/Local path) is required'] // Aligns with storage integrations[cite: 2]
  },
  format: {
    type: String,
    enum: ['PDF', 'Excel'], // Explicitly matches required export options[cite: 2]
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);