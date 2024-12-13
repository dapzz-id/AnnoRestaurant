import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}},
    address: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        state: String,
        city: String,
        district: String,
        country: String,
        phone: String
    }
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;