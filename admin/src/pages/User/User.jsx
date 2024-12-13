import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './User.css'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const User = ({ url }) => {
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
      const ordersWithFormattedDate = response.data.data.map(order => ({
        ...order,
        formattedCompletedAt: new Date(order.completedAt).toLocaleString('id-ID', {
          dateStyle: 'full',
          timeStyle: 'medium'
        })
      }));
      setCompletedOrders(ordersWithFormattedDate)
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

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text('PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA', doc.internal.pageSize.width / 2, 15, { align: 'center' });
      doc.text('RESTORAN FOOD DEL', doc.internal.pageSize.width / 2, 22, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('FOOD DEL', doc.internal.pageSize.width / 2, 29, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Jl. Flora Raya No. 3 Pondok Bambu, Bekasi Timur', doc.internal.pageSize.width / 2, 36, { align: 'center' });
      doc.text('Kode pos 13453 Telepon : 7494931-75815315 Fax7494931', doc.internal.pageSize.width / 2, 42, { align: 'center' });

      // Garis pemisah
      doc.setLineWidth(0.5);
      doc.setDrawColor(0);
      doc.line(14, 45, doc.internal.pageSize.width - 14, 45);

      // Judul laporan
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Daftar Pesanan Selesai', doc.internal.pageSize.width / 2, 55, { align: 'center' });

      // Tabel
      const tableColumn = ["No.", "ID Pesanan", "Nama Pelanggan", "Total Harga", "Jumlah Item", "Diantar Oleh", "Tanggal Selesai"];
      const tableRows = completedOrders.map((order, index) => [
        index + 1,
        order._id,
        `${order.address.firstName} ${order.address.lastName}`,
        formatCurrency(order.amount),
        order.items.reduce((total, item) => total + item.quantity, 0),
        order.kurirNama || 'Tidak tersedia',
        order.formattedCompletedAt
      ]);

      const tableOptions = {
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      };

      // Buat tabel dan dapatkan posisi Y akhir
      const finalY = doc.autoTable(tableOptions).finalY || 65;

      // Tanda tangan
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

      // Tanda tangan admin
      doc.text('Bekasi, ' + currentDate, doc.internal.pageSize.width - 40, finalY + 30, { align: 'center' });
      doc.text('Staff Admin', doc.internal.pageSize.width - 40, finalY + 35, { align: 'center' });
      doc.text('(________________________)', doc.internal.pageSize.width - 40, finalY + 60, { align: 'center' });
      doc.text('NIP. XXXXXXXXXXXXX', doc.internal.pageSize.width - 40, finalY + 65, { align: 'center' });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, doc.internal.pageSize.height - 10);
      }

      doc.save('daftar_pesanan_selesai.pdf');
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      console.error('Gagal mengunduh PDF:', error);
      toast.error('Gagal mengunduh PDF. Silakan coba lagi.');
    }
  }

  return (
    <div className="order-container">
      <h2>Daftar Pesanan Selesai</h2>
      <button onClick={downloadPDF} className="download-button">Unduh PDF</button>
      <table className="order-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>ID Pesanan</th>
            <th>Nama Pelanggan</th>
            <th>Total Harga</th>
            <th>Jumlah Item</th>
            <th>Diantar Oleh</th>
            <th>Tanggal Selesai</th>
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
                <td>{order.kurirNama || 'Tidak tersedia'}</td>
                <td>{order.formattedCompletedAt}</td>
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
                  <td colSpan="9">
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
                        Nama: {order.address.firstName} {order.address.lastName}<br />
                        Jalan: {order.address.street}<br />
                        Kota: {order.address.city}<br />
                        Provinsi: {order.address.state}<br />
                        Negara: {order.address.country}<br />
                        Kecamatan: {order.address.district}<br />
                        Email: {order.address.email}<br />
                        Telepon: {order.address.phone}
                      </p>
                      <h4>Diantar Oleh:</h4>
                      <p>{order.kurirNama || 'Tidak tersedia'}</p>
                      <h4>Waktu Selesai:</h4>
                      <p>{order.formattedCompletedAt}</p>
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
          <p>Apakah Anda yakin ingin menghapus pesanan ini?</p>
          <div className="confirmation-buttons">
            <button onClick={handleDeleteOrder}>Ya</button>
            <button onClick={() => setShowConfirmation(false)}>Tidak</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default User
