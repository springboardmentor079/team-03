const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// controllers/user.controller.js

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // 2. Create the user passing the PLAIN-TEXT password.
    // Austin's pre-save hook in User.js will catch this and hash it securely!
    user = new User({ 
      fullName, 
      email, 
      password, // Send plain text
      role: role || 'worker' 
    });
    
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};// controllers/user.controller.js
// controllers/user.controller.js

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and explicitly select password in case his schema hides it by default
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2. Use Austin's built-in schema method to verify the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};