const Inventory = require('../models/inventory');

exports.createInventoryItem = async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json({ message: 'Inventory item created successfully', item: newItem });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create inventory item', error: err.message });
  }
};

exports.getInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.find().populate('project', 'name location');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory items', error: err.message });
  }
};

exports.getInventoryItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('project', 'name location');
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid inventory item ID', error: err.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    ).populate('project', 'name location');

    if (!updated) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
};