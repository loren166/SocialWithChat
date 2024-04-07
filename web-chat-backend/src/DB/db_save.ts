import mongoose, {Schema} from "mongoose";
import {MessageModel, RoomCreateModel, SaveUserModel} from "../models/chatModels";


//Сохранение соданной комнаты в бд
export async function SaveCreatedRoom(roomName: string,
                                      owner: Schema.Types.ObjectId): Promise<void> {
    try {
        const members: Schema.Types.ObjectId[] = [owner];
        const newRoom = new RoomCreateModel({
            roomName: roomName,
            owner: owner,
            members: members,
        });
        await newRoom.save();
    } catch (err) {
        throw new Error('Failed to save room' + err);
    }
}

//Сохранение подключенных пользователей в комнате
export async function SaveRoomWithConnectedUser(roomId: string,
                                                userId: mongoose.Types.ObjectId): Promise<void> {
    try {
        const Room = await RoomCreateModel.findById(roomId)
        if (Room) {
            if (Room.members.includes(userId)) {
                console.error('User already in room')
            } else {
                Room.members.push(userId)
                await Room.save()
            }
        }
    } catch (err) {
        throw new Error('Failed to connect to room' + err);
    }
}

//Сохранение сообщений в базу данных
export async function SaveMessages(text: string,
                                   handler: Schema.Types.ObjectId,
                                   roomId: Schema.Types.ObjectId) {
    try {
        const newMessage = new MessageModel({
            text: text,
            handler: handler,
            roomId: roomId})
        await newMessage.save()
    } catch (err) {
        throw new Error('Failed to save messages' + err)
    }
}

//Сохранение нового созданного пользователя в бд
export async function SaveUser(username: string,
                               password: string) {
    try {
        const newUser = new SaveUserModel({
            username: username,
            password: password,
        })
        await newUser.save()
        return newUser
    } catch (err) {
        throw new Error('Failed to create user' + err)
    }
}