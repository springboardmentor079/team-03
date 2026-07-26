const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, resourceController.getResources);
router.get('/:id', authMiddleware, resourceController.getResourceById);
router.post('/', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), resourceController.createResource);
router.put('/:id', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), resourceController.updateResource);
router.delete('/:id', authMiddleware, authorizeRoles('Administrator'), resourceController.deleteResource);

module.exports = router;