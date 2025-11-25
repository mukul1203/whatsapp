1. node version 20
2. npm version 11.6.3
3. cd chat_server
4. nvm use
3. npm i -g wscat
4. wscat -c ws://localhost:8080
5. docker build -t chat_server .
6. docker run --name chat1 -p 8081:8080 chat_server
7. docker run --name chat2 -p 8082:8080 chat_server
8. wscat -c ws://localhost:8081?user_id=asdf-werwe-serwer
9. after connecting, you can send message like this:
{"from": "d9d74fec-ec86-4d1a-9a9b-de08b9c93490", "to":"8e89e5d2-4f2c-4bf5-b422-6d3297911cae", "content": "Hi make! lice here!"}

