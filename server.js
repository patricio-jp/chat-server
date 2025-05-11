require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');

const authRoutes = require('./routes/auth.routes');
const chatsRoutes = require('./routes/chats.routes');
const messageRoutes = require('./routes/messages.routes');
const { socketAuthMiddleware } = require('./middlewares/auth.middleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

require('./config/database')(); // Conexión a MongoDB

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
//app.use('/api/chats', chatsRoutes);
//sapp.use('/api/messages', messageRoutes);

const onlineUsers = new Map(); // userId => Set(socketIds)

io.use(socketAuthMiddleware);

// Conexión por WebSocket
io.on("connection", (socket) => {
  console.log("🔌 Nuevo usuario conectado ", socket.user);
  const userId = socket.user.id;

  // Importar los modelos
  const User = require("./models/user.model");
  const Chat = require("./models/chat.model");
  const Message = require("./models/message.model");

  // Cuando el usuario se conecta, agregarlo a la lista de usuarios online
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
    io.emit("userOnline", userId); // Notificar que dicho usuario se conectó
  }
  onlineUsers.get(userId).add(socket.id);

  socket.on("createChat", async ({ isGroup, name, participants }) => {
    //console.log({ isGroup, name, participants });
    if (!Array.isArray(participants)) {
      console.error(
        "participants debe ser un arreglo de strings con ids de usuario"
      );
      return socket.emit("error:createChat", {
        error: "participants debe ser un arreglo de strings con ids de usuario"
      });
    }
    participants.push(socket.user.id); // Agregar al usuario que emitió el evento como participante

    isGroup = isGroup == true || participants.length > 2 ? true : false

    // Verificar si ya existe un chat con los mismos participantes, solo para chats entre 2 personas
    if (participants.length === 2) {
      const existingChat = await Chat.findOne({
        participants: { $all: participants, $size: participants.length },
      });

      if (existingChat) {
        console.log("Ya existe un chat con los mismos participantes");
        return socket.emit("error:createChat", {
          error: "Ya existe un chat con los mismos participantes",
          chatId: existingChat._id,
        });
      }
    }
    try {
      const newChat = new Chat({
        isGroup,
        name: isGroup ? name : undefined, // Asignar nombre solo si es un grupo
        participants,
      });
      await newChat.save();

      participants.forEach(async (participant) => {
        // Emitir el evento 'newChat' solo a los usuarios correspondientes
        const userSockets = onlineUsers.get(participant);
        if (userSockets) {
          userSockets.forEach((socketId) => {
            io.to(socketId).emit("newChat", newChat);
          });
        }

        // Asignar el chat a cada participante
        const user = await User.findById(participant);
        if (user) {
          user.chats.push(newChat);
          await user.save();
        }
      });
    } catch (error) {
      console.error(error);
      io.emit("error:createChat", { error });
    }
  });

  socket.on("sendMessage", async ({ from, to, content }) => {
    //console.log({ from, to, content });

    if (!from) {
      from = socket.user.id;
    }

    io.emit(`message:${to}`, { from, content }); // Reenvía al destinatario

    // Guardado en la base de datos
    try {
      const chat = await Chat.findOne({
        _id: to,
      });
      if (!chat) {
        console.error("No existe el chat con el id proporcionado");
        return io.emit("error:sendMessage", {
          error: "No existe el chat con el id proporcionado",
        });
      }
      const newMessage = new Message({
        sender: from,
        content,
        chat: to,
      });
      await newMessage.save();
    } catch (error) {
      console.error(error);
      return io.emit("error:sendMessage", { error });
    }
  });

  // Usuarios conectados
  socket.on("whoIsOnline", async () => {
    // Supón que tienes un modelo User y cada usuario tiene un array de contactos (por ejemplo, user.contacts)
    const userId = socket.user.id;
    //const user = await User.findById(userId).select('contacts');
    //if (!user) return socket.emit('onlineUsers', []);

    //const online = user.contacts.filter(id => onlineUsers.has(id.toString()));
    socket.emit("onlineUsers", online);
  });

  // Cuando se desconecta un usuario
  socket.on("disconnect", () => {
    const userSockets = onlineUsers.get(userId);
    if (!userSockets) return;

    console.log("Usuario desconectado ", socket.user.id);
    userSockets.delete(socket.id);
    if (userSockets.size === 0) {
      // Si el usuario no tiene mas sockets abiertos
      onlineUsers.delete(userId);
      io.emit("userOffline", userId); // Notificar que el usuario se desconectó
    }
  });
});

const PORT = process.env.APP_PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
