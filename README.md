# Chat Server

Este proyecto es un servidor de chat en tiempo real que permite la comunicación entre múltiples usuarios. Los usuarios pueden participar en chats individuales o en grupos, ofreciendo una experiencia de mensajería instantánea eficiente y escalable.

## Características

-   **Chat individual**: Comunicación privada entre dos usuarios.
-   **Chat grupal**: Interacción en tiempo real entre varios usuarios en un grupo.
-   **Escalabilidad**: Diseñado para manejar múltiples conexiones simultáneas.

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

## Eventos WebSocket

### Eventos que escucha el servidor

-   **createChat**

    -   **Descripción:** Crear un nuevo chat (privado o grupal).
    -   **Datos requeridos:**
        ```json
        {
            "isGroup": true, // Opcional, true para grupo, false o no enviar para chat privado
            "name": "Nombre del grupo", // Opcional, solo para grupos
            "participants": ["userId1", "userId2"] // Array de IDs de usuarios (sin incluir al usuario actual, se agrega automáticamente)
        }
        ```

-   **sendMessage**

    -   **Descripción:** Enviar un mensaje a un chat.
    -   **Datos requeridos:**
        ```json
        {
            "from": "userId", // Opcional, si no se envía se toma del socket autenticado
            "to": "chatId", // ID del chat destino
            "content": "Texto del mensaje"
        }
        ```

-   **whoIsOnline**
    -   **Descripción:** Solicita la lista de contactos conectados del usuario autenticado.
    -   **Datos requeridos:** _Ninguno_

---

### Eventos emitidos por el servidor

-   **newChat**

    -   **Descripción:** Notifica a los participantes sobre la creación de un nuevo chat.
    -   **Datos enviados:** Objeto `Chat` completo (ver modelo).

-   **error:createChat**

    -   **Descripción:** Error al crear un chat.
    -   **Datos enviados:**
        ```json
        {
            "error": "Mensaje de error",
            "chatId": "chatId" // Opcional, si ya existe un chat con los mismos participantes
        }
        ```

-   **message**

    -   **Descripción:** Notifica a los usuarios de un nuevo mensaje en un chat.
    -   **Datos enviados:**
        ```json
        {
            "chatId": "chatId",
            "from": "userId",
            "content": "Texto del mensaje"
        }
        ```

-   **error:sendMessage**

    -   **Descripción:** Error al enviar un mensaje.
    -   **Datos enviados:**
        ```json
        {
            "error": "Mensaje de error"
        }
        ```

-   **onlineUsers**

    -   **Descripción:** Devuelve la lista de contactos conectados del usuario.
    -   **Datos enviados:** Array de IDs de usuarios conectados.

-   **userOnline**

    -   **Descripción:** Notifica que un usuario se ha conectado.
    -   **Datos enviados:** `userId` del usuario conectado.

-   **userOffline**
    -   **Descripción:** Notifica que un usuario se ha desconectado.
    -   **Datos enviados:** `userId` del usuario desconectado.

---

Consulta estos eventos para integrar correctamente el cliente con el servidor de chat.

¡Listo! Ahora puedes usar el servidor para gestionar chats en tiempo real.
