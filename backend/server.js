const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then((conn) => {
    // Day 1 Expected Outcome: Success Log
    console.log(`Database Connected: ${conn.connection.host}`);
  })
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});