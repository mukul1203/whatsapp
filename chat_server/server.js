import { WebSocketServer } from "ws";

let clientToSocketMap = {};

// message schema:
// {
//     from: 1, // client id
//     to: 2, // client id
//     content: "hello"
// }

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  console.log("Client connected");

  // track the socket for this client id
    const params = new URLSearchParams(req.url.replace('/', ''));
    const userId = params.get("user_id");
    console.log("User connected:", userId);
  clientToSocketMap[userId] = ws;

  ws.on("message", (msg) => {
    let msg_json = JSON.parse(msg);
    console.log("Received:", msg_json);

    const target_ws = clientToSocketMap[msg_json.to];
    console.log(target_ws);

    if (target_ws != undefined) {
      target_ws.send(msg);
    } else {
      ws.send("Destination client not found!");
    }
  });

  ws.send(`Connected with id ${userId}`);
});

console.log("WebSocket server running on ws://0.0.0.0:8080");
