const Milestone = require('../models/projectmilestone');

exports.createMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestoneData = { ...req.body, project: projectId };

    const newMilestone = new Milestone(milestoneData);
    await newMilestone.save();

    res.status(201).json({ message: 'Milestone created successfully', milestone: newMilestone });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create milestone', error: err.message });
  }
};

exports.getProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestones = await Milestone.find({ project: projectId }).sort({ dueDate: 1 });
    res.status(200).json(milestones);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch milestones', error: err.message });
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.status === 'Approved') {
      updates.completedAt = new Date();
    }

    const updated = await Milestone.findByIdAndUpdate(
      req.params.id,
      updates,
      {  returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteMilestone = async (req, res) => {
  try {
    const deleted = await Milestone.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.status(200).json({ message: 'Milestone deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
};