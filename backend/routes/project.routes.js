const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.post('/', authMiddleware, authorizeRoles('Admin', 'Project Manager'), projectController.createProject);
router.put('/:id', authMiddleware, authorizeRoles('Admin', 'Project Manager'), projectController.updateProject);
router.delete('/:id', authMiddleware, authorizeRoles('Admin'), projectController.deleteProject);

module.exports = router;