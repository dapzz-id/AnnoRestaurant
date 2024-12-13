import React from 'react'
import './Information.css'
import {assets} from '../../assets/assets'

const Information = () => {
  return (
    <div className="information" id="Information">
      <div className="info-container">
        <div className="info-side">
          <div className="info-item">
            <h3>Pelayanan Cepat</h3>
            <p>Kami menjamin pesanan Anda akan disiapkan dan disajikan dengan cepat tanpa mengorbankan kualitas.</p>
          </div>
          <div className="info-item">
            <h3>Harga Terjangkau</h3>
            <p>Nikmati hidangan lezat kami dengan harga yang ramah di kantong, cocok untuk semua kalangan.</p>
          </div>
        </div>
        
        <div className="info-center">
          <h2>Tentang Restoran Kami</h2>
          <p>Restoran kami menawarkan pengalaman kuliner yang unik dengan menu Indonesia autentik. Kami berkomitmen untuk menggunakan bahan-bahan segar dan berkualitas tinggi untuk setiap hidangan. Suasana yang nyaman dan pelayanan ramah menjadikan restoran kami tempat ideal untuk menikmati makanan bersama keluarga dan teman.</p>
          <div>
            <img src={assets.andar_man} alt="Andar Man" className='andar-man'/>
          </div>
        </div>
        
        <div className="info-side">
          <div className="info-item">
            <h3>Pengiriman Cepat</h3>
            <p>Layanan pengiriman kami yang cepat memastikan makanan Anda tiba dalam kondisi hangat dan segar.</p>
          </div>
          <div className="info-item">
            <h3>Menu Beragam</h3>
            <p>Kami menyajikan berbagai pilihan menu yang dapat memenuhi selera dan kebutuhan diet yang berbeda-beda.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Information
