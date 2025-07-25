import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DashboardHome from './pages/Dashboard/DashboardHome'
import Bookmarks from './pages/Dashboard/Bookmarks'
import CreatePolls from './pages/Dashboard/CreatePolls'
import MyPolls from './pages/Dashboard/MyPolls'
import VotedPolls from './pages/Dashboard/VotedPolls';
import PublicPolls from './pages/Dashboard/PublicPolls';
import PollVoting from './pages/Dashboard/PollVoting';
import LoginForm from './pages/Auth/LoginForm'
import SignUpForm from './pages/Auth/SignUpForm'
import { initializeSampleDataIfNeeded } from './utils/sampleData'
 
const App = () => {
  useEffect(() => {
    // Initialize sample data if needed when app starts
    initializeSampleDataIfNeeded();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<LoginForm/>}/>
          <Route path='/signup' element={<SignUpForm/>}/>
          <Route path='/dashboard' element={<DashboardHome/>}/>
          <Route path='/bookmarks' element={<Bookmarks/>}/>
          <Route path='/createpolls' element={<CreatePolls/>}/>
          <Route path='/mypolls' element={<MyPolls/>}/>
          <Route path='/votedpolls' element={<VotedPolls/>}/>
          <Route path='/publicpolls' element={<PublicPolls/>}/>
          <Route path='/poll/:id' element={<PollVoting/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App