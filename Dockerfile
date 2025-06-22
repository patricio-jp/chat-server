#----------------------------------------------
FROM node:20-alpine

# Instalar dependencias de compilación necesarias para bcrypt
RUN apk add --no-cache python3 make g++ \
    && addgroup -g 1001 jycuser \
    && adduser -u 1001 -G jycuser -s /bin/sh -D jycuser

USER jycuser

ENV NODE_ENV=production
ENV APP_PORT=3001

WORKDIR /app

# Copiar solo los archivos de dependencias primero
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm rebuild bcrypt

# Ahora copiar el resto del código fuente
COPY . .

EXPOSE ${APP_PORT}

CMD ["node", "server.js"]
