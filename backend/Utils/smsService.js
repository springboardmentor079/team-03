let twilio;
try {
  twilio = require('twilio');
} catch (e) {
  twilio = null;
}

/**
 * Send an SMS alert (e.g., attendance warning, urgent procurement alert, safety update)
 * If Twilio environment variables are not configured, it logs the SMS content to console seamlessly.
 *
 * @param {Object} options
 * @param {String} options.to - Recipient phone number in E.164 format (+1234567890)
 * @param {String} options.message - SMS message body
 */
const sendSMS = async ({ to, message }) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (twilio && accountSid && authToken && fromNumber) {
      const client = twilio(accountSid, authToken);
      const res = await client.messages.create({
        body: message,
        from: fromNumber,
        to
      });

      console.log(`[SMSService] SMS sent successfully to ${to}. SID: ${res.sid}`);
      return { success: true, sid: res.sid };
    } else {
      console.log(`[SMSService - DEV FALLBACK] To: ${to} | Message: ${message}`);
      return { success: true, fallback: true };
    }
  } catch (error) {
    console.error('[SMSService Error]:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
