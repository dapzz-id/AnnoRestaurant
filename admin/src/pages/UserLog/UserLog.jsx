import React, { useState } from 'react';
import './UserLog.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserLog = ({ url }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    noTelepon: '',
  });
  const [namaKurir, setNamaKurir] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'nama') {
      setNamaKurir(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }
    try {
      const response = await axios.post(`${url}/api/kurir/daftar`, {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        noTelepon: formData.noTelepon
      });
      if (response.status === 201) {
        toast.success(`Selamat ${namaKurir}, akun kurir Anda berhasil dibuat`);
        setFormData({
          nama: '',
          email: '',
          password: '',
          confirmPassword: '',
          noTelepon: '',
        });
        setNamaKurir('');
      } else {
        toast.error('Gagal membuat akun kurir');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.pesan);
      } else {
        toast.error('Terjadi kesalahan: ' + error.message);
      }
    }
  };

  return (
    <div className="courier-register-container">
      <h2 className="courier-register-title">Buat Akun Kurir</h2>
      {namaKurir && <p className="greeting">Halo, {namaKurir}!</p>}
      
      <form onSubmit={handleSubmit} className="courier-register-form">
        <input
          type="text"
          name="nama"
          placeholder="Nama Lengkap"
          value={formData.nama}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="tel"
          name="noTelepon"
          placeholder="Nomor Telepon"
          value={formData.noTelepon}
          onChange={handleChange}
          required
          className="register-input"
        />
        <button type="submit" className="register-button">Daftar Kurir</button>
      </form>
    </div>
  );
};

export default UserLog;