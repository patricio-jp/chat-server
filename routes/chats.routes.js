const express = require('express');

const router = express.Router();

// Controladores (deberías implementarlos en un archivo separado)
const {
    getAllChats,
    getChatById,
    createChat,
    updateChat,
    deleteChat
} = require('../controllers/chat.controller');

// Obtener todos los chats
router.get('/', getAllChats);

// Obtener un chat por ID
//router.get('/:id', getChatById);

// Crear un nuevo chat
router.post('/', createChat);

// Actualizar un chat existente
//router.put('/:id', updateChat);

// Eliminar un chat
//router.delete('/:id', deleteChat);

module.exports = router;
