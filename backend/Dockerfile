FROM node:latest
WORKDIR /app

# Backend installieren
COPY ./package*.json ./
RUN npm install

# Backend-Code & Angular-Frontend
COPY ./src ./src

CMD ["node", "src/index.js"]
