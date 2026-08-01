const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  createPurchaseOrder,
  getAllProcurements,
  updateProcurement,
  deleteProcurementOrder,
} = require('../controllers/procurement.controller');

router.get('/', authMiddleware, getAllProcurements);
router.post('/', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), createPurchaseOrder);
router.put('/:id', authMiddleware, updateProcurement);
router.delete('/:id', authMiddleware, deleteProcurementOrder);

module.exports = router;
