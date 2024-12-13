import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';


const MyOrders = () => {

    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}})
            const activeOrders = response.data.data.filter(order => order.status !== "Completed");
            setData(activeOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(()=>{
        if (token) {
            fetchOrders();
        }
    },[token])

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const translateStatus = (status) => {
        switch(status) {
            case "Pending":
                return "Menunggu";
            case "Food Processing":
                return "Sedang Diproses";
            case "Out for delivery":
                return "Dalam Pengiriman";
            case "Delivered":
                return "Terkirim";
            default:
                return status;
        }
    }

    return (
        <div className='my-orders'>
            <h2>Pesanan Saya</h2>
            <div className="container">
                {data.map((order,index)=>{
                    return(
                        <div key={index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt="" />
                            <p>ID Pesanan: {order._id}</p>
                            <p>{order.items.map((item,index)=>{
                                if (index === order.items.length-1) {
                                    return item.name+" x "+item.quantity
                                }
                                else{
                                    return item.name+" x "+item.quantity+", "
                                }
                            })}</p>
                            <p>Harga Total : Rp {formatPrice(order.amount)}.000</p>
                            <p>Jumlah Item : {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{translateStatus(order.status)}</b></p>
                            {order.kurirNama && (
                                <p className="kurir-info">
                                    Kurir: {order.kurirNama}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>      
        </div>
    )
}

export default MyOrders
