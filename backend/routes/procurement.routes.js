const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  createPurchaseOrder,
  getAllProcurements,
  updateProcurementStatus,
} = require('../controllers/procurement.controller');

router.get('/', authMiddleware, getAllProcurements);
router.post('/', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), createPurchaseOrder);
router.put('/:id/status', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), updateProcurementStatus);

module.exports = router;
