const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const {
  getAllInvoices,
  createInvoice,
  updateInvoiceStatus,
} = require('../controllers/invoice.controller');

router.get('/', authMiddleware, getAllInvoices);

router.post(
  '/',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager'),
  createInvoice
);

router.put(
  '/:id/status',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager'),
  updateInvoiceStatus
);

module.exports = router;