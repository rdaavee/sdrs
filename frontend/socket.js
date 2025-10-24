import { io } from "socket.io-client";

const socket = io("http://13.214.216.27:3000", {
    transports: ["websocket"],
});

export default socket;
