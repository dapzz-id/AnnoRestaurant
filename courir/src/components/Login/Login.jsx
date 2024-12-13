import React, { useState } from 'react'
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
            const response = await axios.post(backendUrl + '/api/kurir/login', {email, password})
            if (response.data.token) {
                setToken(response.data.token)
                const kurirId = response.data.kurirId
                const profilResponse = await axios.get(`${backendUrl}/api/kurir/profil/${kurirId}`)
                const namaKurir = profilResponse.data.nama
                localStorage.setItem('kurirNama', namaKurir) // Menyimpan nama kurir di localStorage
                localStorage.setItem('kurirId', kurirId) // Menyimpan ID kurir di localStorage
                toast.success(`Halo, selamat datang ${namaKurir}!`)
            } else {
                toast.error('Login gagal')
            }
        }
        catch (error) {
            console.log(error)
            toast.error('Terjadi kesalahan saat login')
        }
    }

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login Kurir</h1>
        <form onSubmit={onSubmitHandler}>
            <div className="input-group">
                <p>Email Address</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='input-login' type="email" placeholder='Masukan Email Kurir' required />
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
