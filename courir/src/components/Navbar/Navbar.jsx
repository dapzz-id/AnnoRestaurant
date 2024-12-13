import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = ({setToken}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/login')
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false)
  }

  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <img className='logo' src={assets.logo} alt="Logo Restoran" />
      </div>
      <div className='navbar-center'>
        <p className='current-date'>{formatDate(currentDateTime)}</p>
        {/* <p className='current-time'>{currentDateTime.toLocaleTimeString('id-ID')}</p> */}
      </div>
      {!showLogoutConfirmation && (
        <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
      )}
      {showLogoutConfirmation && (
        <div className='logout-confirmation'>
          <p>Apakah Anda yakin ingin keluar?</p>
          <button onClick={handleLogoutConfirm} className='confirm-button'>Ya</button>
          <button onClick={handleLogoutCancel} className='cancel-button'>Tidak</button>
        </div>
      )}
    </div>
   
  )
}

export default Navbar
