import mongoose, {Schema, Document} from "mongoose";

//Интерфейс создания нового пользователя
interface UserInterface extends Document{
    username: string,
    password: string,
    email: string,
    registration_date: Date,
}

//Схема пользователя
const UserSchema = new Schema<UserInterface>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    registration_date: {type: Date}
})

//Модель создания пользователя
const UserModel = mongoose.model<UserInterface>('User', UserSchema)

interface ChatInterface extends Document{
    chat_name: string,
    chat_type: 'personal' | 'group',
    users: mongoose.Types.ObjectId[],
    messages: mongoose.Types.ObjectId[],
    creation_date: Date,
}

const ChatSchema = new Schema({
    chat_name: {type: String, required: true},
    chat_type: {type: String, enum: ['personal', 'group'], required: true},
    users: {type: [Schema.Types.ObjectId], ref:'User', required: true,
        validate: {
        validator: function (this: ChatInterface, v: mongoose.Types.ObjectId[]) {
            if (this.chat_type === 'personal') {
                return v.length === 2;
            } else if (this.chat_type === 'group') {
                return v.length >= 2;
            }
            return false
        }}},
    messages: {type: Schema.Types.ObjectId, ref:'Message'},
    creation_date: {type: Date, default: Date.now()}
})

const ChatModel = mongoose.model<ChatInterface>('ChatModel', ChatSchema)

interface MessageInterface {
    chat_id: mongoose.Types.ObjectId,
    user_id: mongoose.Types.ObjectId,
    message_text: string,
    status: string,
    timestamp: Date,
}

const MessageSchema = new Schema({
    chat_id: {type: Schema.Types.ObjectId, ref: 'ChatModel', required: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    message_text: {type: String, required: true},
    status: {type: String, required: true},
    timestamp: {type: Date, default: Date.now()}
})

const MessageModel = mongoose.model<MessageInterface>('Message', MessageSchema)

export { UserModel, ChatModel, MessageModel }