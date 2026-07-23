const Project = require("../models/project");

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      budget,
      category,
      status,
    } = req.body;

    const newProject = new Project({
      title,
      description,
      startDate,
      endDate,
      budget,
      category,
      status,
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};