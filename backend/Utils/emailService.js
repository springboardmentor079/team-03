let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

/**
 * Send an email notification or transactional email (e.g., password reset, milestone alert)
 * If SMTP environment variables are not configured, it logs the email content to console seamlessly.
 *
 * @param {Object} options
 * @param {String} options.to - Recipient email address
 * @param {String} options.subject - Email subject line
 * @param {String} options.text - Plain text content
 * @param {String} [options.html] - Optional HTML content
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (nodemailer && smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"BuildTrack Platform" <no-reply@buildtrack.com>',
        to,
        subject,
        text,
        html: html || text
      });

      console.log(`[EmailService] Email sent successfully to ${to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[EmailService - DEV FALLBACK] To: ${to} | Subject: ${subject}`);
      console.log(`[EmailService Content]:\n${text}`);
      return { success: true, fallback: true };
    }
  } catch (error) {
    console.error('[EmailService Error]:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
