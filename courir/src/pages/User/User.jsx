import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './User.css'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const User = ({ url }) => {
  const [completedOrders, setCompletedOrders] = useState([])
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [totalPesanan, setTotalPesanan] = useState(0)
  const [totalPendapatan, setTotalPendapatan] = useState(0)
  const [kurirId, setKurirId] = useState('')
  const [kurirNama, setKurirNama] = useState('')

  useEffect(() => {
    const loggedInKurirId = localStorage.getItem('kurirId')
    const loggedInKurirNama = localStorage.getItem('kurirNama')
    setKurirId(loggedInKurirId)
    setKurirNama(loggedInKurirNama)
    
    if (loggedInKurirId) {
      fetchCompletedOrders(loggedInKurirId)
    }
  }, [url])

  const fetchCompletedOrders = async (kurirId) => {
    try {
      const response = await axios.get(`${url}/api/order/completed/${kurirId}`)
      setCompletedOrders(response.data.data)
      hitungTotal(response.data.data)
    } catch (error) {
      console.error('Gagal mengambil data pesanan selesai:', error)
      toast.error('Gagal mengambil data pesanan selesai')
    }
  }

  const hitungTotal = (orders) => {
    const jumlahPesanan = orders.length
    const totalPendapatan = orders.reduce((total, order) => {
      // Hitung biaya pengiriman
      const foodTotal = order.items.reduce((itemTotal, item) => itemTotal + (item.price * item.quantity), 0)
      const deliveryFee = order.amount - foodTotal
      return total + deliveryFee
    }, 0)
    setTotalPesanan(jumlahPesanan)
    setTotalPendapatan(totalPendapatan)
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

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Daftar Pesanan Selesai', 14, 15)
    
    const tableColumn = ["No.", "ID Pesanan", "Nama Pelanggan", "Total Harga", "Jumlah Item", "Kurir"]
    const tableRows = completedOrders.map((order, index) => [
      index + 1,
      order._id,
      `${order.address.firstName} ${order.address.lastName}`,
      formatCurrency(order.amount),
      order.items.reduce((total, item) => total + item.quantity, 0),
      order.kurirNama || "Tidak diketahui"
    ])

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    })

    doc.save('daftar_pesanan_selesai.pdf')
  }

  return (
    <div className="order-container">
      <h2>Daftar Pesanan Selesai - {kurirNama}</h2>
      <div className="order-summary">
        <p>Total Pesanan Sukses: {totalPesanan}</p>
        <p>Total Pendapatan Kurir: {formatCurrency(totalPendapatan)}</p>
      </div>
      <button onClick={downloadPDF} className="download-button">Unduh PDF</button>
      <table className="order-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>ID Pesanan</th>
            <th>Nama Pelanggan</th>
            <th>Biaya Pengiriman</th>
            <th>Jumlah Item</th>
            <th>Tanggal Selesai</th>
            <th>Kurir</th>
            <th>Detail Pesanan</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map((order, index) => {
            const foodTotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
            const deliveryFee = order.amount - foodTotal
            return (
              <React.Fragment key={order._id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.address.firstName} {order.address.lastName}</td>
                  <td>{formatCurrency(deliveryFee)}</td>
                  <td>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                  <td>{new Date(order.completedAt).toLocaleString()}</td>
                  <td>{order.kurirNama || "Tidak diketahui"}</td>
                  <td>
                    <button onClick={() => toggleOrderDetails(order._id)} className="detail-button">
                      {expandedOrderId === order._id ? 'Tutup Detail' : 'Lihat Detail'}
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order._id && (
                  <tr>
                    <td colSpan="8">
                      <div className="order-details">
                        <h4>Detail Pesanan:</h4>
                        <ul>
                          {order.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              {item.name} - {item.quantity} x {formatCurrency(item.price)}
                            </li>
                          ))}
                        </ul>
                        <p><strong>Biaya Pengiriman: {formatCurrency(deliveryFee)}</strong></p>
                        <h4>Alamat Pengiriman:</h4>
                        <p>
                          Nama: {order.address.firstName} {order.address.lastName}<br />
                          Jalan: {order.address.street}<br />
                          Kota: {order.address.city}<br />
                          Provinsi: {order.address.state}<br />
                          Negara: {order.address.country}<br />
                          Kecamatan: {order.address.district}<br />
                          Email: {order.address.email}<br />
                          Telepon: {order.address.phone}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default User
