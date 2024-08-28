// services/emailService.js
const { sendEmail } = require('../utils/emailHelper');
const Notification = require('../models/Notification');
const User = require('../models/User');

const sendNotificationEmail = async (userId, message) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  await sendEmail(user.email, 'Bank Notification', message);

  const notification = new Notification({ userId, message });
  await notification.save();
};

module.exports = { sendNotificationEmail };
