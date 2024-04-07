import {Server} from "socket.io";
import {Server as HTTPServer} from "http";
import {Schema} from "mongoose";
import {SaveMessages} from "./DB/db_save";

//Функция с обработкой сокетов на порту 3000
export default function setUpSocket (server: HTTPServer) {
    const io: Server = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    io.on('connect', (socket) => {
        console.log(`User has been connected.`);

        socket.on('disconnect', () => {
            console.log('User has disconnected.')
        });

        socket.on('send message', async (msg: string,
                                         handler: Schema.Types.ObjectId,
                                         roomName: Schema.Types.ObjectId) => {
            try {
                await SaveMessages(msg, handler, roomName)
                io.emit('chat message', msg)
            } catch (err) {
                console.error('Error at saving message:', err)
            }
        });
    })
}