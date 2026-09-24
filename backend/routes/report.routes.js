const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getReports,
  generateReport,
  deleteReport,
  exportReportPdf,
  exportReportExcel
} = require('../controllers/report.controller');

router.use(authMiddleware);

router.get('/', getReports);
router.post('/', generateReport);
router.delete('/:id', deleteReport);
router.get('/:id/export/pdf', exportReportPdf);
router.get('/:id/export/excel', exportReportExcel);

module.exports = router;
