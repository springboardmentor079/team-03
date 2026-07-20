const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/project.controller');

router.post('/', createProject);
router.get('/', getProjects);

module.exports = router;