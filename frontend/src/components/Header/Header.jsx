import React, { useContext } from 'react'
import './Header.css'
import { StoreContext } from '../../context/StoreContext'

const Header = () => {
  const { user, cart } = useContext(StoreContext)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div className='Header'>
      <div className="header-contents"> 
        <h2>{getGreeting()}! Selamat datang di AnoRestaurant</h2>
        {user && (
          <p>
            {cart.length > 0 
              ? `Ada ${cart.length} item di keranjang. Siap pesan?` 
              : 'Keranjang kosong. Yuk, mulai pesan!'}
          </p>
        )}
        <p>Rasakan kelezatan masakan kami yang autentik dan inovatif, mulai dari hidangan tradisional yang menggugah selera hingga kreasi modern yang memanjakan lidah. Kami hadirkan pengalaman kuliner terbaik untuk memuaskan setiap selera dan membuat momen bersantap Anda menjadi tak terlupakan!</p>
        <a href='#explore-menu'><button>Lihat Menu</button></a>
      </div>
    </div>
  )
}

export default Header
