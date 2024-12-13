import React from 'react';
import './UpcomingMenu.css';
import { assets } from '../../assets/assets';

const ResepPopuler = () => {
  const resepList = [
    {
      id: 1,
      nama: 'Nasi Goreng Spesial',
      waktuMasak: '30 menit',
      tingkatKesulitan: 'Mudah',
      gambar: assets.food_1,
    },
    {
      id: 2,
      nama: 'Soto Ayam',
      waktuMasak: '45 menit',
      tingkatKesulitan: 'Sedang',
      gambar: assets.food_2,
    },
    {
      id: 3,
      nama: 'Rendang Daging',
      waktuMasak: '120 menit',
      tingkatKesulitan: 'Sulit',
      gambar: assets.food_3,
    }
  ];

  return (
    <div className="resep-populer-container">
      <h2>Resep Populer Minggu Ini</h2>
      <div className="resep-list">
        {resepList.map((item) => (
          <div key={item.id} className="resep-item">
            <img src={item.gambar} alt={item.nama} className="gambar-resep" />
            <div className="resep-info">
              <h3>{item.nama}</h3>
              <p>Waktu Memasak: {item.waktuMasak}</p>
              <p>Tingkat Kesulitan: {item.tingkatKesulitan}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResepPopuler;
