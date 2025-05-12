const Message = require('../models/message.model');

// GET /chats/:chatId/messages
exports.getMessagesByChat = async (req, res) => {
    try {
        const  chatId  = req.query.chatid;
        const messages = await Message.find({ chat: chatId }).populate('sender', 'username').sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving messages' });
    }
};
exports.createMessage = async (req, res) => {
    try {
        const { chatId } = req.query.chatid;
        const { sender, content } = req.body;

        // Crear el mensaje con la información recibida
const message = new Message({
      chat: chatId,
      sender: sender,
      content: content.trim(),
    });

        const savedMessage = await message.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error creating message' });
    }
};

