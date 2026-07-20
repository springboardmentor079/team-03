// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
userSchema.pre('save', async function() {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return; // Just return to proceed
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  } catch (error) {
    throw error; // Throwing an error automatically halts saving and passes it to the promise rejection
  }
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Plain text input:', candidatePassword);
  console.log('Stored hash in DB:', this.password);
  
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log('Does it match?:', isMatch);
  
  return isMatch;
};
module.exports = mongoose.model('User', userSchema);