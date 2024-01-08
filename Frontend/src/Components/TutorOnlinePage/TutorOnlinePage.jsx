import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatComponent from '../ChatComponent/ChatComponent';
import "./TutorOnlinePage.css"

const TutorOnlinePage = () => {
    
  const userId = sessionStorage.getItem('userId'); 
  const [socket, setSocket] = useState(null);
  const [availableTutorsCount, setAvailableTutorsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null); 
  const [showChat, setShowChat] = useState(false); 

  useEffect(() => {
    const newSocket = io('http://localhost:5050/', { transports: ['websocket'] });
  
    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });
  
    setSocket(newSocket);
  
    newSocket.emit('ping', userId);
  
   
    const pingInterval = setInterval(() => {
      console.log(userId)
      newSocket.emit('ping', userId);
    }, 3000);
  
    return () => {
      clearInterval(pingInterval); 
      newSocket.disconnect();
    };
  }, [userId]);
  

  useEffect(() => {
    socket &&
      socket.on('availableTutorsCount', (count) => {
        console.log('Received availableTutorsCount:', count);
        setAvailableTutorsCount(count);
      });
  }, [socket]);

  useEffect(() => {
    socket &&
      socket.on('notification', (notification) => {
        console.log('Received notification:', notification);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      });
  }, [socket]);

  useEffect(() => {
    socket &&
      socket.on('tutorResponse', (response) => {
        console.log('Received tutorResponse:', response);
        if (response.accepted) {
          setChatRoomId(response.chatRoomId);
          setShowChat(true);
        } else {
          console.log('Tutor rejected the doubt request:', response);
        }
      });
  }, [socket]);
 
  const handleTutorResponse = (accepted, doubtId, studentId) => {

    socket.emit('tutorResponse', {
      accepted:accepted,
      studentId,
      tutorId: userId,
      chatRoomId: `${studentId}-${'tutorId'}`, 
    });

  };

  return (
    <div className='trr'>
      <h3 className='headline'>Tutor Online Page</h3>
      <p>Available Tutors: {availableTutorsCount}</p>

      <ul>
        {notifications.map((notification) => (
          <li key={notification.doubtId}>
            {notification.message}
            <button
              onClick={() =>
                handleTutorResponse(
                  true,
                  notification.studentId
                )
              }
            >
              Yes
            </button>
            <button
              onClick={() =>
                handleTutorResponse(
                  false,
                  notification.studentId
                )
              }
            >
              No
            </button>
          </li>
        ))}
      </ul>

    
      {showChat && (
        <ChatComponent
          userId={userId} 
          chatRoomId={chatRoomId}
        />
      )}

    </div>
  );
};

export default TutorOnlinePage;
