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

// NOTE: Task doc listed a different enum ("Pending Approval", "Approved", "Ordered",
// "Delivered") than the actual procurement.js schema enum below. Validating against
// the doc's list would let requests through here only to fail Mongoose's own schema
// validation with a confusing error. Using the real schema enum until Austin/Stalin
// confirm which one is correct — swap this array if the schema changes.
const ALLOWED_STATUSES = ['Requested', 'Ordered', 'Invoiced', 'Delivered', 'Cancelled'];

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

module.exports = {
  createPurchaseOrder,
  getAllProcurements,
  updateProcurementStatus,
};
