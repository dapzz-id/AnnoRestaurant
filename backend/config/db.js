import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://keyzondol:33858627@cluster0.lr1eq.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}