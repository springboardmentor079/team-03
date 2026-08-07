const Vendor = require('../models/vendor');

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    return res.status(200).json(vendors);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const { vendorName, contactEmail, contactPhone, category, performanceRating, status } = req.body;

    const existingVendor = await Vendor.findOne({
      contactEmail: contactEmail?.trim().toLowerCase(),
    });

    if (existingVendor) {
      return res.status(409).json({
        message: 'A vendor with this contact email already exists',
      });
    }

    const vendor = await Vendor.create({
      vendorName,
      contactEmail,
      contactPhone,
      category,
      performanceRating,
      status,
    });

    return res.status(201).json(vendor);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const allowedFields = [
      'vendorName',
      'contactEmail',
      'contactPhone',
      'category',
      'performanceRating',
      'status',
    ];

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid vendor fields provided for update' });
    }

    if (updates.contactEmail) {
      updates.contactEmail = updates.contactEmail.trim().toLowerCase();

      const existingVendor = await Vendor.findOne({
        contactEmail: updates.contactEmail,
        _id: { $ne: req.params.id },
      });

      if (existingVendor) {
        return res.status(409).json({
          message: 'A vendor with this contact email already exists',
        });
      }
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    return res.status(200).json(vendor);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    return res.status(200).json({
      message: 'Vendor deleted successfully',
      deletedId: vendor._id,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
};