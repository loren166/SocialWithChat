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
exports.SaveUser = exports.SaveMessages = exports.SaveRoomWithConnectedUser = exports.SaveCreatedRoom = void 0;
const chatModels_1 = require("../models/chatModels");
//Сохранение соданной комнаты в бд
function SaveCreatedRoom(roomName, owner) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const members = [owner];
            const newRoom = new chatModels_1.RoomCreateModel({
                roomName: roomName,
                owner: owner,
                members: members,
            });
            yield newRoom.save();
        }
        catch (err) {
            throw new Error('Failed to save room' + err);
        }
    });
}
exports.SaveCreatedRoom = SaveCreatedRoom;
//Сохранение подключенных пользователей в комнате
function SaveRoomWithConnectedUser(roomId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Room = yield chatModels_1.RoomCreateModel.findById(roomId);
            if (Room) {
                if (Room.members.includes(userId)) {
                    console.error('User already in room');
                }
                else {
                    Room.members.push(userId);
                    yield Room.save();
                }
            }
        }
        catch (err) {
            throw new Error('Failed to connect to room' + err);
        }
    });
}
exports.SaveRoomWithConnectedUser = SaveRoomWithConnectedUser;
//Сохранение сообщений в базу данных
function SaveMessages(text, handler, roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newMessage = new chatModels_1.MessageModel({
                text: text,
                handler: handler,
                roomId: roomId
            });
            yield newMessage.save();
        }
        catch (err) {
            throw new Error('Failed to save messages' + err);
        }
    });
}
exports.SaveMessages = SaveMessages;
//Сохранение нового созданного пользователя в бд
function SaveUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = new chatModels_1.SaveUserModel({
                username: username,
                password: password,
            });
            yield newUser.save();
            return newUser;
        }
        catch (err) {
            throw new Error('Failed to create user' + err);
        }
    });
}
exports.SaveUser = SaveUser;
