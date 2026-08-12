const Notification = require('../models/Notification');

/**
 * Create a notification. Use this from ANY other controller to trigger
 * an automated notification (purchase order approved, reorder warning,
 * milestone updated, document uploaded, etc.)
 *
 * @param {Object} params
 * @param {String|ObjectId} params.recipient - User to notify (required)
 * @param {String|ObjectId} [params.sender] - User who caused the event
 * @param {'INFO'|'WARNING'|'ALERT'|'DOCUMENT_UPLOADED'} [params.type='INFO']
 * @param {String} params.message - Notification text (required)
 * @param {String} [params.linkUrl] - Optional frontend deep link
 * @returns {Promise<Object|null>} The created notification, or null on failure
 */
const createNotification = async ({ recipient, sender, type = 'INFO', message, linkUrl }) => {
  try {
    if (!recipient || !message) {
      console.error('createNotification: recipient and message are required');
      return null;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      linkUrl,
    });

    return notification;
  } catch (error) {
    // Notification failures should never break the primary business action
    // (e.g. approving a purchase order should still succeed even if this fails)
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

/**
 * Create the same notification for multiple recipients at once
 * (e.g. notify every project manager when a milestone is updated).
 *
 * @param {Array<String|ObjectId>} recipients
 * @param {Object} params - same shape as createNotification, minus `recipient`
 */
const notifyMany = async (recipients = [], params) => {
  const results = await Promise.all(
    recipients.map((recipient) => createNotification({ ...params, recipient }))
  );
  return results.filter(Boolean);
};

module.exports = { createNotification, notifyMany };
