const mongoose = require('mongoose');
const Invoice = require('../models/invoice');
const Procurement = require('../models/procurement');

const ALLOWED_PAYMENT_STATUSES = ['Paid', 'Pending', 'Overdue'];

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('purchaseOrderId')
      .sort({ createdAt: -1 });

    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { purchaseOrderId, vendorName, amount, dueDate, paymentStatus } = req.body;

    if (!mongoose.isValidObjectId(purchaseOrderId)) {
      return res.status(400).json({ message: 'Invalid purchase order ID' });
    }

    const purchaseOrder = await Procurement.findById(purchaseOrderId);

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    const invoice = await Invoice.create({
      purchaseOrderId,
      vendorName,
      amount,
      dueDate,
      paymentStatus,
    });

    return res.status(201).json(invoice);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_PAYMENT_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid payment status. Must be one of: ${ALLOWED_PAYMENT_STATUSES.join(', ')}`,
      });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res.status(200).json(invoice);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllInvoices,
  createInvoice,
  updateInvoiceStatus,
};