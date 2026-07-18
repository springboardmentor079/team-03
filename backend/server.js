const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');// Required to allow React to talk to Express
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors()); 
app.use(express.json()); // Required to parse JSON payloads from frontend forms
app.use('/api/auth', authRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then((conn) => { 
    // Day 1 Expected Outcome: Success Log
    // Fixed string interpolation using backticks
    console.log(`Database Connected: ${conn.connection.host}`); 
  })
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
  });

app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`);
});
