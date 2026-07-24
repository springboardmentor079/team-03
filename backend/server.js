require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const authRoutes = require('./routes/auth');   
const milestoneRoutes = require('./routes/milestone.routes');
   // ← added

const app = express();

// Standard Middleware
app.use(express.json());
app.use(cors());

// Basic API Status Route
app.get('/api/status', (req, res) => {
  res.status(200).json({ message: 'Server is running smoothly' });
});

// Mount API Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api', milestoneRoutes);                         // ← added

// MongoDB Connection and Server Start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the .env file.");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });