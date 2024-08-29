const Chat = require('../models/Chat');

const sendMessage = async (senderEmail, receiverEmail, message) => {
  const chat = new Chat({ senderEmail, receiverEmail, message });
  await chat.save();
  return chat;
};

const getMessages = async (userEmail) => {
  return Chat.find({
    $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }],
  }).sort({ timestamp: -1 });
};

module.exports = { sendMessage, getMessages };
