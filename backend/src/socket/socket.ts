import express from "express";
import { Server } from "socket.io";
import http from "http";

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://student-document-request-system-2.onrender.com",
      "http://47.129.128.196",
      "http://47.129.128.196:80",
    ],
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
