import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaPlus, FaEdit, FaList, FaShoppingCart, FaCheckCircle, FaUserClock, FaMotorcycle, FaMoneyBill } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
      <NavLink to='/dashboard' className="sidebar-option">
            <FaTachometerAlt />
            <p>Dashboard</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
            <FaPlus />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/edit' className="sidebar-option">
            <FaEdit />
            <p>Edit Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <FaList />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/totalpenjualan' className="sidebar-option">
            <FaMoneyBill />
            <p>Total Penjualan</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <FaShoppingCart />
            <p>Orders</p>
        </NavLink>
        <NavLink to='/user' className="sidebar-option">
            <FaCheckCircle />
            <p>Orders Success</p>
        </NavLink>
        <NavLink to='/userlog' className="sidebar-option">
            <FaUserClock />
            <p>Buat Akun Kurir</p>
        </NavLink>
        <NavLink to='/courir' className="sidebar-option">
            <FaMotorcycle />
            <p>Daftar Kurir</p>
        </NavLink>
        
        
      </div>
    </div>
  )
}

export default Sidebar
