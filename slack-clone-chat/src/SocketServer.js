import io from "socket.io-client";

//const io = require("socket.io-client");
const ENDPOINT = "http://localhost:5002";

const socket = io(ENDPOINT);

export { socket };
