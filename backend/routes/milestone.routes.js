const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestone.controller');
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get(
  '/projects/:projectId/milestones',
  authMiddleware,
  milestoneController.getProjectMilestones
);

router.post(
  '/projects/:projectId/milestones',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager'),
  milestoneController.createMilestone
);

router.put(
  '/milestones/:id',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager', 'Site Engineer'),
  milestoneController.updateMilestone
);

router.delete(
  '/milestones/:id',
  authMiddleware,
  authorizeRoles('Administrator', 'Project Manager'),
  milestoneController.deleteMilestone
);

module.exports = router;