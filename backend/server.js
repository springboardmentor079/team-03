require('dotenv').config({ quiet: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const authRoutes = require('./routes/auth');
const milestoneRoutes = require('./routes/milestone.routes');
const resourceRoutes = require('./routes/resource.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const workforceRoutes = require('./routes/workforce.routes');
const procurementRoutes = require('./routes/procurement.routes');
const vendorRoutes = require('./routes/vendor.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const expenseRoutes = require('./routes/expense.routes');



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
app.use('/api', milestoneRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/workforce', workforceRoutes);
app.use('/api/procurements', procurementRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);

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