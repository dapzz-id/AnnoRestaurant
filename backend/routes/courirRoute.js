import express from "express";
import curirModel from "../models/curirModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Rute untuk mendaftarkan kurir baru
router.post("/daftar", async (req, res) => {
  try {
    const { nama, email, password, noTelepon } = req.body;
    const kurirSudahAda = await curirModel.findOne({ email });
    
    if (kurirSudahAda) {
      return res.status(400).json({ pesan: "Email sudah terdaftar" });
    }
    
    const kurirBaru = new curirModel({
      nama,
      email,
      password,
      noTelepon
    });
    
    await kurirBaru.save();
    res.status(201).json({ pesan: "Kurir berhasil didaftarkan" });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat mendaftarkan kurir" });
  }
});

// Rute untuk login kurir
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const kurir = await curirModel.findOne({ email });
    
    if (!kurir) {
      return res.status(400).json({ pesan: "Email atau password salah" });
    }
    
    if (password !== kurir.password) {
      return res.status(400).json({ pesan: "Email atau password salah" });
    }
    
    const token = jwt.sign({ id: kurir._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, kurirId: kurir._id });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat login" });
  }
});

// Rute untuk mendapatkan profil kurir
router.get("/profil/:id", async (req, res) => {
  try {
    const kurir = await curirModel.findById(req.params.id).select("-password");
    if (!kurir) {
      return res.status(404).json({ pesan: "Kurir tidak ditemukan" });
    }
    res.status(200).json(kurir);
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat mengambil profil kurir" });
  }
});

// Rute untuk memperbarui status aktif kurir
router.put("/status/:id", async (req, res) => {
  try {
    const { statusAktif } = req.body;
    const kurir = await curirModel.findByIdAndUpdate(
      req.params.id,
      { statusAktif },
      { new: true }
    );
    if (!kurir) {
      return res.status(404).json({ pesan: "Kurir tidak ditemukan" });
    }
    res.status(200).json({ pesan: "Status kurir berhasil diperbarui", kurir });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat memperbarui status kurir" });
  }
});

// Rute untuk mendapatkan daftar semua kurir
router.get("/list", async (req, res) => {
  try {
    const kurirs = await curirModel.find().select("-password");
    res.status(200).json({ success: true, kurirs });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat mengambil daftar kurir" });
  }
});

// Rute untuk memperbarui profil kurir
router.put("/profil/:id", async (req, res) => {
  try {
    const { nama, email, noTelepon } = req.body;
    const kurir = await curirModel.findByIdAndUpdate(
      req.params.id,
      { nama, email, noTelepon },
      { new: true }
    ).select("-password");
    
    if (!kurir) {
      return res.status(404).json({ pesan: "Kurir tidak ditemukan" });
    }
    
    res.status(200).json({ pesan: "Profil kurir berhasil diperbarui", kurir });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat memperbarui profil kurir" });
  }
});

// Rute untuk menghapus kurir
router.delete("/:id", async (req, res) => {
  try {
    const kurir = await curirModel.findByIdAndDelete(req.params.id);
    
    if (!kurir) {
      return res.status(404).json({ pesan: "Kurir tidak ditemukan" });
    }
    
    res.status(200).json({ pesan: "Kurir berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat menghapus kurir" });
  }
});

// Rute untuk mendapatkan statistik kurir
router.get("/statistik/:id", async (req, res) => {
  try {
    const kurir = await curirModel.findById(req.params.id);
    
    if (!kurir) {
      return res.status(404).json({ pesan: "Kurir tidak ditemukan" });
    }
    
    const statistik = {
      jumlahPesananDiproses: kurir.pesananDiproses.length,
      jumlahPengirimanSelesai: kurir.riwayatPengiriman.length,
      rating: kurir.rating,
      jumlahPenilaian: kurir.jumlahPenilaian
    };
    
    res.status(200).json({ success: true, statistik });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat mengambil statistik kurir" });
  }
});

export default router;
