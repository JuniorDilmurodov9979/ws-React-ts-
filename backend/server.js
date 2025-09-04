const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on("connection", (socket) => {
  clients.push(socket);

  socket.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (err) {
      console.error("Invalid JSON:", msg);
      return;
    }

    // Validate data.type to avoid weird bugs
    if (!data.type || !data.user) return;

    // Broadcast to everyone except sender
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== socket) {
        client.send(JSON.stringify(data));
      }
    });
  });

  socket.on("close", () => {
    clients = clients.filter((client) => client !== socket);
  });
});

console.log("✅ WebSocket server running on ws://192.168.200.132:8080");
