const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Imports Austin's User model

// ==========================================
// LOGIN ENDPOINT
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Compare the typed password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate a JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'supersecretfallbackkey', 
      { expiresIn: '1d' }
    );

    // 4. Send the token and user data back to your React frontend
   
    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName, // Changed 'name' to 'fullName'
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `1Server Error: ${error.message}`});
  }
});

// ==========================================
// REGISTER ENDPOINT
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { fullName:fullname, email, password, role } = req.body;
    console.log(1);

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log(2);

    // 2. Create the new user (Mongoose pre-save hook will automatically hash the password)
    const newUser = new User({
      fullName: fullname,
      email,
      password, // Passed as plain text so the pre-save hook hashes it once
      role: role || 'Site Engineer' // Fallback default role
    });

    // 3. Save to database
    await newUser.save();
    console.log('User registered and saved successfully:', newUser);

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

module.exports = router;