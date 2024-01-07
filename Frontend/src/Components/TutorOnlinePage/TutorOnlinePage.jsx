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
    
    const newSocket = io('http://localhost:5050', { transports: ['websocket'] });
    setSocket(newSocket);

   
    newSocket.emit('ping',userId ); 

  
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
  
    socket && socket.on('availableTutorsCount', (count) => {
      setAvailableTutorsCount(count);
    });

    socket && socket.on('notification', (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
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
      socket && socket.off('notification');
      socket && socket.off('tutorResponse');
    };
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
