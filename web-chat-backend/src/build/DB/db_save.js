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
exports.SaveMessage = exports.SaveChat = exports.SaveUser = void 0;
const chatModels_1 = require("../models/chatModels");
const bcrypt_1 = __importDefault(require("bcrypt"));
//Сохранение нового созданного пользователя в бд
function SaveUser(username, password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            const newUser = new chatModels_1.UserModel({
                username: username,
                password: hashedPassword,
                email: email,
            });
            yield newUser.save();
            return newUser;
        }
        catch (err) {
            throw new Error('Failed to create user:' + err);
        }
    });
}
exports.SaveUser = SaveUser;
function SaveChat(chat_name, chat_type, users) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newChat = new chatModels_1.ChatModel({
                chat_name: chat_name,
                chat_type: chat_type,
                users: users,
                messages: [],
                creation_date: new Date()
            });
            return yield newChat.save();
        }
        catch (err) {
            throw new Error('Failed to save chat: ' + err);
        }
    });
}
exports.SaveChat = SaveChat;
function SaveMessage(chat_id, user_id, message_text, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newMessage = new chatModels_1.MessageModel({
                chat_id: chat_id,
                user_id: user_id,
                message_text: message_text,
                status: status,
                timestamp: new Date(),
            });
            const savedMessage = yield newMessage.save();
            yield chatModels_1.ChatModel.findByIdAndUpdate(chat_id, {
                $push: { messages: savedMessage._id },
            });
            return savedMessage;
        }
        catch (err) {
            throw new Error('Failed to save message: ' + err);
        }
    });
}
exports.SaveMessage = SaveMessage;
