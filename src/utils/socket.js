import { io } from "socket.io-client";
const socket = io("http://socket.givegarden.info:6001");
export default socket;