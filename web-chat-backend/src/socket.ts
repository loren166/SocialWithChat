import dotenv from "dotenv";
import {Server} from "socket.io";
import {Server as HTTPServer} from "http";
import {SaveChat, SaveMessage} from "./DB/db_save";
import {ChatModel} from "./models/chatModels";

dotenv.config()

//Функция с обработкой сокетов на порту 3000
export default function setUpSocket(server: HTTPServer) {
    const io = new Server(server, {
        cors: {
            origin: `http://localhost:${process.env.PORT}`,
            methods: ['GET', 'POST']
        }
    });
    const PersonalChatNamespace = io.of('/PersonalChat');
    PersonalChatNamespace.on('connect', async (socket) => {
        console.log('User has been connected to personal chat.');

        socket.on('disconnect', () => {
            console.log('User has disconnected.');
        });

        socket.on('sendPersonalMessage', async (chat_id, user_id, message_text, status) => {
            try {
                const savedMessage = await SaveMessage(chat_id, user_id, message_text, status);
                socket.emit('sendNewPersonalMessage', {
                    chat_id,
                    user_id,
                    message_text,
                    timestamp: savedMessage.timestamp
                });
            } catch (err) {
                console.error('Error sending personal message:', err);
            }
        });

        socket.on('createPersonalRoom', async (chat_name, user_id) => {
            try {
                const findPersonalChat = await ChatModel.findOne({ chat_name });
                if (findPersonalChat) {
                    socket.emit('personalRoomCreationError', 'Chat with this name already exists.');
                    return;
                }
                const newChat = await SaveChat(chat_name, 'personal', [user_id]);
                socket.emit('sendPersonalChat', {
                    chat_name,
                    chat_type: 'personal',
                    users: [user_id],
                    creation_date: newChat.creation_date
                });
            } catch (err) {
                console.log('Error creating personal chat:', err);
                socket.emit('personalRoomCreationError', 'An error occurred while creating personal chat.');
            }
        });
    });

    const GroupChatNamespace = io.of('/GroupChat');
    GroupChatNamespace.on('connect', async (socket) => {
        console.log('User has been connected to group chat.');

        socket.on('disconnect', () => {
            console.log('User has been disconnected from group chat.');
        });

        socket.on('sendGroupMessage', async (chat_id, user_id, message_text, status) => {
            try {
                const savedMessage = await SaveMessage(chat_id, user_id, message_text, status);
                socket.emit('sendNewGroupMessage', {
                    chat_id,
                    user_id,
                    message_text,
                    timestamp: savedMessage.timestamp
                });
            } catch (err) {
                console.error('Error sending group message:', err);
            }
        });

        socket.on('createGroupRoom', async (chat_name, user_id, added_users) => {
            try {
                const findGroupChat = await ChatModel.findOne({ chat_name });
                if (findGroupChat) {
                    socket.emit('groupRoomCreationError', 'Chat with this name already exists.');
                    return;
                }
                const newChat = await SaveChat(chat_name, 'group', [user_id, ...added_users]);
                socket.emit('sendGroupChat', {
                    chat_name,
                    chat_type: 'group',
                    users: [user_id, ...added_users],
                    creation_date: newChat.creation_date
                });
            } catch (err) {
                console.log('Error creating group chat:', err);
                socket.emit('groupRoomCreationError', 'An error occurred while creating group chat.');
            }
        });
    });
}