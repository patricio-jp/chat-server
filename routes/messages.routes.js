const express = require('express');
const router = express.Router();

// Controladores (deberías implementarlos en un archivo separado)
const {
    getMessagesByChat,
    getMessageById,
    createMessage,
    updateMessage,
    deleteMessage
} = require('../controllers/messages.controller');

// Obtener todos los mensajes
router.get('/', getMessagesByChat);

// Obtener un mensaje por ID
//router.get('/:id', getMessageById);

// Crear un nuevo mensaje
//router.post('/', createMessage);

// Actualizar un mensaje existente
//router.put('/:id', updateMessage);

// Eliminar un mensaje
//router.delete('/:id', deleteMessage);

module.exports = router;
