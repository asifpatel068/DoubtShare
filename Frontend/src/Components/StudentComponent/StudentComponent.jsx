import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./StudentComponent.css"
import ChatComponent from '../ChatComponent/ChatComponent';

const StudentComponent = () => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId'); 
  const [socket, setSocket] = useState(null);
  const [availableTutorsCount, setAvailableTutorsCount] = useState(0);
  const [doubtInput, setDoubtInput] = useState('');
  const [doubtData, setDoubtData] = useState({});
  const [chatRoomId, setChatRoomId] = useState(null); 
  const [showChat, setShowChat] = useState(false); 

  useEffect(() => {
    const newSocket = io('https://doubtshare-smlr.onrender.com/', { transports: ['websocket'] });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket &&
      socket.on('availableTutorsCount', (count) => {
        setAvailableTutorsCount(count);
      });

    socket &&
      socket.on('tutorResponse', (response) => {
        if (response.accepted) {
         
          setChatRoomId(response.chatRoomId);
          setShowChat(true);
        } else {
       
          console.log('Tutor rejected the doubt request:', response);
        }
      });

    return () => {
      socket && socket.off('availableTutorsCount');
      socket && socket.off('tutorResponse');
    };
  }, [socket]);

  const fetchDoubtData = async () => {
    try {
      const response = await fetch(`https://doubtshare-smlr.onrender.com/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await response.json();
      setDoubtData(data);
    } catch (error) {
      console.error('Error fetching doubt data:', error);
    }
  };

  const handleAskDoubt = () => {
    fetchDoubtData();

    const newDoubtData = {
      studentId: doubtData._id,
      language: doubtData.language,
      subject: doubtData.subject,
      message: doubtInput,
    };

    socket.emit('doubtRequest', newDoubtData);
    setDoubtInput('');
  };

  return (
    <div className='std'>
      <h3 className='headline'>Ask your Question and Connect with Expert Tutor</h3>
      <p>Available Tutors: {availableTutorsCount}</p>

      <textarea
        id='question'
        onChange={(e) => setDoubtInput(e.target.value)}
        placeholder=' Write Your Question Here'
        value={doubtInput}
        name='question'
        rows='10'
        cols='50'
      ></textarea>

      <button className='submitBtn' onClick={handleAskDoubt}>
        Ask Doubt
      </button>

      {showChat && (
        <ChatComponent
          userId={userId} 
          chatRoomId={chatRoomId}
        />
      )}
    </div>
  );
};

export default StudentComponent;
