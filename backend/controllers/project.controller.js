const Project = require('../models/project');

// POST /api/projects
// Replace your exports.createProject with this:
exports.createProject = async (req, res) => {
  try {
    // 1. Extract the exact fields Austin's schema requires
    const { name, category, status, location, startDate, manager } = req.body;

    // 2. Map them correctly to the MongoDB Model
    const newProject = new Project({ 
      name, 
      category, 
      status, 
      location, 
      startDate, 
      manager 
    });

    // 3. Save to database
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};