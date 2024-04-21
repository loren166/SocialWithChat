import React, {useState} from "react";

interface Props {
    onSendMessage: (message: string) => void;
}

const ChatInput = ({onSendMessage}: Props) => {
    const [message, setMessage] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                value={message}
                onChange={handleChange}
                placeholder='Type your message...'
            />
            <button type="submit">Send</button>
        </form>
    )
}

export default ChatInput;