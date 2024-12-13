import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login pengguna
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Periksa apakah pengguna ada
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Pengguna tidak ditemukan" });
    }

    // Periksa password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Password tidak valid" });
    }
    
    const token = createToken(user._id);
    res.json({ success: true, token });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Terjadi kesalahan" });
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Daftar pengguna baru
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Periksa apakah pengguna sudah ada
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Pengguna sudah terdaftar" });
    }

    // Validasi format email dan kekuatan password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Masukkan email yang valid" });  
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password harus minimal 8 karakter" });
    }

    // Hash password pengguna
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat pengguna baru
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Terjadi kesalahan" });
  }
}

// Login admin
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Email atau password admin tidak valid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Terjadi kesalahan" }); 
  }
}

// Login kurir
const courierLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Periksa apakah kurir ada
    const courier = await userModel.findOne({ email, role: 'kurir' });

    if (!courier) {
      return res.json({ success: false, message: "Kurir tidak ditemukan" });
    }

    // Periksa password
    const isMatch = await bcrypt.compare(password, courier.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Password tidak valid" });
    }
    
    const token = createToken(courier._id);
    res.json({ success: true, token });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Terjadi kesalahan" });
  }
}

// Mendapatkan total jumlah pengguna
const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.json({ success: true, count: totalUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Terjadi kesalahan saat mengambil jumlah pengguna" });
  }
}

export const getUserAddress = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        if (user && user.address) {
            res.json({ success: true, address: user.address });
        } else {
            res.json({ success: false, message: "Alamat tidak ditemukan" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error mengambil alamat" });
    }
};

export { loginUser, registerUser, adminLogin, courierLogin, getTotalUsers};