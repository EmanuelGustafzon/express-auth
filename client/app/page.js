'use client'
const jwt = require('jsonwebtoken');
import ProtectedRoute from '@components/ProtectedRoute'
import Form from '@components/Form'
import { useState } from 'react'

export default function Home() {
  const  [ token, setToken ] = useState({
    accessToken: '',
    refreshToken: ''
  }) 

  const handleLogin = async ( accessToken, refreshToken ) => {
    setToken({
      accessToken: accessToken,
      refreshToken: refreshToken
    });
    try {
      await localStorage.setItem("accessToken", accessToken);     
      localStorage.setItem("refreshToken", refreshToken);     
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
