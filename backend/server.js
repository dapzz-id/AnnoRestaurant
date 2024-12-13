import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRouter.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import courirRouter from "./routes/courirRoute.js"
import alamatRouter from "./routes/alamatRoute.js"
import 'dotenv/config'

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/kurir", courirRouter)
app.use("/api/alamat", alamatRouter)


// Tambahkan endpoint untuk feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { nama, pesan } = req.body;
    const newFeedback = new Feedback({ nama, pesan });
    await newFeedback.save();
    res.status(201).json({ pesan: "Umpan balik berhasil diterima" });
  } catch (error) {
    res.status(500).json({ pesan: "Terjadi kesalahan saat menyimpan umpan balik", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`)
})