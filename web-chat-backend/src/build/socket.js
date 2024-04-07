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
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const db_save_1 = require("./DB/db_save");
//Функция с обработкой сокетов на порту 3000
function setUpSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    io.on('connect', (socket) => {
        console.log(`User has been connected.`);
        socket.on('disconnect', () => {
            console.log('User has disconnected.');
        });
        socket.on('send message', (msg, handler, roomId) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_save_1.SaveMessages)(msg, handler, roomId);
                io.emit('chat message', msg);
            }
            catch (err) {
                console.error('Error at saving message:', err);
            }
        }));
    });
}
exports.default = setUpSocket;
