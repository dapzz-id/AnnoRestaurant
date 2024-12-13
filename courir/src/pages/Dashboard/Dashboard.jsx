import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaMotorcycle, FaBoxOpen, FaMoneyBillWave, FaClipboardList, FaChartLine, FaUserCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';

const Dashboard = ({ url }) => {
  const [pengirimanSukses, setPengirimanSukses] = useState(0);
  const [pendapatanTotal, setPendapatanTotal] = useState(0);
  const [pesananMenunggu, setPesananMenunggu] = useState(0);
  const [pertumbuhanPendapatan, setPertumbuhanPendapatan] = useState(15);
  const [pesananTerbaru, setPesananTerbaru] = useState([]);
  const [namaKurir, setNamaKurir] = useState('');
  const [kurirId, setKurirId] = useState('');
  const [dataPengirimanBulanan, setDataPengirimanBulanan] = useState([]);
  const [dataPendapatanBulanan, setDataPendapatanBulanan] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedKurirNama = localStorage.getItem('kurirNama');
        const savedKurirId = localStorage.getItem('kurirId');
        if (savedKurirNama) setNamaKurir(savedKurirNama);
        if (savedKurirId) setKurirId(savedKurirId);

        const completedResponse = await axios.get(`${url}/api/order/completed/${savedKurirId}`);
        const completedOrders = completedResponse.data.data;
        setPengirimanSukses(completedOrders.length);

        // Hitung pendapatan total dan pendapatan bulanan
        const { totalPendapatan, pendapatanBulanan } = hitungPendapatan(completedOrders);
        setPendapatanTotal(totalPendapatan);
        setDataPendapatanBulanan(pendapatanBulanan);

        const allOrdersResponse = await axios.get(`${url}/api/order/list`);
        const allOrders = allOrdersResponse.data.data;
        const pendingOrders = allOrders.filter(order => order.status === 'Pending');
        setPesananMenunggu(pendingOrders.length);

        setPesananTerbaru(completedOrders.slice(0, 5).map(order => ({
          id: order._id,
          pelanggan: `${order.address.firstName} ${order.address.lastName}`,
          alamat: `${order.address.street}, ${order.address.city}`,
          status: translateStatus(order.status),
          items: order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')
        })));

        // Simulasi data pengiriman dan pendapatan bulanan
        setDataPengirimanBulanan(generateMonthlyData(completedOrders.length));

      } catch (error) {
        console.error('Gagal mengambil data pesanan:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [url]);

  const generateMonthlyData = (total) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return months.map((month, index) => ({
      bulan: month,
      nilai: Math.floor((index + 1) * total / 12)
    }));
  };

  function translateStatus(status) {
    const statusMap = {
      'Pending': 'Menunggu',
      'Food Processing': 'Diproses',
      'Out for delivery': 'Dikirim',
      'Delivered': 'Terkirim',
      'Completed': 'Selesai'
    };
    return statusMap[status] || status;
  }

  const hitungPendapatan = (orders) => {
    const pendapatanBulanan = Array(12).fill(0);
    let totalPendapatan = 0;

    orders.forEach(order => {
      const foodTotal = order.items.reduce((itemTotal, item) => itemTotal + (item.price * item.quantity), 0);
      const deliveryFee = order.amount - foodTotal;
      const completedDate = new Date(order.completedAt);
      const month = completedDate.getMonth();

      pendapatanBulanan[month] += deliveryFee;
      totalPendapatan += deliveryFee;
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const formattedPendapatanBulanan = months.map((month, index) => ({
      bulan: month,
      nilai: pendapatanBulanan[index] * 1000 // Konversi ke Rupiah
    }));

    return { totalPendapatan: totalPendapatan * 1000, pendapatanBulanan: formattedPendapatanBulanan };
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Kurir AnoRestaurant</h1>
        <div className="user-info">
          <FaUserCircle className="user-icon" />
          <div>
            <h2 className="welcome-message">{`Halo, ${namaKurir}`}</h2>
            <p className="kurir-id">{`ID Kurir: ${kurirId}`}</p>
          </div>
        </div>
      </header>
      
      <div className="stats-grid">
        <StatCard icon={<FaBoxOpen />} title="Pengiriman Sukses" value={pengirimanSukses} />
        <StatCard 
          icon={<FaMoneyBillWave />} 
          title="Pendapatan Total" 
          value={`Rp ${pendapatanTotal.toLocaleString('id-ID')}`} 
        />
        <StatCard icon={<FaClipboardList />} title="Pesanan Menunggu" value={pesananMenunggu} />
        <StatCard icon={<FaChartLine />} title="Pertumbuhan Pendapatan" value={`${pertumbuhanPendapatan}%`} />
      </div>
      
      <div className="charts-container">
        <div className="chart">
          <h3>Grafik Pengiriman Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPengirimanBulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nilai" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h3>Grafik Pendapatan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataPendapatanBulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
              <Legend />
              <Line type="monotone" dataKey="nilai" stroke="#2ecc71" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="recent-orders">
        <h3>Pesanan Terbaru</h3>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>ID Pesanan</th>
                <th>Nama Pelanggan</th>
                <th>Alamat Pengiriman</th>
                <th>Item Pesanan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pesananTerbaru.map((pesanan, index) => (
                <tr key={index}>
                  <td>{pesanan.id}</td>
                  <td>{pesanan.pelanggan}</td>
                  <td>{pesanan.alamat}</td>
                  <td>{pesanan.items}</td>
                  <td>
                    <span className={`badge badge-${getStatusColor(pesanan.status)}`}>
                      {pesanan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const getStatusColor = (status) => {
  const colorMap = {
    'diproses': 'primary',
    'dikirim': 'info',
    'terkirim': 'success',
    'selesai': 'secondary',
    'menunggu': 'warning'
  };
  return colorMap[status.toLowerCase()] || 'warning';
};

export default Dashboard;
