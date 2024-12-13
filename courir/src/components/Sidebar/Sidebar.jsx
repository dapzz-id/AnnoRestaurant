import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaPlus, FaEdit, FaList, FaShoppingCart, FaCheckCircle, FaUserClock } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
      <NavLink to='/dashboard' className="sidebar-option">
            <FaTachometerAlt />
            <p>Dashboard</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <FaShoppingCart />
            <p>Orders</p>
        </NavLink>
        <NavLink to='/user' className="sidebar-option">
            <FaCheckCircle />
            <p>Orders Success</p>
        </NavLink>

        
      </div>
    </div>
  )
}

export default Sidebar
