"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveUserModel = exports.MessageModel = exports.RoomCreateModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
//Модель пользователя
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});
//Модель создания пользователя
const SaveUserModel = mongoose_1.default.model('UserCreate', UserSchema);
exports.SaveUserModel = SaveUserModel;
//Схема создания комнаты
const RoomCreateSchema = new mongoose_1.Schema({
    roomName: { type: String, required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }]
});
//Модель создания комнаты
const RoomCreateModel = mongoose_1.default.model('RoomCreate', RoomCreateSchema);
exports.RoomCreateModel = RoomCreateModel;
// Схема сохранения сообщений
const MessageSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    handler: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, required: true }
});
//Модель сохранения сообщений
const MessageModel = mongoose_1.default.model('MessageSave', MessageSchema);
exports.MessageModel = MessageModel;
