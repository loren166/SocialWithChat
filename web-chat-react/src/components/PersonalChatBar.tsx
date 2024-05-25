import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
    _id: string;
    username: string;
}

interface Chat {
    _id: string;
    chatName: string;
    users: User[];
    chat_type: 'personal';
}

interface PersonalChatBarProps {
    onSelectChat: (chat: Chat) => void;
    searchQuery?: string;
}

const PersonalChatBar: React.FC<PersonalChatBarProps> = ({ onSelectChat, searchQuery }) => {
    const [personalChats, setPersonalChats] = useState<Chat[]>([]);

    useEffect(() => {
        const fetchPersonalChats = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/chats/personalchat`, {
                    params: { userId: localStorage.getItem('userId') }
                });
                if (!response.data.message) {
                    console.error('Error at fetching personal chats')
                } else {
                    setPersonalChats(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch personal chats:', err);
            }
        };
        fetchPersonalChats();
    }, []);

    const filteredChats = searchQuery
        ? personalChats.filter(chat =>
            chat.users.some(user => user.username.includes(searchQuery))
        )
        : personalChats;

    return (
        <div>
            {filteredChats.map((chat) => (
                <button key={chat._id} onClick={() => onSelectChat(chat)}>
                    {chat.chatName}
                </button>
            ))}
        </div>
    );
}

export default PersonalChatBar;