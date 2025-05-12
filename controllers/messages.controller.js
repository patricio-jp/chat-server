const Messages = require('../models/message.model');

exports.getMessagesFromChat = async (req, res) => {
  try {
    const chatId = req.params.chatId; // Asegúrate de que req.user.id esté disponible por el middleware de autenticación
    const messages = await Messages.find({
      chat: chatId
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
}
