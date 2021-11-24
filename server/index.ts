import { createServer } from "http";
import { Server, Socket } from "socket.io";
import socketLinesers from './socketio'

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket: Socket) => {
  console.log(socket.id + " connected")
  socketLinesers(socket);


  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected")
  });
});

httpServer.listen(5000);