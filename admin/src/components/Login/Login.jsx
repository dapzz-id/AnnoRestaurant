import  React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { backendUrl } from '../../App.jsx'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin', {email,password})
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Admin Login</h1>
        <form onSubmit={onSubmitHandler}>
            <div className="input-group">
                <p>Email Address</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='input-login' type="email" placeholder='Masukan Email' required />
            </div>
            <div className="input-group">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='input-login' type="password" placeholder='Masukan Password' required />
            </div>
            <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
