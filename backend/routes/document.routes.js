const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload.middleware');
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require('../controllers/document.controller');

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.delete('/:id', deleteDocument);

module.exports = router;
