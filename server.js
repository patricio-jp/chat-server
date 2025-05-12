require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');

const authRoutes = require('./routes/auth.routes');
const chatsRoutes = require('./routes/chats.routes');
const messageRoutes = require('./routes/messages.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

require('./config/database')(); // Conexión a MongoDB

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/messages', messageRoutes);

const onlineUsers = new Map(); // userId => Set(socketIds)

// Conexión por WebSocket
io.on('connection', socket => {
  console.log('🔌 Nuevo usuario conectado');
  const userId = socket.userId;

  // Cuando el usuario se conecta, lo agregás a la lista de online
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
    io.emit('userOnline', userId); // Notificás que este user se conectó
  }
  onlineUsers.get(userId).add(socket.id);


  socket.on('sendMessage', ({ from, to, content }) => {
    io.emit(`message:${to}`, { from, content }); // Reenvía al destinatario
    // Acá podés guardar el mensaje en MongoDB también
  });


  // Usuarios conectados
  socket.on('whoIsOnline', ({ contactIds }) => {
    const online = contactIds.filter(id => onlineUsers.has(id));
    socket.emit('onlineUsers', online);
  });

  
  // Cuando se desconecta un usuario
  socket.on('disconnect', () => {
    const userSockets = onlineUsers.get(userId);
    if (!userSockets) return;

    userSockets.delete(socket.id);
    if (userSockets.size === 0) {
      onlineUsers.delete(userId);
      io.emit('userOffline', userId); // Notificás que este user se desconectó
    }
  });
});

const PORT = process.env.APP_PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
