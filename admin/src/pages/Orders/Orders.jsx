import React from 'react';
import './Orders.css';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { assets } from '../../../../frontend/src/assets/assets';
import axios from "axios";

const Orders = ({url}) => {
  const [orders, setOrders] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedDeleteOrderId, setSelectedDeleteOrderId] = useState(null);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalPesanan, setTotalPesanan] = useState(0);
  const [orderanBerlangsung, setOrderanBerlangsung] = useState(0);
  const [popularFoods, setPopularFoods] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const sortedOrders = response.data.data.sort((a, b) => {
          if (a.status === "Completed" && b.status !== "Completed") return 1;
          if (a.status !== "Completed" && b.status === "Completed") return -1;
          return new Date(b.date) - new Date(a.date);
        });
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
        
        // Hitung total pendapatan dan jumlah pesanan
        const total = sortedOrders.reduce((acc, order) => acc + order.amount, 0);
        setTotalPendapatan(total * 1000); // Kalikan dengan 1000 karena amount dalam ribuan
        setTotalPesanan(sortedOrders.length);
        
        // Hitung orderan yang sedang berlangsung (belum diklik selesai)
        const ongoingOrders = sortedOrders.filter(order => order.status !== "Completed");
        setOrderanBerlangsung(ongoingOrders.length);

        // Hitung makanan yang sering dibeli
        const foodCounts = {};
        sortedOrders.forEach(order => {
          order.items.forEach(item => {
            if (foodCounts[item.name]) {
              foodCounts[item.name] += item.quantity;
            } else {
              foodCounts[item.name] = item.quantity;
            }
          });
        });
        setPopularFoods(foodCounts);
      } else {
        toast.error("Gagal mengambil data pesanan");
      }
    } catch (error) {
      console.error("Error mengambil data pesanan:", error);
      toast.error("Terjadi kesalahan saat mengambil data pesanan");
    }
  };

  const handleDeleteOrder = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (order && order.status === "Terkirim") {
      setSelectedDeleteOrderId(orderId);
      setShowDeleteConfirmation(true);
    } else if (order && order.status === "Selesai") {
      toast.error("Pesanan yang telah selesai tidak dapat dihapus");
    } else {
      toast.error("Pesanan hanya dapat dihapus jika sudah dikirim");
    }
  };

  const deleteOrder = async () => {
    try {
      const response = await axios.delete(`${url}/api/order/delete/${selectedDeleteOrderId}`);
      if (response.data.success) {
        toast.success("Pesanan berhasil dihapus");
        await fetchAllOrders();
      } else {
        toast.error("Gagal menghapus pesanan");
      }
    } catch (error) {
      console.error("Error menghapus pesanan:", error);
      toast.error("Terjadi kesalahan saat menghapus pesanan");
    } finally {
      setShowDeleteConfirmation(false);
      setSelectedDeleteOrderId(null);
    }
  };

  const handleCompleteOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmation(true);
  };

  const completeOrder = async () => {
    try {
      const response = await axios.post(`${url}/api/order/complete/${selectedOrderId}`, {
        status: "Completed",
        completedAt: new Date().toISOString(),
        completedBy: "Admin" // Menambahkan informasi bahwa pesanan diselesaikan oleh Admin
      });
      if (response.data.success) {
        toast.success("Pesanan berhasil diselesaikan oleh Admin");
        await fetchAllOrders();
      } else {
        toast.error("Gagal menyelesaikan pesanan");
      }
    } catch (error) {
      console.error("Error menyelesaikan pesanan:", error);
      toast.error("Terjadi kesalahan saat menyelesaikan pesanan");
    } finally {
      setShowConfirmation(false);
      setSelectedOrderId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success(`Status pesanan berubah menjadi ${newStatus}`);
      } else {
        toast.error("Gagal memperbarui status pesanan");
      }
    } catch (error) {
      console.error("Error memperbarui status pesanan:", error);
      toast.error("Terjadi kesalahan saat memperbarui status pesanan");
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className='order add'>
      <h3>Halaman Pesanan</h3>
      <div className="order-summary">
        {/* <p>Total Pendapatan: Rp {formatPrice(totalPendapatan)}</p>
        <p>Jumlah Pesanan: {totalPesanan}</p>
        <p>Orderan Sedang Berlangsung: {orderanBerlangsung}</p> */}
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari ID Pesanan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="order-list">
        <h4>Pesanan Aktif</h4>
        {filteredOrders.filter(order => order.status !== "Completed").map((order, index) => (
          <OrderItem
            key={order._id}
            order={order}
            updateOrderStatus={updateOrderStatus}
            handleDeleteOrder={handleDeleteOrder}
            handleCompleteOrder={handleCompleteOrder}
            formatPrice={formatPrice}
          />
        ))}
        <h4>Pesanan Selesai</h4>
        {filteredOrders.filter(order => order.status === "Completed").map((order, index) => (
          <OrderItem
            key={order._id}
            order={order}
            updateOrderStatus={updateOrderStatus}
            handleDeleteOrder={handleDeleteOrder}
            handleCompleteOrder={handleCompleteOrder}
            formatPrice={formatPrice}
            isCompleted={true}
          />
        ))}
      </div>
      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
          <p>Apakah Anda yakin ingin menyelesaikan pesanan ini?</p>
            <button onClick={completeOrder}>Ya</button>
            <button onClick={() => setShowConfirmation(false)}>Tidak</button>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
          <p>Apakah Anda yakin ingin menghapus pesanan ini?</p>
            <button onClick={deleteOrder}>Ya</button>
            <button onClick={() => setShowDeleteConfirmation(false)}>Tidak</button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderItem = ({ order, updateOrderStatus, handleDeleteOrder, handleCompleteOrder, formatPrice, isCompleted }) => (
  <div className={`order-item ${isCompleted ? 'completed' : ''}`}>
    <img src={assets.parcel_icon} alt="" />
    <div>
      <p className='order-item-id'>ID Pesanan: {order._id}</p>
      <p className='order-item-food'>
        {order.items.map((item, index) => (
          index === order.items.length - 1
            ? `${item.name} x ${item.quantity}`
            : `${item.name} x ${item.quantity}, `
        ))}
      </p>
      <p className="order-item-name">{`${order.address.firstName} ${order.address.lastName}`}</p>
      <div className="order-item-address">
        <p>Alamat Lengkap:</p>
        <p>Jalan: {order.address.street}</p>
        <p>Kota: {order.address.city}</p>
        <p>Provinsi: {order.address.state}</p>
        <p>Negara: {order.address.country}</p>
        <p>Kecamatan: {order.address.district}</p>
        <p>Email: {order.address.email}</p>
        <p>Telepon: {order.address.phone}</p>
      </div>
    </div>
    <p>Item : {order.items.length}</p>
    <p>{formatPrice(order.amount * 1000)}</p>
    {!isCompleted ? (
      <>
        <p>Status: {order.status}</p>
        <select 
          value={order.status} 
          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
        >
          <option value="Pending">Menunggu</option>
          <option value="Food Processing">Sedang Diproses</option>
          <option value="Out for delivery">Dalam Pengiriman</option>
          <option value="Delivered">Terkirim</option>
        </select>
        {order.status === "Delivered" && (
          <button onClick={() => handleDeleteOrder(order._id)} className="delete-button">Hapus Pesanan</button>
        )}
        <button onClick={() => handleCompleteOrder(order._id)} className="complete-button">Selesaikan Pesanan</button>
      </>
    ) : (
      <>
        <p className="completed-status">Pesanan Telah Selesai</p>
        <p className="completed-by">Diselesaikan oleh: {order.completedBy || "Tidak diketahui"}</p>
      </>
    )}
  </div>
);

export default Orders;
