const { sendMessage, getMessages } = require('../services/chatService');

exports.sendMessage = async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;

  try {
    const chat = await sendMessage(senderEmail, receiverEmail, message);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const messages = await getMessages(userEmail);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
