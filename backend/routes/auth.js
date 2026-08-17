const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Imports Austin's User model
const authMiddleware = require('../middleware/auth');

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

// ==========================================
// FORGOT PASSWORD ENDPOINT
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate crypto reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour validity
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
    
    // Dispatch Email
    const { sendEmail } = require('../Utils/emailService');
    await sendEmail({
      to: user.email,
      subject: 'BuildTrack Security - Password Reset Request',
      text: `Hello ${user.fullName},\n\nYou requested a password reset. Please click the link below to set a new password:\n\n${resetUrl}\n\nThis link is valid for 1 hour.`,
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.fullName},</p>
        <p>You requested a password reset for your BuildTrack account.</p>
        <p><a href="${resetUrl}" style="background:#00c938; color:white; padding:10px 20px; text-decoration:none; border-radius:6px; font-weight:bold;">Reset Password</a></p>
        <p>Or copy this link into your browser: <code>${resetUrl}</code></p>
      </div>`
    });

    res.status(200).json({ 
      message: 'Password recovery email sent successfully',
      resetToken // returned for easy testing/dev access
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// ==========================================
// RESET PASSWORD CONFIRMATION ENDPOINT
// ==========================================
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const crypto = require('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    user.password = password; // Pre-save hook will hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// ==========================================
// OAUTH GOOGLE LOGIN ENDPOINT
// ==========================================
router.post('/oauth/google', async (req, res) => {
  try {
    const { email, fullName, googleId, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'OAuth Google login requires email' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Register user via OAuth
      const randomPass = Math.random().toString(36).slice(-10) + 'A1!';
      user = new User({
        fullName: fullName || email.split('@')[0],
        email,
        password: randomPass,
        role: role || 'Site Engineer'
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretfallbackkey',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OAuth Google Login Error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// ==========================================
// PROFILE GET ENDPOINT
// ==========================================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// ==========================================
// PROFILE UPDATE ENDPOINT
// ==========================================
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already taken by another user' });
      }
      user.email = email;
    }

    if (fullName) {
      user.fullName = fullName;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

module.exports = router;