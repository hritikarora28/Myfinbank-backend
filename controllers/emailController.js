// controllers/emailController.js
const { sendNotificationEmail, checkAndNotifyAdmins } = require('../services/emailService');

// Send an email notification to a specific user
exports.sendEmailNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    await sendNotificationEmail(userId, message);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check for users with zero balance and notify admins
exports.notifyAdminsForZeroBalance = async (req, res) => {
  try {
    await checkAndNotifyAdmins();
    res.status(200).json({ message: 'Admins notified for zero balance users' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ sentAt: -1 }); // Fetch and sort notifications by date
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

