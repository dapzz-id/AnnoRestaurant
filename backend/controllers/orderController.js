import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import "dotenv/config";
import curirModel from "../models/curirModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Simpan alamat ke profil pengguna
    await userModel.findByIdAndUpdate(req.body.userId, {
      address: {
        firstName: req.body.address.firstName,
        lastName: req.body.address.lastName,
        email: req.body.address.email,
        street: req.body.address.street,
        state: req.body.address.state,
        city: req.body.address.city,
        district: req.body.address.district,
        country: req.body.address.country,
        phone: req.body.address.phone,
      }
    });

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: {
        firstName: req.body.address.firstName,
        lastName: req.body.address.lastName,
        email: req.body.address.email,
        street: req.body.address.street,
        state: req.body.address.state,
        city: req.body.address.city,
        district: req.body.address.district,
        country: req.body.address.country,
        phone: req.body.address.phone,
      },
      status: "Pending",
      kurirNama: null,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "IDR",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 1000,
      },
      quantity: item.quantity,
    }));

    // Ubah ini untuk menggunakan biaya pengiriman yang dihitung
    line_items.push({
      price_data: {
        currency: "IDR",
        product_data: {
          name: "Biaya Pengiriman",
        },
        unit_amount:
          (req.body.amount -
            req.body.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )) *
          100 *
          1000,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndUpdate(orderId);
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for front end
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updateing order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, kurirNama, kurirId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan" });
    }

    if (order.kurirId && order.kurirId !== kurirId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Pesanan sedang diproses oleh kurir lain",
        });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status,
        kurirNama,
        kurirId: status === "Pending" ? null : kurirId,
      },
      { new: true }
    );

    res.json({ success: true, message: "Status Updated", order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// api untuk menghapus pesanan
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Pesanan berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Gagal menghapus pesanan" });
  }
};

// api untuk menyelesaikan pesanan
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { completedBy } = req.body;
    await orderModel.findByIdAndUpdate(orderId, {
      status: "Completed",
      completedAt: new Date(),
      completedBy: completedBy || "Admin", // Menambahkan informasi siapa yang menyelesaikan pesanan
    });
    res.json({ success: true, message: "Pesanan berhasil diselesaikan" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Gagal menyelesaikan pesanan" });
  }
};

// Mengubah API untuk mendapatkan daftar pesanan yang sudah selesai
const getCompletedOrders = async (req, res) => {
  try {
    const completedOrders = await orderModel
      .find({ status: "Completed" })
      .sort({ completedAt: -1 });
    res.json({ success: true, data: completedOrders });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Gagal mendapatkan daftar pesanan selesai",
    });
  }
};
const getCompletedOrderss = async (req, res) => {
  try {
    const { kurirId } = req.params; // Mengambil kurirId dari parameter URL
    const completedOrders = await orderModel
      .find({ status: "Completed", kurirId: kurirId })
      .sort({ completedAt: -1 });
    res.json({ success: true, data: completedOrders });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Gagal mendapatkan daftar pesanan selesai",
    });
  }
};

// API untuk mendapatkan pesanan untuk kurir
const getOrdersForCourier = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ status: "Pending", kurirNama: null })
      .sort({ date: -1 }); // Menambahkan filter untuk kurirNama yang masih null
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Gagal mendapatkan daftar pesanan untuk kurir",
      });
  }
};

// API untuk kurir menerima pesanan
const acceptOrderByCourier = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { kurirNama } = req.body; // Menambahkan kurirNama dari body request
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status: "Dalam Pengiriman", kurirNama: kurirNama },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan" });
    }
    res.json({
      success: true,
      message: "Pesanan berhasil diterima oleh kurir",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Gagal menerima pesanan" });
  }
};

// Mengubah API untuk kurir menyelesaikan pesanan
const completeOrderByCourier = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { kurirId, kurirNama } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status: "Completed",
        completedAt: new Date(),
        kurirId: kurirId,
        kurirNama: kurirNama,
      },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan" });
    }
    res.json({
      success: true,
      message: "Pesanan berhasil diselesaikan oleh kurir",
      order,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menyelesaikan pesanan" });
  }
};

// API untuk memproses pesanan
const processOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { kurirNama } = req.body; // Menambahkan kurirNama dari body request
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status: "Sedang Diproses", kurirNama: kurirNama },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan" });
    }
    res.json({ success: true, message: "Pesanan sedang diproses", order });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Gagal memproses pesanan" });
  }
};

// Fungsi untuk menghapus kurir
const deleteKurir = async (req, res) => {
  try {
    const { kurirId } = req.params;

    // Cek apakah kurir sedang mengantar pesanan
    const activeOrders = await orderModel.find({
      kurirId: kurirId,
      status: { $in: ["Food Processing", "Out for delivery", "Delivered"] }
    });

    if (activeOrders.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menghapus kurir karena sedang mengantar pesanan"
      });
    }

    // Jika tidak ada pesanan aktif, hapus kurir
    const deletedKurir = await curirModel.findByIdAndDelete(kurirId);

    if (!deletedKurir) {
      return res.status(404).json({
        success: false,
        message: "Kurir tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Kurir berhasil dihapus"
    });
  } catch (error) {
    console.error("Error menghapus kurir:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus kurir"
    });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrder,
  completeOrder,
  getCompletedOrders,
  getOrdersForCourier,
  acceptOrderByCourier,
  completeOrderByCourier,
  processOrder,
  getCompletedOrderss,
  deleteKurir
};
