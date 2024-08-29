const { sendEmail } = require('../utils/emailHelper');
const Notification = require('../models/Notification');
const User = require('../models/User');

const sendNotificationEmail = async (userId, message) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Send the email notification to the user
    await sendEmail(user.email, 'Bank Notification', message);

    // Save the notification to the database
    const notification = new Notification({ userId, message });
    await notification.save();
  } catch (error) {
    console.error('Error sending notification email:', error.message);
  }
};

// Function to notify admins if a user's balance turns to zero
const checkAndNotifyAdmins = async () => {
  try {
    const usersWithZeroBalance = await User.find({ balance: 0 });
    const admins = await User.find({ role: 'admin' });

    if (usersWithZeroBalance.length === 0) {
      console.log('No users with zero balance found.');
      return; // No users with zero balance, exit the function
    }

    if (admins.length === 0) {
      console.log('No admins found to notify.');
      return; // No admins to notify, exit the function
    }

    console.log(`Found ${usersWithZeroBalance.length} users with zero balance.`);
    console.log(`Found ${admins.length} admins to notify.`);

    for (const user of usersWithZeroBalance) {
      const message = `User ${user.name} (Email: ${user.email}) has a zero balance.`;
      for (const admin of admins) {
        try {
          await sendEmail(admin.email, 'Zero Balance Alert', message);
          const notification = new Notification({ userId: admin._id, message });
          await notification.save();
          console.log(`Notification sent to admin ${admin.email} about user ${user.name}.`);
        } catch (emailError) {
          console.error(`Failed to send email to admin ${admin.email}:`, emailError.message);
        }
      }
    }
  } catch (error) {
    console.error('Error checking and notifying admins:', error.message);
  }
};


module.exports = { sendNotificationEmail, checkAndNotifyAdmins };
