import mongoose, {Schema, Document} from "mongoose";
import bcrypt from "bcrypt";

//Интерфейс создания нового пользователя
interface UserInterface extends Document{
    username: string,
    password: string,
    isValidPassword(password: string): Promise<boolean>,
}

//Схема пользователя
const UserSchema = new Schema<UserInterface>({
    username: {type: String, required: true},
    password: {type: String, required: true},
})
UserSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (err) {
        throw new Error('Incorrect password' + err)
    }
}
//Модель создания пользователя
const SaveUserModel = mongoose.model<UserInterface>('UserCreate', UserSchema)

//Интерфейс создания комнаты
interface RoomCreateInterface extends Document{
    roomName: string,
    owner: mongoose.Types.ObjectId,
    members: mongoose.Types.ObjectId[],
}

//Схема создания комнаты
const RoomCreateSchema = new Schema({
    roomName: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{type: Schema.Types.ObjectId,ref: 'User', required: true}],
})

//Модель создания комнаты
const RoomCreateModel = mongoose.model<RoomCreateInterface>('RoomCreate', RoomCreateSchema)


//Интерфейс сохранения сообщений
interface MessageInterface extends Document{
    text: string,
    handler: mongoose.Types.ObjectId,
    roomId: mongoose.Types.ObjectId,
}

// Схема сохранения сообщений
const MessageSchema = new Schema( {
    text: {type: String, required: true},
    handler: {type: Schema.Types.ObjectId, required: true},
    roomId: {type: Schema.Types.ObjectId, required: true},
})

//Модель сохранения сообщений
const MessageModel = mongoose.model<MessageInterface>('MessageSave', MessageSchema)


export { RoomCreateModel, MessageModel, SaveUserModel }