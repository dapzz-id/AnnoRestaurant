import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const courierAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const courier = await userModel.findOne({ _id: decoded.id, role: "kurir" });

    if (!courier) {
      return res.status(401).json({ success: false, message: "Kurir tidak ditemukan atau tidak memiliki akses" });
    }

    req.courier = courier;
    req.token = token;
    req.currentUserEmail = courier.email;
    req.courirId = courier.courirId; // Menambahkan courirId ke objek request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Autentikasi gagal" });
  }
};

export default courierAuth;
