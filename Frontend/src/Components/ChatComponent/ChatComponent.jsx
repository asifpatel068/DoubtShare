import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatComponent = ({ userId, chatRoomId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
   
    const newSocket = io('http://localhost:5050', { transports: ['websocket'] });
    setSocket(newSocket);

    
    newSocket.emit('joinChatRoom', chatRoomId);

    return () => {
      newSocket.disconnect();
    };
  }, [chatRoomId]);

  useEffect(() => {
  
    socket && socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

  
    return () => {
      socket && socket.off('newMessage');
    };
  }, [socket]);

  const handleSendMessage = () => {
   
    socket.emit('sendMessage', {
      chatRoomId,
      senderId: userId, 
      message: newMessage,
    });

 
    setNewMessage('');
  };

  return (
    <div className='chatApp'>
      <h3>Chat Room</h3>
      <div className='messageContainer'>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.senderId}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
