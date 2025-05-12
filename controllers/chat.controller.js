
const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.getAllChats = async (req, res) => {
    try {
        const userId = req.query.userid;
        console.log('userId:', userId);
        // Validar que userId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido.' });
        }
console.log('2userId:', userId);
        // Buscar chats donde el usuario esté participando
        const chats = await Chat.find({ participants: userId });
       //const chats = await Chat.find({ participants: { $in: [ userId ] } }).populate('participants', 'username');
        res.status(200).json(chats);
    } catch (err) {
        console.error('Error al obtener los chats del usuario:', err);
        res.status(500).json({ message: 'No se pudieron obtener los chats.' });
    }
};


exports.createChat = async (req, res) => {
  try {
    const userId = req.query.userid;
    const { participants, name, isGroup } = req.body;

    // 1) Validaciones básicas
    if (!Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({ message: 'Debes enviar al menos 2 participantes.' });
    }
    // Convertir a ObjectId si vienen como strings
    //const participantIds = participants.map(id => mongoose.Types.ObjectId(id));

    // 2) Determinar si es grupo
    const groupFlag = isGroup === true || participants.length > 2;

    // 3) Si es grupo, exigir nombre
    if (groupFlag && (!name || name.trim() === '')) {
      return res.status(400).json({ message: 'Un chat de grupo requiere un nombre.' });
    }

    // 4) Para chats 1-a-1: buscar si ya existe
    if (!groupFlag) {
      const existing = await Chat.findOne({
        isGroup: false,
        participants: { 
          $all: participants, 
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
      participants: participants,
    });
    await newChat.save();
participants.forEach(async (participant) => {
        // Asignar el chat a cada participante
        const user = await User.findById(participant);
        user.chats.push(newChat);
        await user.save();
      });
    res.status(201).json(newChat);

  } catch (err) {
    console.error('Error al crear el chat:', err);
    res.status(500).json({ message: 'No se pudo crear el chat.' });
  }
};
