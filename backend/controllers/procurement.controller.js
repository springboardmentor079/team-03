const Procurement = require('../models/procurement');

const createPurchaseOrder = async (req, res) => {
  try {
    const { project, vendorName, category, totalAmount, status } = req.body;

    const procurement = await Procurement.create({
      project,
      vendorName,
      category,
      totalAmount,
      status,
      requestedBy: req.user.id,
    });

    res.status(201).json(procurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllProcurements = async (req, res) => {
  try {
    const procurements = await Procurement.find()
      .populate('projectId')
      .populate('requestedBy', '-password');
    res.status(200).json(procurements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProcurement = async (req, res) => {
  try {
    const updatedProcurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    if (!updatedProcurement) {
      return res.status(404).json({ message: 'Procurement order not found' });
    }

    res.status(200).json(updatedProcurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const ALLOWED_STATUSES = ['Pending Approval', 'Approved', 'Ordered', 'Delivered'];

const updateProcurementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const procurement = await Procurement.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!procurement) {
      return res.status(404).json({ message: 'Procurement record not found' });
    }

    res.status(200).json(procurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

const deleteProcurementOrder = async (req, res) => {
  try {
    const deleted = await Procurement.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Procurement order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllProcurements,
  updateProcurement,
  deleteProcurementOrder,
  updateProcurementStatus,
  deleteProcurement,
};

