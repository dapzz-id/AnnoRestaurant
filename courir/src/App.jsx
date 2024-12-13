import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Add from './pages/Add/Add'
import Edit from './pages/Edit/Edit'
import User from './pages/User/User'
import UserLog from './pages/UserLog/UserLog'
import Dashboard from './pages/Dashboard/Dashboard'
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { useState } from 'react';
  import Login from './components/Login/Login';
  import { useEffect } from 'react';
 export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    }
  }, [token])
  

  const url = "http://localhost:4000";

  return (
    <div>
      {token === ""
      ? <Login setToken={setToken}/> 
      :
      <>
      <ToastContainer/>
      <Navbar setToken={setToken}/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
        <Route path="/userlog" element={<UserLog token={token} url={url}/>}/>
          <Route path="/add" element={<Add token={token} url={url}/>}/>
          <Route path="/edit" element={<Edit token={token} url={url}/>}/>
          <Route path="/list" element={<List token={token} url={url}/>}/>
          <Route path="/orders" element={<Orders token={token} url={url}/>}/>
          <Route path="/user" element={<User token={token} url={url}/>}/>
          <Route path="/dashboard" element={<Dashboard token={token} url={url}/>}/>
        </Routes>
      </div>
      </>
      }
   
    </div>
  )
}

export default App
