# Chat Server

Este proyecto es un servidor de chat en tiempo real que permite la comunicación entre múltiples usuarios. Los usuarios pueden participar en chats individuales o en grupos, ofreciendo una experiencia de mensajería instantánea eficiente y escalable.

## Características
- **Chat individual**: Comunicación privada entre dos usuarios.
- **Chat grupal**: Interacción en tiempo real entre varios usuarios en un grupo.
- **Escalabilidad**: Diseñado para manejar múltiples conexiones simultáneas.

## Instalación

1. Clona este repositorio:
  ```bash
  git clone https://github.com/patricio-jp/chat-server.git
  cd chat-server
  ```

2. Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, instala las dependencias:
  ```bash
  npm install
  ```

3. Configura las variables de entorno en un archivo `.env` (puedes usar el archivo `.env.example` como referencia).

## Levantar el servidor

1. Inicia el servidor en modo desarrollo:
  ```bash
  npm run dev
  ```

2. O inicia el servidor en modo producción:
  ```bash
  npm start
  ```

3. El servidor estará disponible en `http://localhost:3000` (o el puerto configurado).

¡Listo! Ahora puedes usar el servidor para gestionar chats en tiempo real.
