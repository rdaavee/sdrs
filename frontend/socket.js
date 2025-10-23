import { io } from "socket.io-client";

const socket = io("http://47.129.128.196:3000", {
    transports: ["websocket"],
});

export default socket;
