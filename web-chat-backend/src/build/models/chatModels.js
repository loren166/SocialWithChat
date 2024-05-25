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
exports.MessageModel = exports.ChatModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
//Схема пользователя
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    registration_date: { type: Date }
});
//Модель создания пользователя
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.UserModel = UserModel;
const ChatSchema = new mongoose_1.Schema({
    chat_name: { type: String, required: true },
    chat_type: { type: String, enum: ['personal', 'group'], required: true },
    users: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'User', required: true,
        validate: {
            validator: function (v) {
                if (this.chat_type === 'personal') {
                    return v.length === 2;
                }
                else if (this.chat_type === 'group') {
                    return v.length >= 2;
                }
                return false;
            }
        } },
    messages: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' },
    creation_date: { type: Date, default: Date.now() }
});
const ChatModel = mongoose_1.default.model('ChatModel', ChatSchema);
exports.ChatModel = ChatModel;
const MessageSchema = new mongoose_1.Schema({
    chat_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ChatModel', required: true },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message_text: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() }
});
const MessageModel = mongoose_1.default.model('Message', MessageSchema);
exports.MessageModel = MessageModel;
