import React from 'react'
import authImage from '../../assets/images/profile-bg.JPG'

const AuthLayout = ({children}) => {
  return (
    <div className="flex">
      <div className='w-screen h-screen md:w-2/3 px-12 pt-8 pb-12'>

      {children}
      </div>

      <div className='hidden md:flex w-2/3 h-screen bg-sky-10 overflow-hidden relative items-center justify-center'>
        <img 
          src={authImage} 
          alt="Authentication" 
          className="w-100 h-100 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-blue-500/10"></div>
      </div>
    </div>
  )
}

export default AuthLayout