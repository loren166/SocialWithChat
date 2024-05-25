import mongoose from "mongoose";
import { UserModel, ChatModel, MessageModel } from "../models/chatModels";
import bcrypt from "bcrypt";


//Сохранение нового созданного пользователя в бд
export async function SaveUser(username: string,
                               password: string,
                               email: string) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new UserModel({
            username: username,
            password: hashedPassword,
            email: email,
        })
        await newUser.save()
        return newUser
    } catch (err) {
        throw new Error('Failed to create user:' + err)
    }
}

export async function SaveChat(chat_name: string, chat_type: 'personal' | 'group', users: mongoose.Types.ObjectId[]) {
    try {
        const newChat = new ChatModel({
            chat_name: chat_name,
            chat_type: chat_type,
            users: users,
            messages: [],
            creation_date: new Date()
        });
        return await newChat.save();
    } catch (err) {
        throw new Error('Failed to save chat: ' + err);
    }
}

export async function SaveMessage(chat_id: mongoose.Types.ObjectId, user_id: mongoose.Types.ObjectId, message_text: string, status: string) {
    try {
        const newMessage = new MessageModel({
            chat_id: chat_id,
            user_id: user_id,
            message_text: message_text,
            status: status,
            timestamp: new Date(),
        });
        const savedMessage = await newMessage.save();

        await ChatModel.findByIdAndUpdate(chat_id, {
            $push: { messages: savedMessage._id },
        });

        return savedMessage;
    } catch (err) {
        throw new Error('Failed to save message: ' + err);
    }
}