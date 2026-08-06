const mongoose = require('mongoose');
const Procurement = require('../models/procurement');

const ALLOWED_STATUSES = [
  'Pending Approval',
  'Approved',
  'Ordered',
  'Delivered',
];

const createPurchaseOrder = async (req, res) => {
  try {
    const {
      projectId,
      vendorName,
      itemName,
      quantity,
      estimatedCost,
      procurementCategory,
      status,
    } = req.body;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const procurement = await Procurement.create({
      projectId,
      vendorName,
      itemName,
      quantity,
      estimatedCost,
      procurementCategory,
      status,
      requestedBy: req.user.id,
    });

    return res.status(201).json(procurement);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getAllProcurements = async (req, res) => {
  try {
    const procurements = await Procurement.find()
      .populate('projectId')
      .populate('requestedBy', '-password');

    return res.status(200).json(procurements);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateProcurementStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const procurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!procurement) {
      return res.status(404).json({ message: 'Procurement record not found' });
    }

    return res.status(200).json(procurement);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndDelete(req.params.id);

    if (!procurement) {
      return res.status(404).json({ message: 'Procurement record not found' });
    }

    return res.status(200).json({
      message: 'Procurement record deleted successfully',
      deletedId: procurement._id,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllProcurements,
  updateProcurementStatus,
  deleteProcurement,
};