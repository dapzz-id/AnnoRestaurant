import React, { useContext, useEffect, useState } from 'react'
import './History.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const History = () => {
    const {url, token} = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url+"/api/order/userorders", {}, {headers:{token}})
            const completedOrders = response.data.data.filter(order => order.status === "Completed");
            setData(completedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const toggleOrderDetails = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    }

    return (
        <div className='my-orders'>
            <h2>Riwayat Pesanan</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='order-card'>
                        <div className="order-header">
                            <img src={assets.parcel_icon} alt="Parcel Icon" className="order-icon" />
                            <h3>ID Pesanan: {order._id}</h3>
                            <span className="order-status">Selesai</span>
                        </div>
                        <div className="order-summary">
                            <p>Jumlah Item: {order.items.length}</p>
                            <p className="total-price">Total: Rp {formatPrice(order.amount)}.000</p>
                            {order.kurirNama && <p>Kurir: <b>{order.kurirNama}</b></p>}
                            <button 
                                className="toggle-details-btn"
                                onClick={() => toggleOrderDetails(order._id)}
                            >
                                {expandedOrder === order._id ? "Sembunyikan Detail" : "Lihat Detail"}
                            </button>
                        </div>
                        {expandedOrder === order._id && (
                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <img src={url + "/images/" + item.image} alt={item.name} className="item-image" />
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p>Jumlah: {item.quantity}</p>
                                            <p>Harga: Rp {formatPrice(item.price * item.quantity)}.000</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>      
        </div>
    )
}

export default History
