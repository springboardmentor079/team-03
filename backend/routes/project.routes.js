const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);

module.exports = router;