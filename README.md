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


(Misc)
1. Given the current code of server, multiple client connections will be processed in a single thread one after another. We don't have parallel processing. Seems like it would be good to have a thread pool and offload the work to that? Only if needed? Does nodejs even allow spawning threads?

