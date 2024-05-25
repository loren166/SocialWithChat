"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const db_save_1 = require("./DB/db_save");
const chatModels_1 = require("./models/chatModels");
dotenv_1.default.config();
//Функция с обработкой сокетов на порту 3000
function setUpSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: `http://localhost:${process.env.PORT}`,
            methods: ['GET', 'POST']
        }
    });
    const PersonalChatNamespace = io.of('/PersonalChat');
    PersonalChatNamespace.on('connect', (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log('User has been connected to personal chat.');
        socket.on('disconnect', () => {
            console.log('User has disconnected.');
        });
        socket.on('sendPersonalMessage', (chat_id, user_id, message_text, status) => __awaiter(this, void 0, void 0, function* () {
            try {
                const savedMessage = yield (0, db_save_1.SaveMessage)(chat_id, user_id, message_text, status);
                socket.emit('sendNewPersonalMessage', {
                    chat_id,
                    user_id,
                    message_text,
                    timestamp: savedMessage.timestamp
                });
            }
            catch (err) {
                console.error('Error sending personal message:', err);
            }
        }));
        socket.on('createPersonalRoom', (chat_name, user_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const findPersonalChat = yield chatModels_1.ChatModel.findOne({ chat_name });
                if (findPersonalChat) {
                    socket.emit('personalRoomCreationError', 'Chat with this name already exists.');
                    return;
                }
                const newChat = yield (0, db_save_1.SaveChat)(chat_name, 'personal', [user_id]);
                socket.emit('sendPersonalChat', {
                    chat_name,
                    chat_type: 'personal',
                    users: [user_id],
                    creation_date: newChat.creation_date
                });
            }
            catch (err) {
                console.log('Error creating personal chat:', err);
                socket.emit('personalRoomCreationError', 'An error occurred while creating personal chat.');
            }
        }));
    }));
    const GroupChatNamespace = io.of('/GroupChat');
    GroupChatNamespace.on('connect', (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log('User has been connected to group chat.');
        socket.on('disconnect', () => {
            console.log('User has been disconnected from group chat.');
        });
        socket.on('sendGroupMessage', (chat_id, user_id, message_text, status) => __awaiter(this, void 0, void 0, function* () {
            try {
                const savedMessage = yield (0, db_save_1.SaveMessage)(chat_id, user_id, message_text, status);
                socket.emit('sendNewGroupMessage', {
                    chat_id,
                    user_id,
                    message_text,
                    timestamp: savedMessage.timestamp
                });
            }
            catch (err) {
                console.error('Error sending group message:', err);
            }
        }));
        socket.on('createGroupRoom', (chat_name, user_id, added_users) => __awaiter(this, void 0, void 0, function* () {
            try {
                const findGroupChat = yield chatModels_1.ChatModel.findOne({ chat_name });
                if (findGroupChat) {
                    socket.emit('groupRoomCreationError', 'Chat with this name already exists.');
                    return;
                }
                const newChat = yield (0, db_save_1.SaveChat)(chat_name, 'group', [user_id, ...added_users]);
                socket.emit('sendGroupChat', {
                    chat_name,
                    chat_type: 'group',
                    users: [user_id, ...added_users],
                    creation_date: newChat.creation_date
                });
            }
            catch (err) {
                console.log('Error creating group chat:', err);
                socket.emit('groupRoomCreationError', 'An error occurred while creating group chat.');
            }
        }));
    }));
}
exports.default = setUpSocket;
