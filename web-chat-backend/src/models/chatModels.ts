import mongoose, {Schema, Document} from "mongoose";
import bcrypt from "bcrypt";

//Интерфейс создания нового пользователя
interface UserInterface extends Document{
    username: string,
    password: string,
    email: string,
    registration_date: Date,
    isValidPassword(password: string): Promise<boolean>,
}

//Схема пользователя
const UserSchema = new Schema<UserInterface>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    registration_date: {type: Date}
})
UserSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (err) {
        throw new Error('Incorrect password' + err)
    }
}
//Модель создания пользователя
const UserModel = mongoose.model<UserInterface>('User', UserSchema)

interface ChatInterface extends Document{
    chat_name: string,
    chat_type: string,
    chat_status: string,
    creation_date: Date,
}

const ChatSchema = new Schema({
    chat_name: {type: String, required: true},
    chat_type: {type: String, required: true},
    chat_status: {type: String, required: true},
    creation_date: {type: Date}
})

const ChatModel = mongoose.model<ChatInterface>('Chat', ChatSchema)

interface ChatMemberInterface {
    chat_id: mongoose.Types.ObjectId,
    user_id: mongoose.Types.ObjectId,
}

const ChatMemberSchema = new Schema({
    chat_id: {type: Schema.Types.ObjectId, ref: 'Chat', required: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})

const ChatMemberModel = mongoose.model<ChatMemberInterface>('ChatMember', ChatMemberSchema)

interface MessageInterface {
    chat_id: mongoose.Types.ObjectId,
    user_id: mongoose.Types.ObjectId,
    message_text: string,
    status: string,
    timestamp: Date,
}

const MessageSchema = new Schema({
    chat_id: {type: Schema.Types.ObjectId, ref: 'Chat', required: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    message_text: {type: String, required: true},
    status: {type: String, required: true},
    timestamp: {type: Date}
})

const MessageModel = mongoose.model<MessageInterface>('Message', MessageSchema)

export { UserModel, ChatModel, ChatMemberModel, MessageModel }