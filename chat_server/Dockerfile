FROM node:20-alpine

# Working dir inside the container - The folder where we want our code to go
WORKDIR /chat_server

COPY package*.json ./
RUN npm install

# Copy all stuff from current folder to the working dir inside container
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]

