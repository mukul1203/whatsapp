import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());

    if (msg.toString() === "ping") {
      ws.send("pong");
    } else {
      ws.send("unknown command");
    }
  });

  ws.send("connected");
});

console.log("WebSocket server running on ws://0.0.0.0:8080");
