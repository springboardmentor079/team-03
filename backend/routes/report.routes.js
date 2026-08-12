const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getReports,
  generateReport,
  deleteReport,
} = require('../controllers/report.controller');

router.use(authMiddleware);

router.get('/', getReports);
router.post('/', generateReport);
router.delete('/:id', deleteReport);

module.exports = router;
