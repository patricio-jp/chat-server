require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');

/* const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes'); */

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

require('./config/database')(); // Conexión a MongoDB

app.use(cors());
app.use(express.json());

/* app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes); */

// Conexión por WebSocket
io.on('connection', socket => {
  console.log('🔌 Nuevo usuario conectado');

  socket.on('sendMessage', ({ from, to, content }) => {
    io.emit(`message:${to}`, { from, content }); // Reenvía al destinatario
    // Acá podés guardar el mensaje en MongoDB también
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
