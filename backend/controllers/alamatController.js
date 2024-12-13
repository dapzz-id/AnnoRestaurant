import Alamat from "../models/alamatModel.js";

// Mendapatkan semua alamat
export const getAlamat = async (req, res) => {
  try {
    const alamat = await Alamat.find();
    res.status(200).json({ sukses: true, alamat });
  } catch (error) {
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan saat mengambil alamat", error: error.message });
  }
};

// Menambahkan alamat baru
export const tambahAlamat = async (req, res) => {
  try {
    const alamatBaru = new Alamat(req.body);
    await alamatBaru.save();
    res.status(201).json({ sukses: true, pesan: "Alamat berhasil ditambahkan", alamat: alamatBaru });
  } catch (error) {
    res.status(400).json({ sukses: false, pesan: "Gagal menambahkan alamat", error: error.message });
  }
};

// Mengupdate alamat
export const updateAlamat = async (req, res) => {
  try {
    const alamatDiupdate = await Alamat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alamatDiupdate) {
      return res.status(404).json({ sukses: false, pesan: "Alamat tidak ditemukan" });
    }
    res.status(200).json({ sukses: true, pesan: "Alamat berhasil diupdate", alamat: alamatDiupdate });
  } catch (error) {
    res.status(400).json({ sukses: false, pesan: "Gagal mengupdate alamat", error: error.message });
  }
};

// Menghapus alamat
export const hapusAlamat = async (req, res) => {
  try {
    const alamatDihapus = await Alamat.findByIdAndDelete(req.params.id);
    if (!alamatDihapus) {
      return res.status(404).json({ sukses: false, pesan: "Alamat tidak ditemukan" });
    }
    res.status(200).json({ sukses: true, pesan: "Alamat berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ sukses: false, pesan: "Gagal menghapus alamat", error: error.message });
  }
};

// Mendapatkan alamat berdasarkan ID
export const getAlamatById = async (req, res) => {
  try {
    const alamat = await Alamat.findById(req.params.id);
    if (!alamat) {
      return res.status(404).json({ sukses: false, pesan: "Alamat tidak ditemukan" });
    }
    res.status(200).json({ sukses: true, alamat });
  } catch (error) {
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan saat mengambil alamat", error: error.message });
  }
};

// Mendapatkan alamat berdasarkan ID pengguna
export const getAlamatByUser = async (req, res) => {
  try {
    const alamat = await Alamat.find({ userId: req.params.userId });
    res.status(200).json({ sukses: true, alamat });
  } catch (error) {
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan saat mengambil alamat pengguna", error: error.message });
  }
};
