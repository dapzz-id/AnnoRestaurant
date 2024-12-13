import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { FaHome, FaUtensils, FaInfoCircle, FaEnvelope, FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaClipboardList, FaHistory, FaSignInAlt } from 'react-icons/fa';

const Navbar = ({setShowLogin}) => {
    const [activeMenu, setActiveMenu] = useState("home");
    const [isSticky, setIsSticky] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileRef = useRef(null);
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
        setShowLogoutConfirm(false);
        setShowProfileDropdown(false);
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
            setIsSticky(currentScrollPos > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleLoginClick = () => {
        document.body.style.overflow = 'hidden';
        setShowLogin(true);
    }

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const section = document.getElementById(sectionId);
        if (section) {
            const yOffset = -80;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    }

    const menuItems = [
        { path: '/', label: 'Beranda', onClick: () => navigate('/') },
        { path: '#explore-menu', label: 'Menu', onClick: (e) => scrollToSection(e, 'explore-menu') },
        { path: '#Information', label: 'Informasi Aplikasi', onClick: (e) => scrollToSection(e, 'Information') },
        { path: '#footer', label: 'Hubungi Kami', onClick: (e) => scrollToSection(e, 'footer') }
    ];

    const handleMenuClick = (label, onClick, e) => {
        setActiveMenu(label.toLowerCase());
        onClick(e);
    }

    const handleProfileClick = () => {
        setShowProfileDropdown(!showProfileDropdown);
    }

    const handleProfileOptionClick = (action) => {
        setShowProfileDropdown(false);
        switch(action) {
            case 'myorders':
                navigate('/myorders');
                break;
            case 'history':
                navigate('/history');
                break;
            case 'logout':
                setShowLogoutConfirm(true);
                break;
            default:
                break;
        }
    }

    return (
        <nav className={`navbar ${isSticky ? 'sticky' : ''} ${!visible ? 'hidden' : ''}`}>
            <Link to='/'><img src={assets.logo} alt="Logo AnoRestaurant" className="logo" /></Link>
            <ul className="navbar-menu">
                {menuItems.map(item => (
                    <li key={item.label} className={activeMenu === item.label.toLowerCase() ? 'active' : ''}>
                        <a 
                            href={item.path} 
                            onClick={(e) => handleMenuClick(item.label, item.onClick, e)}
                        >
                            {item.icon} {item.label}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="navbar-right">
                <Link to='/search' className="navbar-icon-search">
                    <FaSearch />
                </Link>
                <Link to='/cart' className="navbar-icon navbar-search-icon">
                    {token && <FaShoppingCart />}
                    {getTotalCartAmount() > 0 && <div className="dot"></div>}
                </Link>
                {!token ? (
                    <button onClick={handleLoginClick}>
                        <FaSignInAlt /> Masuk
                    </button>
                ) : (
                    <div className='navbar-profile' ref={profileRef} onClick={handleProfileClick}>
                        <FaUser className="profile-icon" />
                        <span className="profile-text">Profil Saya</span>
                        {showProfileDropdown && (
                            <ul className="nav-profile-dropdown">
                                <li onClick={() => handleProfileOptionClick('myorders')}>
                                    <FaClipboardList /> Pesanan Saya
                                </li>
                                <li onClick={() => handleProfileOptionClick('history')}>
                                    <FaHistory /> Riwayat Pembelian
                                </li>
                                <hr />
                                <li className="logout-option" onClick={() => handleProfileOptionClick('logout')}>
                                    <FaSignOutAlt /> Keluar
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-popup">
                        <h3>Konfirmasi Keluar</h3>
                        <p>Apakah Anda yakin ingin keluar?</p>
                        <div className="logout-confirm-buttons">
                            <button onClick={logout}>Ya, Keluar</button>
                            <button onClick={() => setShowLogoutConfirm(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
