import express from "express";
import { Server } from "socket.io";
import http from "http";

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});

export { app, server, io };
