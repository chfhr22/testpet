import React, { useState } from 'react';
import { IoChatbubbles } from 'react-icons/io5';
import Chat from '../contents/Chat';

const Main = (props) => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const openChat = () => {
        setIsChatOpen(true);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const handleContainerClick = (e) => {
        if (isChatOpen && e.target.classList.contains('chat-container')) {
            closeChat();
        }
    };

    return (
        <main>
            {props.children}
            <div
                className={`chat-container ${isChatOpen ? 'open' : ''}`}
                onClick={handleContainerClick}
            >
                {isChatOpen && (
                    <Chat onClose={closeChat} />
                )}
            </div>
            <IoChatbubbles id='chat' onClick={openChat} />
        </main>
    );
}

export default Main;
