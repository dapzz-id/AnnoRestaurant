import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import './address.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const Address = () => {
  const { url, token } = useContext(StoreContext)
  const [alamat, setAlamat] = useState({
    namaDepan: '',
    namaBelakang: '',
    email: '',
    kota: '',
    provinsi: '',
    kodePos: '',
    negara: 'Indonesia',
    nomorTelepon: '',
    kecamatan: '',
    kampung: '',
    catatan: ''
  })

  const [pesan, setPesan] = useState('')
  const [daftarAlamat, setDaftarAlamat] = useState([])
  const [provinsiList, setProvinsiList] = useState([])
  const [kotaList, setKotaList] = useState([])
  const [selectedProvinsi, setSelectedProvinsi] = useState('')
  const [kecamatanList, setKecamatanList] = useState([])
  const [selectedKota, setSelectedKota] = useState('')
  const [kampungList, setKampungList] = useState([])
  const [selectedKecamatan, setSelectedKecamatan] = useState('')

  useEffect(() => {
    const ambilAlamat = async () => {
      try {
        const response = await axios.get(`${url}/api/alamat`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data.success) {
          setDaftarAlamat(response.data.alamat)
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil alamat:', error)
      }
    }

    if (token) {
      ambilAlamat()
    }
  }, [token, url])

  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
        setProvinsiList(response.data)
      } catch (error) {
        console.error('Gagal mengambil data provinsi:', error)
      }
    }

    fetchProvinsi()
  }, [])

  useEffect(() => {
    const fetchKota = async () => {
      if (selectedProvinsi) {
        try {
          const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinsi}.json`)
          setKotaList(response.data)
        } catch (error) {
          console.error('Gagal mengambil data kota:', error)
        }
      } else {
        setKotaList([])
      }
    }

    fetchKota()
  }, [selectedProvinsi])

  useEffect(() => {
    const fetchKecamatan = async () => {
      if (selectedKota) {
        try {
          const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedKota}.json`)
          setKecamatanList(response.data)
        } catch (error) {
          console.error('Gagal mengambil data kecamatan:', error)
        }
      } else {
        setKecamatanList([])
      }
    }

    fetchKecamatan()
  }, [selectedKota])

  useEffect(() => {
    const fetchKampung = async () => {
      if (selectedKecamatan) {
        try {
          const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKecamatan}.json`)
          setKampungList(response.data)
        } catch (error) {
          console.error('Gagal mengambil data kampung:', error)
        }
      } else {
        setKampungList([])
      }
    }

    fetchKampung()
  }, [selectedKecamatan])

  const handleChange = (e) => {
    setAlamat({ ...alamat, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:4000/api/alamat', alamat, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setPesan('Alamat berhasil disimpan')
        setDaftarAlamat([...daftarAlamat, response.data.alamat])
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat menyimpan alamat:', error)
      setPesan('Gagal menyimpan alamat')
    }
  }

  const handleProvinsiChange = (e) => {
    setSelectedProvinsi(e.target.value)
    setAlamat({ ...alamat, provinsi: e.target.options[e.target.selectedIndex].text })
    setSelectedKota('')
    setAlamat(prev => ({ ...prev, kota: '', kecamatan: '' }))
  }

  const handleKotaChange = (e) => {
    setSelectedKota(e.target.value)
    setAlamat({ ...alamat, kota: e.target.options[e.target.selectedIndex].text })
    setAlamat(prev => ({ ...prev, kecamatan: '' }))
  }

  const handleKecamatanChange = (e) => {
    setSelectedKecamatan(e.target.value)
    setAlamat({ ...alamat, kecamatan: e.target.options[e.target.selectedIndex].text })
    setAlamat(prev => ({ ...prev, kampung: '' }))
  }

  const handleKampungChange = (e) => {
    setAlamat({ ...alamat, kampung: e.target.value })
  }

  return (
    <div className="address-container">
      <div className="address-form-container">
        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" name="namaDepan" value={alamat.namaDepan} onChange={handleChange} placeholder="Nama Depan" required />
            <input type="text" name="namaBelakang" value={alamat.namaBelakang} onChange={handleChange} placeholder="Nama Belakang" required />
          </div>
          <input type="email" name="email" value={alamat.email} onChange={handleChange} placeholder="Alamat Email" required />
          <div className="form-row">
            <select name="provinsi" value={selectedProvinsi} onChange={handleProvinsiChange} required>
              <option value="">Pilih Provinsi</option>
              {provinsiList.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
            <select name="kota" value={selectedKota} onChange={handleKotaChange} required>
              <option value="">Pilih Kota/Kabupaten</option>
              {kotaList.map((kota) => (
                <option key={kota.id} value={kota.id}>
                  {kota.name}
                </option>
              ))}
            </select>
            <select name="kecamatan" value={selectedKecamatan} onChange={handleKecamatanChange} required>
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={kec.id}>
                  {kec.name}
                </option>
              ))}
            </select>
            <select name="kampung" value={alamat.kampung} onChange={handleKampungChange} required>
              <option value="">Pilih Kampung</option>
              {kampungList.map((kamp) => (
                <option key={kamp.id} value={kamp.name}>
                  {kamp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <input type="text" name="kodePos" value={alamat.kodePos} onChange={handleChange} placeholder="Kode Pos" required />
            <input
              type="text"
              name="negara"
              value={alamat.negara}
              readOnly
              placeholder="Negara"
              required
              style={{ cursor: 'default', backgroundColor: '#f0f0f0' }}
            />
          </div>
          <input type="tel" name="nomorTelepon" value={alamat.nomorTelepon} onChange={handleChange} placeholder="Nomor Telepon" required />
          <textarea
            name="catatan"
            value={alamat.catatan}
            onChange={handleChange}
            placeholder="Catatan (opsional)"
            rows="3"
          ></textarea>
          <button type="submit">Simpan Alamat</button>
          {pesan && <p className="pesan">{pesan}</p>}
        </form>
      </div>
      <div className="my-addresses">
        <h2>Daftar Alamat Saya</h2>
        <div className="container">
          {daftarAlamat.map((alamat, index) => (
            <div key={index} className='my-address-item'>
              <img src={assets.location_icon} alt="" />
              <p>Nama: {alamat.namaDepan} {alamat.namaBelakang}</p>
              <p>Alamat: {alamat.namaJalan}, {alamat.kota}, {alamat.provinsi} {alamat.kodePos}</p>
              <p>Negara: {alamat.negara}</p>
              <p>Email: {alamat.email}</p>
              <p>Telepon: {alamat.nomorTelepon}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Address
