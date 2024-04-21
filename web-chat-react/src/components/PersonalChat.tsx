import React, {useEffect, useState} from "react";
import io from 'socket.io-client'
import ChatInput from "./ChatInput";

interface PersonalChatProps {
    userId: string;
    chatName: string;
    chat_type: "Personal";
    chat_status: "active" | "inactive";
}


const PersonalChat: React.FC<PersonalChatProps> = ({userId, chatName, chat_type, chat_status}) => {
    const [messages, setMessages] = useState<any[]>([]);
    const socket = io('/PersonalChat')

    useEffect(() => {
        socket.emit('createPersonalRoom', chatName, chat_type, chat_status, userId)

        socket.on('sendNewPersonalMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
        })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [chatName, userId, socket])

    const handleSendMessage = (message: string) => {
        socket.emit('sendPersonalMessage', {chat_name: chatName, user_id: userId, message_text: message, status: 'sent'})
    }
    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <p>{msg.text}</p>
                        <p>{msg.timestamp}</p>
                    </div>
                ))}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
}

export default PersonalChat;