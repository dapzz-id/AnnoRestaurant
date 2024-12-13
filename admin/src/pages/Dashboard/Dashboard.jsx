import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaShoppingCart, FaUsers, FaMoneyBillWave, FaBoxOpen, FaUtensils, FaTruck } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';


const Dashboard = ({ url }) => {
  const [totalMakanan, setTotalMakanan] = useState(0);
  const [orderanSukses, setOrderanSukses] = useState(0);
  const [orderanBerlangsung, setOrderanBerlangsung] = useState(0);
  const [pendapatanTotal, setPendapatanTotal] = useState(0);
  const [produkTerlaris, setProdukTerlaris] = useState([]);
  const [jumlahAkunUser, setJumlahAkunUser] = useState(0);
  const [jumlahKurir, setJumlahKurir] = useState(0);
  const [pesananTerbaru, setPesananTerbaru] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFood = await axios.get(`${url}/api/food/list`);
        if (responseFood.data.success) {
          setTotalMakanan(responseFood.data.data.length);
        }

        const responseOrders = await axios.get(`${url}/api/order/completed`);
        if (responseOrders.data.success) {
          setOrderanSukses(responseOrders.data.data.length);
          // Hitung pendapatan total
          const total = responseOrders.data.data.reduce((acc, order) => acc + order.amount, 0);
          setPendapatanTotal(total);

          // Hitung produk terlaris
          const foodCounts = {};
          responseOrders.data.data.forEach(order => {
            order.items.forEach(item => {
              if (foodCounts[item.name]) {
                foodCounts[item.name] += item.quantity;
              } else {
                foodCounts[item.name] = item.quantity;
              }
            });
          });

          const sortedProducts = Object.entries(foodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

          setProdukTerlaris(sortedProducts);
        }

        const responseOngoingOrders = await axios.get(`${url}/api/order/list`);
        if (responseOngoingOrders.data.success) {
          const ongoingOrders = responseOngoingOrders.data.data.filter(order => order.status !== "Completed");
          setOrderanBerlangsung(ongoingOrders.length);
          
          // Ambil 5 pesanan terbaru
          const latestOrders = responseOngoingOrders.data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(-5)
            .reverse()
            .map(order => ({
              id: order._id,
              pelanggan: `${order.address.firstName} ${order.address.lastName}`,
              total: `Rp ${(order.amount * 1000).toLocaleString('id-ID')}`,
              status: translateStatus(order.status)
            }));
          setPesananTerbaru(latestOrders);

          function translateStatus(status) {
            switch (status) {
              case 'Pending':
                return 'Menunggu';
              case 'Processing':
                return 'Diproses';
              case 'Shipped':
                return 'Dikirim';
              case 'Delivered':
                return 'Terkirim';
              case 'Completed':
                return 'Selesai';
              case 'Cancelled':
                return 'Dibatalkan';
              default:
                return status;
            }
          }
        }

        // Ambil jumlah akun user dari database
        const responseUsers = await axios.get(`${url}/api/user/total`);
        if (responseUsers.data.success) {
          setJumlahAkunUser(responseUsers.data.count);
        }

        // Ambil jumlah kurir dari database
        const responseCouriers = await axios.get(`${url}/api/kurir/list`);
        if (responseCouriers.data.success) {
          setJumlahKurir(responseCouriers.data.kurirs.length);
        }
      } catch (error) {
        console.error("Error mengambil data:", error);
      }
    };

    fetchData();

    // Set up polling untuk memperbarui pesanan terbaru setiap 30 detik
    const intervalId = setInterval(fetchData, 30000);

    // Membersihkan interval saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, [url]);

  // Data dummy untuk grafik penjualan bulanan
  const dataPenjualanBulanan = [
    { bulan: 'Jan', penjualan: 4000 },
    { bulan: 'Feb', penjualan: 3000 },
    { bulan: 'Mar', penjualan: 5000 },
    { bulan: 'Apr', penjualan: 4500 },
    { bulan: 'Mei', penjualan: 6000 },
    { bulan: 'Jun', penjualan: 5500 },
    { bulan: 'Jul', penjualan: 7000 },
    { bulan: 'Agu', penjualan: 6500 },
    { bulan: 'Sep', penjualan: 8000 },
    { bulan: 'Okt', penjualan: 7500 },
    { bulan: 'Nov', penjualan: 9000 },
    { bulan: 'Des', penjualan: 10000 },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard AnoRestaurant</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxOpen />
          </div>
          <div className="stat-content">
            <h3>Orderan Sukses</h3>
            <p className="stat-value">{orderanSukses}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Orderan Sedang Berlangsung</h3>
            <p className="stat-value">{orderanBerlangsung}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
          <FaTruck />
          </div>
          <div className="stat-content">
          <h3>Jumlah Kurir</h3>
          <p className="stat-value">{jumlahKurir}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Jumlah Akun User</h3>
            <p className="stat-value">{jumlahAkunUser}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUtensils />
          </div>
          <div className="stat-content">
            <h3>Menu Tersedia</h3>
            <p className="stat-value">{totalMakanan}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
          <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Pendapatan Total</h3>
            <p className="stat-value">Rp {(pendapatanTotal * 1000).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart">
          <h3>Grafik Penjualan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPenjualanBulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="penjualan" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart">
          <h3>Produk Terlaris</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={produkTerlaris}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {produkTerlaris.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="recent-orders">
        <h3>Pesanan Terbaru</h3>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID Pesanan</th>
                <th scope="col">Nama Pelanggan</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {pesananTerbaru.map((pesanan, index) => (
                <tr key={index}>
                  <td>{pesanan.id}</td>
                  <td>{pesanan.pelanggan}</td>
                  <td>{pesanan.total}</td>
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

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'sedang diproses':
      return 'primary';
    case 'dalam pengiriman':
      return 'info';
    case 'terkirim':
      return 'success';
    default:
      return 'secondary';
  }
};

export default Dashboard;