const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
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
    required: [true, 'Password string is required']
  },
  role: {
    type: String,
    required: [true, 'Role type is required for RBAC'],
    enum: ['Administrator', 'Project Manager', 'Site Engineer', 'Contractor', 'Worker', 'Client'],
    default: 'Site Engineer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password before saving to MongoDB
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare candidate password with the hashed password during Login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);