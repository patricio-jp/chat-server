
const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.getAllChats = async (req, res) => {
    try {
        const userId = req.query.userid;
        // Validar que userId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido.' });
        }

        // Buscar chats donde el usuario esté participando
        //const chats = await Chat.find({ participants: $in:[userId] });
        const chats = await Chat.find({
      participants: { $in: [ userId ] }
    })
    .populate('participants', 'username');

        res.status(200).json(chats);
    } catch (err) {
        console.error('Error al obtener los chats del usuario:', err);
        res.status(500).json({ message: 'No se pudieron obtener los chats.' });
    }
};


exports.createChat = async (req, res) => {
  try {
    const { participants, name, isGroup } = req.body;

    // 1) Validaciones básicas
    if (!Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({ message: 'Debes enviar al menos 2 participantes.' });
    }
    // Convertir a ObjectId si vienen como strings
    const participantIds = participants.map(id => mongoose.Types.ObjectId(id));

    // 2) Determinar si es grupo
    const groupFlag = isGroup === true || participantIds.length > 2;

    // 3) Si es grupo, exigir nombre
    if (groupFlag && (!name || name.trim() === '')) {
      return res.status(400).json({ message: 'Un chat de grupo requiere un nombre.' });
    }

    // 4) Para chats 1-a-1: buscar si ya existe
    if (!groupFlag) {
      const existing = await Chat.findOne({
        isGroup: false,
        participants: { 
          $all: participantIds, 
          $size: 2 
        }
      });
      if (existing) {
        return res.status(200).json(existing);
      }
    }

    // 5) Crear el chat
    const newChat = new Chat({
      isGroup: groupFlag,
      name: groupFlag ? name : undefined,
      participants: participantIds,
    });
    await newChat.save();

    res.status(201).json(newChat);

  } catch (err) {
    console.error('Error al crear el chat:', err);
    res.status(500).json({ message: 'No se pudo crear el chat.' });
  }
};