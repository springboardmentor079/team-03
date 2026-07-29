const express = require('express');
const router = express.Router();
const workforceController = require('../controllers/workforce.controller');
const authMiddleware = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Worker CRUD
router.get('/', authMiddleware, workforceController.getWorkers);
router.get('/:id', authMiddleware, workforceController.getWorkerById);
router.post('/', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), workforceController.createWorker);
router.put('/:id', authMiddleware, authorizeRoles('Administrator', 'Project Manager'), workforceController.updateWorker);
router.delete('/:id', authMiddleware, authorizeRoles('Administrator'), workforceController.deleteWorker);

// Attendance, nested under a worker
router.post('/:workerId/attendance', authMiddleware, authorizeRoles('Administrator', 'Project Manager', 'Site Engineer'), workforceController.markAttendance);
router.get('/:workerId/attendance', authMiddleware, workforceController.getWorkerAttendance);
router.put('/attendance/:id', authMiddleware, authorizeRoles('Administrator', 'Project Manager', 'Site Engineer'), workforceController.updateAttendance);
router.delete('/attendance/:id', authMiddleware, authorizeRoles('Administrator'), workforceController.deleteAttendance);

module.exports = router;