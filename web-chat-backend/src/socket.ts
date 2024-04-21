import dotenv from "dotenv";
import {Server} from "socket.io";
import {Server as HTTPServer} from "http";
import {SaveChat, SaveChatMember, SaveMessage} from "./DB/db_save";
import {ChatModel, UserModel} from "./models/chatModels";

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

        socket.on('sendPersonalMessage', async (chat_id, user_id,
                                          message_text, status) => {
            await SaveMessage(chat_id, user_id, message_text, status, new Date)
            socket.emit('sendNewPersonalMessage', {chat_id, user_id, message_text, timestamp: new Date})
        })
        socket.on('createPersonalRoom', async (chat_name, chat_type, chat_status, user_id) => {
            try {
                const findPersonalChat = await ChatModel.findOne({chat_name})
                if (findPersonalChat) {
                    socket.emit('personalRoomCreationError', 'Chat with this name already exists.')
                    return;
                }
                const newChat = await SaveChat(chat_name, chat_type, chat_status, new Date())

                await SaveChatMember(newChat._id, user_id)

                socket.emit('sendGroupChat', {chat_name, chat_type, chat_status, user_id, creation_date: new Date()})
            } catch (err) {
                console.log('Error creating group chat:', err)
                socket.emit('personalRoomCreationError', 'An error occurred while creating group chat.')
            }
        })
    })
    const GroupChatNamespace = io.of('/GroupChat')
    GroupChatNamespace.on('connect', async (socket) => {
        console.log('User has been connected to group chat.')

        socket.on('disconnect', () => {
            console.log('User has been disconnected from group chat.')
        })

        socket.on('sendGroupMessage', async (chat_id, user_id,
                                                message_text, status) => {
            await SaveMessage(chat_id, user_id, message_text, status, new Date)
            socket.emit('sendNewGroupMessage', {chat_id, user_id, message_text, timestamp: new Date})
        })
        socket.on('createGroupRoom', async (chat_name, chat_type, chat_status, user_id, added_users) => {
            try {
                const findGroupChat = await ChatModel.findOne({chat_name})
                if (findGroupChat) {
                    socket.emit('groupRoomCreationError', 'Chat with this name already exists.')
                    return;
                }
                const newChat = await SaveChat(chat_name, chat_type, chat_status, new Date())

                await SaveChatMember(newChat._id, user_id)

                for (const userId of added_users) {
                    await SaveChatMember(newChat._id, userId)
                }

                socket.emit('sendGroupChat', {chat_name, chat_type, chat_status, user_id, creation_date: new Date()})
            } catch (err) {
                console.log('Error creating group chat:', err)
                socket.emit('groupRoomCreationError', 'An error occurred while creating group chat.')
            }
        })
    })
}