const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, inventoryController.getInventoryItems);
router.get('/:id', authMiddleware, inventoryController.getInventoryItemById);
router.post('/', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), inventoryController.createInventoryItem);
router.put('/:id', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), inventoryController.updateInventoryItem);
router.delete('/:id', authMiddleware, authorizeRoles('Administrator'), inventoryController.deleteInventoryItem);

module.exports = router;