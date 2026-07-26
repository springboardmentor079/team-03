const Resource = require('../models/resouce');

exports.createResource = async (req, res) => {
  try {
    const newResource = new Resource(req.body);
    await newResource.save();
    res.status(201).json({ message: 'Resource created successfully', resource: newResource });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create resource', error: err.message });
  }
};

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('currentProject', 'name location');
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resources', error: err.message });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('currentProject', 'name location');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (err) {
    res.status(400).json({ message: 'Invalid resource ID', error: err.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    ).populate('currentProject', 'name location');

    if (!updated) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
};