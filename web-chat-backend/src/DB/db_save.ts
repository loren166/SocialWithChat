import mongoose from "mongoose";
import { UserModel, ChatModel, ChatMemberModel, MessageModel } from "../models/chatModels";


//Сохранение нового созданного пользователя в бд
export async function SaveUser(username: string,
                               password: string) {
    try {
        const newUser = new UserModel({
            username: username,
            password: password,
        })
        await newUser.save()
        return newUser
    } catch (err) {
        throw new Error('Failed to create user:' + err)
    }
}

export async function SaveChat(chat_name: string,
                               chat_type: string,
                               chat_status: string,
                               creation_date: Date) {
    try {
        const newChat = new ChatModel({
            chat_name: chat_name,
            chat_type: chat_type,
            chat_status: chat_status,
            creation_date: creation_date
        })
        return await newChat.save()
    } catch (err) {
        throw new Error('Failed to save room:' + err)
    }
}

export async function SaveChatMember(chat_id: mongoose.Types.ObjectId,
                                     user_id: mongoose.Types.ObjectId) {
    try {
        const newChatMember = new ChatMemberModel({
            chat_id: chat_id,
            user_id: user_id
        })
        return await newChatMember.save()
    } catch (err) {
        throw new Error('Failed to add user to chat:' + err)
    }
}

export async function SaveMessage(chat_id: mongoose.Types.ObjectId,
                                  user_id: mongoose.Types.ObjectId,
                                  message_text: string,
                                  status: string,
                                  timestamp: Date) {
    try {
        const newMessage = new MessageModel({
            chat_id: chat_id,
            user_id: user_id,
            message_text: message_text,
            status: status,
            timestamp: timestamp
        })
        return await newMessage.save()
    } catch (err) {
        throw new Error('Failed to save message:' + err)
    }
}

