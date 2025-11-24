# whatsapp
A chatting app (distributed, yet run locally)

## Goal 1
Setup a single nodejs chat server as docker container, with ability to chat using websockets. I should be able to send a ping to it and get a pong back.
The way to launch this server should be single line command to launch a docker conatiner. Dev contribution should also be easy. Contribute and build the image and run the container.
### Steps
1. Folder for chat server
2. Code for chat server with websockets
3. Docker stuff
4. Create image and run as container
5. Ping on port xyz, and get a response, via a wscat app

## Goal 2
Define a messaging json schema to enable chat between two clients connected to single chat server.
Send a message from client A to client B, and verify that B indeed got it.
### Steps
1. Maintain a map of client id to websocket for its connection, on chat server side. Let this be inmemory for now.
2. Modify the server code to parse the json schema for message, lookup the target websocket in the map, and relay the incoming message.
3. This would also need us to generate a unique id for a client whenever it connects to the chat server. (Ideally this id should not be generated every time client connects, rather it should be once, during login or first time connection, and saved with user db)
### Output
On running wscat -c ws://localhost:8080 from two terminals, each gets connected with different id, here 1 and 2.
Sending message from 2 like this:
{"from": 2, "to": 1, "content":"hello"}
reaches 1, and similarly vice versa.

## Goal 3
Have a auth server supporting signup/login functionality. This will be backed by a user database which must be persisted so we don't lose the info when we the server dies. This means having another container running auth server, which writes to a postgres db container.
This also means that the chat server should now read the client id from the message itself, and not calculate it.
This also means the user service instead would do the unique id generation, for now just a simple counter increment, maybe just utilising the DB's capability of auto incrementing counter.
### Steps
1. Write the auth server code with REST endpoints for signup and login. Signup should create the user (to start with, just in memory map). Login whould verify the user is present, given username and pwd, and return the user id back, for client to use in requests to chat server.
2. Once the above works, launch a postgres db container and persist the data in that. You need to create a table first, with a schema, and then add rows on user signup. Hash the passwords and store.
### Test
1. Sign up with a email, name and pwd. Verify that same email cannot be used twice for sign up.
2. Do another sign up. Make sure you get the ids back in response.
3. Try logging in with the email and pwd, and verify the positive and negative cases.
### Output
1. curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice","password":"secret"}'
2. Run this again and you get {"error":"email already registered"}
3. curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'
These work, proving auth server works.
4. Launch container and test the same, with port 3001 instead, as container's 3000 port is exposed as 3001 locally in docker file.

(Misc)
1. Given the current code of server, multiple client connections will be processed in a single thread one after another. We don't have parallel processing. Seems like it would be good to have a thread pool and offload the work to that? Only if needed? Does nodejs even allow spawning threads?

