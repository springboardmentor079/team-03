const Procurement = require('../models/procurement');

const createPurchaseOrder = async (req, res) => {
  try {
    const { project, vendorName, category, totalAmount, status } = req.body;

    const procurement = await Procurement.create({
      project,
      vendorName,
      category,
      totalAmount,
      status, // optional — schema defaults to 'Requested' if omitted
      requestedBy: req.user.id, // taken from the verified JWT, never trusted from the request body
    });

    res.status(201).json(procurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllProcurements = async (req, res) => {
  try {
    const procurements = await Procurement.find()
      .populate('project')
      .populate('requestedBy', '-password'); // exclude password hash if User model has one
    res.status(200).json(procurements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllProcurements,
};
