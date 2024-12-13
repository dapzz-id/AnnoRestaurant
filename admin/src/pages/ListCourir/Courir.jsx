import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../../App'
import './Courir.css'
import { toast } from 'react-toastify'

const Courir = () => {
  const [kurirs, setKurirs] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedKurirId, setSelectedKurirId] = useState(null)

  useEffect(() => {
    fetchKurirs()
  }, [])

  const fetchKurirs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/kurir/list`)
      if (response.data.success) {
        setKurirs(response.data.kurirs)
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data kurir:', error)
      toast.error('Gagal mengambil data kurir')
    }
  }

  const handleDeleteConfirmation = (kurirId) => {
    setSelectedKurirId(kurirId)
    setShowConfirmation(true)
  }

  const handleDeleteKurir = async () => {
    try {
      const response = await axios.delete(`${backendUrl}/api/order/kurir/${selectedKurirId}`)
      if (response.data.success) {
        toast.success('Kurir berhasil dihapus')
        fetchKurirs() // Refresh daftar kurir setelah menghapus
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus kurir:', error)
      toast.error(error.response?.data?.message || 'Gagal menghapus kurir')
    } finally {
      setShowConfirmation(false)
      setSelectedKurirId(null)
    }
  }

  return (
    <div className="courir-container">
      <h1>Daftar Kurir</h1>
      <table className="courir-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Nomor Telepon</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kurirs.map((kurir) => (
            <tr key={kurir._id}>
              <td>{kurir.nama}</td>
              <td>{kurir.email}</td>
              <td>{kurir.noTelepon}</td>
              <td>{kurir.statusAktif ? 'Aktif' : 'Tidak Aktif'}</td>
              <td>
                <button 
                  onClick={() => handleDeleteConfirmation(kurir._id)}
                  className="delete-button"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-content">
            <p>Apakah Anda yakin ingin menghapus kurir ini?</p>
            <div className="confirmation-buttons">
              <button onClick={handleDeleteKurir} className="confirm-button">Ya</button>
              <button onClick={() => setShowConfirmation(false)} className="cancel-button">Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Courir
