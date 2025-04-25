import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Bookmarks from './pages/Dashboard/Bookmarks'
import CreatePolls from './pages/Dashboard/CreatePolls'
import MyPolls from './pages/Dashboard/MyPolls'
import VotedPolls from './pages/Dashboard/VotedPolls';
import LoginForm from './pages/Auth/LoginForm'
import SignUpForm from './pages/Auth/SignUpForm'
 
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/login' element={<LoginForm/>}/>
          <Route path='/signup' element={<SignUpForm/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/bookmarks' element={<Bookmarks/>}/>
          <Route path='/createpolls' element={<CreatePolls/>}/>
          <Route path='/mypolls' element={<MyPolls/>}/>
          <Route path='/votedpolls' element={<VotedPolls/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App