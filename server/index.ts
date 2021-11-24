import { createServer } from "http";
import { Server, Socket } from "socket.io";
import socketListeners from './socketio'

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket: Socket) => {
  socketListeners(socket);
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected")
  });
});

httpServer.listen(5000);