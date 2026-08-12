const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Upload a document and create its DB record
// @route   POST /api/documents/upload
// @access  Private (expects multipart/form-data, field name: "file")
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Use field name "file".' });
    }

    const { title, category, project } = req.body;

    if (!title || !category || !project) {
      // Clean up the file we just saved, since we're rejecting the request
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'title, category, and project are required' });
    }

    const document = await Document.create({
      title,
      category,
      project,
      fileName: req.file.originalname,
      fileUrl: `/uploads/documents/${req.file.filename}`,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    // Automated event trigger: notify the uploader (and optionally project
    // watchers/managers — swap req.user.id for a list of project member IDs
    // once you have access to the Project model's member/manager fields).
    await createNotification({
      recipient: req.user.id,
      type: 'DOCUMENT_UPLOADED',
      message: `Document "${document.title}" was uploaded successfully.`,
      linkUrl: `/documents/${document._id}`,
    });

    res.status(201).json({ message: 'Document uploaded', document });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
};

// @desc    Get documents, optionally filtered by project and/or category
// @route   GET /api/documents?project=<id>&category=<name>
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.category) filter.category = req.query.category;

    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email')
      .populate('project', 'name');

    res.status(200).json({ count: documents.length, documents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
  }
};

// @desc    Delete a document (file from disk + DB record)
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remove the physical file from disk (fileUrl looks like /uploads/documents/<name>)
    const filePath = path.join(__dirname, '..', document.fileUrl);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Failed to delete file from disk:', err.message);
      }
    });

    await document.deleteOne();

    res.status(200).json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
};
