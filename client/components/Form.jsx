'use client'

import { useState } from "react"
import axios from "axios"

const Form = ({ onLogin }) => {
    const [data, setData] = useState({
        username: '',
        password: '',
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = (event) => {
            event.preventDefault();
            axios.post('https://3000-emanuelgust-expressauth-9r32l4zhkks.ws-eu104.gitpod.io/users/login', {
                username: data.username,
                password: data.password
            })
            .then(response => {
                const { accessToken } = response.data
                onLogin(accessToken)
            })
            .catch(error => {
                console.log('Error', error)
            })
    }

  return (
    <div>
        <form>
            <input placeholder='username' type='text' name='username' value={data.username} onChange={handleChange}>
            </input>
            <input placeholder='password' type="password" name='password' value={data.password} onChange={handleChange}/>
            <button type='submit' onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default Form