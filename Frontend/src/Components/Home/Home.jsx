import React, { useEffect, useState } from 'react';
import './Home.css';

import StudentComponent from '../StudentComponent/StudentComponent';
import TutorOnlinePage from '../TutorOnlinePage/TutorOnlinePage';



export default function Home() {

  const userType = sessionStorage.getItem('userType'); 

  return (
    <div className='main'>
   
      {userType=="Tutor"?<TutorOnlinePage/>:<StudentComponent/>}
     
    </div>
  );
}
