import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Bukti.css'
import { toast } from 'react-toastify'

const Bukti = ({ url }) => {
  const [completedOrders, setCompletedOrders] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  useEffect(() => {
    fetchCompletedOrders()
  }, [url])

  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/completed`)
      setCompletedOrders(response.data.data)
    } catch (error) {
      console.error('Gagal mengambil data pesanan selesai:', error)
      toast.error('Gagal mengambil data pesanan selesai')
    }
  }

  const handleDeleteConfirmation = (orderId) => {
    setSelectedOrderId(orderId)
    setShowConfirmation(true)
  }

  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`${url}/api/order/delete/${selectedOrderId}`)
      toast.success('Pesanan berhasil dihapus')
      fetchCompletedOrders()
    } catch (error) {
      console.error('Gagal menghapus pesanan:', error)
      toast.error('Gagal menghapus pesanan')
    } finally {
      setShowConfirmation(false)
      setSelectedOrderId(null)
    }
  }

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount * 1000)
  }

  return (
    <div className="order-container">
      <h2>Daftar Pesanan Selesai</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>ID Pesanan</th>
            <th>Nama Pelanggan</th>
            <th>Total Harga</th>
            <th>Jumlah Item</th>
            <th>Detail Pesanan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map((order, index) => (
            <React.Fragment key={order._id}>
              <tr>
                <td>{index + 1}</td>
                <td>{order._id}</td>
                <td>{order.address.firstName} {order.address.lastName}</td>
                <td>{formatCurrency(order.amount)}</td>
                <td>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                <td>
                  <button onClick={() => toggleOrderDetails(order._id)} className="detail-button">
                    {expandedOrderId === order._id ? 'Tutup Detail' : 'Lihat Detail'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteConfirmation(order._id)} className="delete-button">
                    Hapus
                  </button>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan="7">
                    <div className="order-details">
                      <h4>Detail Pesanan:</h4>
                      <ul>
                        {order.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            {item.name} - {item.quantity} x {formatCurrency(item.price)}
                          </li>
                        ))}
                      </ul>
                      <h4>Alamat Pengiriman:</h4>
                      <p>
                        {order.address.street}<br />
                        {order.address.city}, {order.address.state} {order.address.zipCode}<br />
                        {order.address.country}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
            <p>Apakah Anda yakin ingin menghapus pesanan ini?</p>
            <button onClick={handleDeleteOrder}>Ya</button>
            <button onClick={() => setShowConfirmation(false)}>Tidak</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bukti
