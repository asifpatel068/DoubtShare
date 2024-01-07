import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className='navbar'>
      <div className='nav-item'><Link to="/">Home</Link></div>
      <div className='nav-item'><Link to="/doubtHistory">Doubt History</Link></div>
      <div className='nav-item'><Link to="/login">Login/Register</Link></div>
    </div>
  );
}
