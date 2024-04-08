import {Server} from "socket.io";
import {Server as HTTPServer} from "http";
import {Schema} from "mongoose";
import {SaveCreatedRoom, SaveMessages, SaveRoomWithConnectedUser} from "./DB/db_save";

//Функция с обработкой сокетов на порту 3000
export default function setUpSocket (server: HTTPServer) {
    const io: Server = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    const chatNamespace = io.of('/chat')
    const newRoomNamespace = io.of('/createroom')
    const connectingRoomNamespace = io.of('/room')
    chatNamespace.on('connect', (socket) => {
        console.log(`User has been connected.`);

        socket.on('disconnect', () => {
            console.log('User has disconnected.')
        });

        socket.on('send message', async (msg: string,
                                         handler: Schema.Types.ObjectId,
                                         roomId: Schema.Types.ObjectId) => {
            try {
                await SaveMessages(msg, handler, roomId)
                io.emit('chat message', msg)
            } catch (err) {
                console.error('Error at saving message:', err)
            }
        });
    })
    newRoomNamespace.on('create room', async (roomName, owner) => {
        try {
            await SaveCreatedRoom(roomName, owner)
            io.emit('new room', roomName)
        } catch (err) {
            throw new Error('Something wrong with data.' + err)
        }
    });
    connectingRoomNamespace.on('connect to room', async (roomId, userId) => {
        try {
            if (roomId) {
                await SaveRoomWithConnectedUser(roomId, userId)
                io.emit('User connected', roomId, userId)
            }
        } catch (err) {
            throw new Error('Error at connecting to room' + err)
        }
    })
}