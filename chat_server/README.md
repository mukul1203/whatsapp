1. node version 20
2. npm version 11.6.3
3. cd chat_server
4. nvm use
3. npm i -g wscat
4. wscat -c ws://localhost:8080
5. docker build -t chat_server .
6. docker run --name chat1 -p 8081:8080 chat_server
7. docker run --name chat2 -p 8082:8080 chat_server

