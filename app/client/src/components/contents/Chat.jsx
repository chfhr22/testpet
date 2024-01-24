import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux'

const socket = io('http://localhost:5051');

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const user = useSelector((state) => state.user);

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setChat(prevChat => [...prevChat, msg]);
        });
        // 이벤트 리스너 정리
        return () => socket.off('chat message');
    }, []);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const response = await fetch("http://localhost:5051/api/chat/getMessages");
                const data = await response.json();
                setChat(data);
            } catch (error) {
                console.error("Failed to load messages", error);
            }
        };

        loadMessages();
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        console.log('Current user:', user);

        if (message !== '') {
            const messageData = {
                username: user.displayName,
                message: message,
                photoURL: user.photoURL
            };
            socket.emit('chat message', messageData);
            setMessage('');
        }
    }
    return (
        <>
            <h2>실시간 채팅</h2>
            <div className='chating__wrap'>
                <div className='chating'>

                    {chat.map((msg, index) => (
                        <div key={index} className={`chating__box ${msg.username === user.displayName ? 'my-message' : 'other-message'}`}>
                            <div className={`chating__author ${msg.username === user.displayName ? 'my-message' : 'other-message'}`}>
                                <span className="author__photo"><img src={`${msg.photoURL}`} alt="" /></span>
                                <span className='name'>{msg.username}</span>
                            </div>
                            <div className={`chating__cont ${msg.username === user.displayName ? 'my-message' : 'other-message'}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {user.displayName ? (
                <div className='chating__submit'>
                    <input
                        type="text"
                        id='live__chat'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
                        autoComplete='off'
                    />
                    <button onClick={sendMessage}>send</button>
                </div>
            ) : (
                <p>로그인이 필요합니다.</p>
            )}
        </>
    )
}

export default Chat
