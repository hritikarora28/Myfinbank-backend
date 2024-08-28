// controllers/emailController.js
const { sendNotificationEmail } = require('../services/emailService');

exports.sendEmailNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    await sendNotificationEmail(userId, message);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
