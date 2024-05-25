import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
    _id: string;
    username: string;
}

interface Chat {
    _id: string,
    chatName: string,
    users: User[],
    chat_type: 'group',
}

interface GroupChatBarProps {
    onSelectChat: (chat: Chat) => void;
    searchQuery?: string;
}

const GroupChatBar: React.FC<GroupChatBarProps> = ({ onSelectChat, searchQuery }) => {
    const [groupChats, setGroupChats] = useState<Chat[]>([]);

    useEffect(() => {
        const fetchGroupChats = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/chats/groupchat`, {
                    params: { userId: localStorage.getItem('userId') }
                });
                if (!response.data.message) {
                    console.error('Error at fetching group chats');
                } else {
                    setGroupChats(response.data)
                }
            } catch (err) {
                console.error('Failed to fetch group chats:', err);
            }
        };
        fetchGroupChats();
    }, []);

    const filteredChats = searchQuery
        ? groupChats.filter(chat =>
            chat.users.some(user => user.username.includes(searchQuery))
        )
        : groupChats;

    return (
        <div>
            {filteredChats.map((chat) => (
                <div key={chat._id} onClick={() => onSelectChat(chat)}>
                    {chat.chatName}
                </div>
            ))}
        </div>
    );
};

export default GroupChatBar;