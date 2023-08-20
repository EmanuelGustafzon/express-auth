'use client'
import ProtectedRoute from '@components/ProtectedRoute'
import Form from '@components/Form'
import { useState } from 'react'

export default function Home() {
  const  [ token, setToken ] = useState('') 

  const handleLogin = async ( accessToken ) => {
    setToken( accessToken )
    try {
      await localStorage.setItem( "accessToken" , accessToken );
    } catch ( error ) {
      console.log(error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <Form onLogin={handleLogin}/>
      <ProtectedRoute/>
    </div>
  )
}
