import React, { useState } from "react";
import GroupChat from "../components/GroupChat";
import PersonalChat from "../components/PersonalChat";
import SearchUsers from "../components/SearchUsers";
import PersonalChatBar from "../components/PersonalChatBar";
import GroupChatBar from "../components/GroupChatBar";

interface User {
    _id: string;
    username: string;
}

interface ChatInterface {
    _id: string;
    chatName: string;
    users: User[];
    chat_type: 'personal' | 'group';
}

interface ChatProps {
    userId: string,
    chatName: string,
}

const Chat: React.FC<ChatProps> = ({userId, chatName}) => {
    const [selectedChat, setSelectedChat] = useState<ChatInterface | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSelectUser = (user: User) => {
        setSearchQuery(user.username);
    };

    const handleChatSelect = (chat: ChatInterface) => {
        setSelectedChat(chat);
    };

    return (
        <div className="chat-container">
            <div className='side-bar'>
                <SearchUsers onSelectUser={handleSelectUser} />
                <h3>Personal Chats</h3>
                <PersonalChatBar onSelectChat={handleChatSelect} searchQuery={searchQuery} />
                <h3>Group Chats</h3>
                <GroupChatBar onSelectChat={handleChatSelect} searchQuery={searchQuery} />
            </div>
            <div className="chat-display">
                {selectedChat ? (
                    selectedChat.chat_type === 'personal' ? (
                        <PersonalChat userId={userId} chatName={selectedChat.chatName} chat_type={selectedChat.chat_type} />
                    ) : (
                        <GroupChat userId={userId} chatName={selectedChat.chatName} chat_type={selectedChat.chat_type}/>
                    )
                ) : (
                    <div>Выберите чат для начала общения</div>
                )}
            </div>
        </div>
    );
};

export default Chat;