// services/chatService.js
const Chat = require('../models/Chat');

const sendMessage = async (senderId, receiverId, message) => {
  const chat = new Chat({ senderId, receiverId, message });
  await chat.save();
  return chat;
};

const getMessages = async (userId) => {
  return Chat.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).sort({ timestamp: -1 });
};

module.exports = { sendMessage, getMessages };
