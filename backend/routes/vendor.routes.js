const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendor.controller');

router.get('/', authMiddleware, getAllVendors);

router.post(
  '/',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager'),
  createVendor
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager'),
  updateVendor
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager'),
  deleteVendor
);

module.exports = router;