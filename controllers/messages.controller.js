const Message = require('../models/message.model');

// GET /chats/:chatId/messages
exports.getMessagesByChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving messages' });
    }
};
exports.createMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { sender, content, participants } = req.body;

        // Crear el mensaje con la información recibida
        const newMessage = new Message({
            chat: chatId,
            sender,
            content,
            participants
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error creating message' });
    }
};

