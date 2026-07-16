const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description, location, manager, category, status, startDate, endDate } = req.body;

    const newProject = new Project({
      name,
      description,
      location,
      manager,
      category,
      status,
      startDate,
      endDate
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('manager', 'fullName email role');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};