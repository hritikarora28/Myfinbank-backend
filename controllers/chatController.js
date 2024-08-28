// controllers/chatController.js
const { sendMessage, getMessages } = require('../services/chatService');

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const chat = await sendMessage(senderId, receiverId, message);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await getMessages(userId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
