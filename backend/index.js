require('dotenv').config();
//console.log('JWT_SECRET value:', process.env.JWT_SECRET);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/status', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});