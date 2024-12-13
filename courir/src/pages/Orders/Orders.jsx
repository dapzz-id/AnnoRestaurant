import React from "react";
import "./Orders.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { assets } from "../../../../frontend/src/assets/assets";
import axios from "axios";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalPesanan, setTotalPesanan] = useState(0);
  const [orderanBerlangsung, setOrderanBerlangsung] = useState(0);
  const [popularFoods, setPopularFoods] = useState({});
  const [showDeliveryWarning, setShowDeliveryWarning] = useState(false);
  const [showProcessingWarning, setShowProcessingWarning] = useState(false);
  const [currentCourier, setCurrentCourier] = useState(null);
  const [showProcessConfirmation, setShowProcessConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [courierName, setCourierName] = useState("");
  const [kurirId, setKurirId] = useState("");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const allOrders = response.data.data;
        
        // Memisahkan pesanan yang belum selesai dan yang pending
        const activeOrders = allOrders.filter(order => order.status !== "Completed" && order.status !== "Pending");
        const pendingOrders = allOrders.filter(order => order.status === "Pending");
        
        const sortedActiveOrders = activeOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        const sortedPendingOrders = pendingOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        setActiveOrders(sortedActiveOrders);
        setPendingOrders(sortedPendingOrders);

        const ordersWithEstimation = sortedActiveOrders.map((order) => ({
          ...order,
          estimatedDelivery: order.status === "Out for delivery" ? calculateEstimatedDelivery(order.status) : null,
          timer: null,
        }));
        setOrders(ordersWithEstimation);

        // Hitung statistik
        const total = allOrders.reduce((acc, order) => acc + order.amount, 0);
        setTotalPendapatan(total * 1000);
        setTotalPesanan(allOrders.length);
        setOrderanBerlangsung(activeOrders.length);
        setTotalPendingOrders(activeOrders.filter(order => order.status === "Pending").length);

        // Hitung makanan populer
        const foodCounts = {};
        allOrders.forEach((order) => {
          order.items.forEach((item) => {
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

  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/completed`);
      if (response.data.success) {
        setCompletedOrders(response.data.data);
      } else {
        toast.error("Gagal mengambil data pesanan selesai");
      }
    } catch (error) {
      console.error("Error mengambil data pesanan selesai:", error);
      toast.error("Terjadi kesalahan saat mengambil data pesanan selesai");
    }
  };

  const calculateEstimatedDelivery = (status) => {
    switch (status) {
      case "Out for delivery":
        return 45; // 45 menit
      default:
        return 0;
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
        courierName: courierName,
        kurirId: kurirId,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status pesanan berhasil diperbarui");
      } else {
        toast.error(
          response.data.message || "Gagal memperbarui status pesanan"
        );
      }
    } catch (error) {
      console.error("Error memperbarui status pesanan:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui status pesanan"
      );
    }
  };

  const handleDeliverOrder = async (orderId) => {
    if (currentCourier && currentCourier !== orderId) {
      setShowProcessingWarning(true);
      return;
    }
    
    const currentlyProcessing = orders.filter(order => 
      order.status === "Food Processing" && order.kurirId === kurirId
    ).length;

    if (currentlyProcessing > 0) {
      setShowProcessingWarning(true);
      return;
    }

    setSelectedOrderId(orderId);
    setShowProcessConfirmation(true);
  };

  const confirmProcessOrder = async () => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId: selectedOrderId,
        status: "Food Processing",
        courierName: courierName,
        kurirId: kurirId
      });
      if (response.data.success) {
        setCurrentCourier(selectedOrderId);
        await fetchAllOrders();
        toast.success(`Pesanan sedang diproses oleh ${courierName}`);
      } else {
        toast.error(response.data.message || "Gagal mengubah status pesanan");
      }
    } catch (error) {
      console.error("Error mengubah status pesanan:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat mengubah status pesanan");
    } finally {
      setShowProcessConfirmation(false);
      setSelectedOrderId(null);
    }
  };

  const handleCompleteOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmation(true);
  };

  const completeOrder = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/courier/complete/${selectedOrderId}`,
        {
          kurirId: kurirId,
          kurirNama: courierName,
          completedAt: new Date().toISOString()
        }
      );
      if (response.data.success) {
        setCurrentCourier(null);
        toast.success(`Pesanan berhasil diselesaikan oleh ${courierName} pada ${new Date().toLocaleString('id-ID')}`);
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

  const handleCancelProcessOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelConfirmation(true);
  };

  const confirmCancelProcessOrder = async () => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId: selectedOrderId,
        status: "Pending",
        courierName: "",
        kurirId: kurirId,
      });
      if (response.data.success) {
        setCurrentCourier(null);
        await fetchAllOrders();
        toast.success("Proses pesanan dibatalkan");
      } else {
        toast.error(
          response.data.message || "Gagal membatalkan proses pesanan"
        );
      }
    } catch (error) {
      console.error("Error membatalkan proses pesanan:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat membatalkan proses pesanan"
      );
    } finally {
      setShowCancelConfirmation(false);
      setSelectedOrderId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchCompletedOrders();
    const savedCourierName = localStorage.getItem("kurirNama");
    const savedCourierId = localStorage.getItem("kurirId");
    if (savedCourierName) {
      setCourierName(savedCourierName);
    }
    if (savedCourierId) {
      setKurirId(savedCourierId);
    }
  }, []);

  useEffect(() => {
    orders.forEach((order) => {
      if (order.status === "Out for delivery" && order.estimatedDelivery > 0) {
        order.timer = setTimeout(() => {
          updateOrderStatus(order._id);
        }, order.estimatedDelivery * 60 * 1000);
      }
    });

    return () => {
      orders.forEach((order) => {
        if (order.timer) {
          clearTimeout(order.timer);
        }
      });
    };
  }, [orders]);

  const updateOrderStatus = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (order.status === "Out for delivery") {
      try {
        const response = await axios.post(`${url}/api/order/status`, {
          orderId,
          status: "Delivered",
          courierName: order.courierName,
        });
        if (response.data.success) {
          await fetchAllOrders();
          toast.success("Status pesanan berubah menjadi Terkirim");
        } else {
          toast.error("Gagal memperbarui status pesanan");
        }
      } catch (error) {
        console.error("Error memperbarui status pesanan:", error);
        toast.error("Terjadi kesalahan saat memperbarui status pesanan");
      }
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="order add">
      <h3>Halaman Pesanan</h3>
      <div className="order-summary">
        {/* <p>Total Pendapatan: Rp {formatPrice(totalPendapatan)}</p>
        <p>Jumlah Pesanan: {totalPesanan}</p>
        <p>Orderan Sedang Berlangsung: {orderanBerlangsung}</p>
        <p>Total Pesanan Pending: {totalPendingOrders}</p> */}
      </div>
      <div className="order-list">
        {activeOrders.length > 0 && (
          <>
            <h4>Pesanan Aktif</h4>
            {activeOrders.map((order, index) => (
              <OrderItem
                key={order._id}
                order={order}
                statusHandler={statusHandler}
                handleCompleteOrder={handleCompleteOrder}
                handleCancelProcessOrder={handleCancelProcessOrder}
                formatPrice={formatPrice}
                kurirId={kurirId}
                currentCourier={currentCourier}
              />
            ))}
          </>
        )}

        <h4>Pesanan Belum Diproses</h4>
        {pendingOrders.map((order, index) => (
          <OrderItem
            key={order._id}
            order={order}
            handleDeliverOrder={handleDeliverOrder}
            formatPrice={formatPrice}
            currentCourier={currentCourier}
          />
        ))}
      </div>

      <div className="completed-order-list">
        <h4>Pesanan Selesai</h4>
        {completedOrders.map((order, index) => (
          <div key={index} className="order-item completed">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-id">ID Pesanan: {order._id}</p>
              <p className="order-item-food">
                {order.items.map((item, index) =>
                  index === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">{`${order.address.firstName} ${order.address.lastName}`}</p>
              <p className="order-item-courier">Kurir: {order.kurirNama || "Tidak diketahui"}</p>
              <p className="order-item-completed-at">Selesai pada: {new Date(order.completedAt).toLocaleString()}</p>
            </div>
            <p>{formatPrice(order.amount * 1000)}</p>
          </div>
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
      {showProcessConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
            <p>Apakah Anda yakin ingin memproses pesanan ini?</p>
            <button onClick={confirmProcessOrder}>Ya</button>
            <button onClick={() => setShowProcessConfirmation(false)}>
              Tidak
            </button>
          </div>
        </div>
      )}
      {showCancelConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
            <p>Apakah Anda yakin ingin membatalkan proses pesanan ini?</p>
            <button onClick={confirmCancelProcessOrder}>Ya</button>
            <button onClick={() => setShowCancelConfirmation(false)}>
              Tidak
            </button>
          </div>
        </div>
      )}
      {showDeliveryWarning && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
            <p>Anda hanya bisa mengantar satu pesanan dalam satu waktu.</p>
            <button onClick={() => setShowDeliveryWarning(false)}>OK</button>
          </div>
        </div>
      )}
      {showProcessingWarning && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
            <p>Anda hanya bisa memproses satu pesanan dalam satu waktu.</p>
            <button onClick={() => setShowProcessingWarning(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderItem = ({ order, handleDeliverOrder, statusHandler, handleCompleteOrder, handleCancelProcessOrder, formatPrice, kurirId, currentCourier }) => {
  // Hitung biaya pengiriman (asumsi: biaya pengiriman adalah selisih antara total amount dengan harga makanan)
  const foodTotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = order.amount - foodTotal;

  return (
    <div className="order-item">
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
        {order.courierName && (
          <p className="order-item-courier">Kurir: {order.courierName}</p>
        )}
      </div>
      <p>Item : {order.items.length}</p>
      <p>Total Pesanan: {formatPrice(order.amount * 1000)}</p>
      <p>Biaya Pengiriman: {formatPrice(deliveryFee * 1000)}</p>
      {order.status === "Pending" ? (
        <button
          onClick={() => handleDeliverOrder(order._id)}
          className="deliver-button"
          disabled={currentCourier && currentCourier !== order._id}
        >
          Proses Pesanan
        </button>
      ) : (
        <>
          <select
            onChange={(event) => statusHandler(event, order._id)}
            value={order.status}
            disabled={order.kurirId && order.kurirId !== kurirId}
          >
            <option value="Food Processing">Pesanan Sedang Diproses</option>
            <option value="Out for delivery">Dalam Pengiriman</option>
            <option value="Delivered">Terkirim</option>
          </select>
          {order.estimatedDelivery && (
            <p>Estimasi: {order.estimatedDelivery} menit</p>
          )}
          {order.status === "Delivered" && (
            <button
              onClick={() => handleCompleteOrder(order._id)}
              className="complete-button"
              disabled={currentCourier && currentCourier !== order._id}
            >
              Selesaikan Pesanan
            </button>
          )}
          {order.status === "Food Processing" && order.kurirId === kurirId && (
            <button
              onClick={() => handleCancelProcessOrder(order._id)}
              className="cancel-button"
            >
              Batalkan Proses
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
