import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import DoubtHistory from './Components/DoubtHistory/DoubtHistory'
import Login from './Components/Login/Login'
import { Route,Routes} from 'react-router'

function App() {
  
  return (
    <>
      <Navbar/>
      <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/doubtHistory" element={<DoubtHistory/>}/>
       <Route path="/login" element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App
