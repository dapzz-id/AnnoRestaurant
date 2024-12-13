import React, { useState, useEffect } from 'react';
import './UserLog.css';

const UserLog = () => {
  const [couriers, setCouriers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const couriersPerPage = 10;

  useEffect(() => {
    // Data dummy untuk daftar kurir
    const dummyCouriers = [
      { _id: 1, name: 'Budi Santoso', email: 'budi@example.com', lastDelivery: '2023-06-15T08:30:00Z', image: 'https://example.com/budi.jpg' },
      { _id: 2, name: 'Siti Rahayu', email: 'siti@example.com', lastDelivery: '2023-06-14T14:45:00Z', image: 'https://example.com/siti.jpg' },
      { _id: 3, name: 'Agus Setiawan', email: 'agus@example.com', lastDelivery: '2023-06-13T10:15:00Z', image: 'https://example.com/agus.jpg' },
      { _id: 4, name: 'Dewi Lestari', email: 'dewi@example.com', lastDelivery: '2023-06-12T16:20:00Z', image: 'https://example.com/dewi.jpg' },
      { _id: 5, name: 'Eko Prasetyo', email: 'eko@example.com', lastDelivery: '2023-06-11T09:00:00Z', image: 'https://example.com/eko.jpg' },
      { _id: 6, name: 'Rina Wati', email: 'rina@example.com', lastDelivery: '2023-06-10T11:30:00Z', image: 'https://example.com/rina.jpg' },
      { _id: 7, name: 'Joko Widodo', email: 'joko@example.com', lastDelivery: '2023-06-09T13:45:00Z', image: 'https://example.com/joko.jpg' },
      { _id: 8, name: 'Ani Yudhoyono', email: 'ani@example.com', lastDelivery: '2023-06-08T15:10:00Z', image: 'https://example.com/ani.jpg' },
      { _id: 9, name: 'Bambang Susilo', email: 'bambang@example.com', lastDelivery: '2023-06-07T17:25:00Z', image: 'https://example.com/bambang.jpg' },
      { _id: 10, name: 'Mega Wati', email: 'mega@example.com', lastDelivery: '2023-06-06T12:00:00Z', image: 'https://example.com/mega.jpg' },
      { _id: 11, name: 'Hadi Tjahjanto', email: 'hadi@example.com', lastDelivery: '2023-06-05T10:30:00Z', image: 'https://example.com/hadi.jpg' },
      { _id: 12, name: 'Sri Mulyani', email: 'sri@example.com', lastDelivery: '2023-06-04T14:15:00Z', image: 'https://example.com/sri.jpg' },
    ];

    setCouriers(dummyCouriers);
  }, []);

  // Logika paginasi dan pencarian
  const filteredCouriers = couriers.filter(courier =>
    courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourier = currentPage * couriersPerPage;
  const indexOfFirstCourier = indexOfLastCourier - couriersPerPage;
  const currentCouriers = filteredCouriers.slice(indexOfFirstCourier, indexOfLastCourier);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="courier-list-container">
      <h2 className="courier-list-title">Daftar Kurir</h2>
      
      <input
        type="text"
        placeholder="Cari berdasarkan nama atau email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <ul className="courier-list">
        {currentCouriers.map((courier) => (
          <li key={courier._id} className="courier-item">
            <img src={courier.image} alt={courier.name} className="courier-image" />
            <div className="courier-info">
              <h3>{courier.name}</h3>
              <p>{courier.email}</p>
              <p>Pengiriman Terakhir: {new Date(courier.lastDelivery).toLocaleString('id-ID')}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredCouriers.length / couriersPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className="page-button">
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserLog;