const Chat = require('../models/chat.model');

exports.getChats = async (req, res) => {
  try {
    const userId = req.user.id; // Asegúrate de que req.user.id esté disponible por el middleware de autenticación
    const chats = await Chat.find({ participants: userId });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los chats' });
  }
}
