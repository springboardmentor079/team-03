// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password string is required'] // Stores bcrypt hashed string
  },
  role: {
    type: String,
    required: [true, 'Role type is required for RBAC'],
    // Enforces the exact project roles from the specifications document[cite: 2]
    enum: ['Administrator', 'Project Manager', 'Site Engineer', 'Contractor', 'Worker', 'Client'],
    default: 'Site Engineer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);