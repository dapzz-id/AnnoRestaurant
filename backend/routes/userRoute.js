import express from "express";
import { loginUser, registerUser, adminLogin, getTotalUsers, getUserAddress } from "../controllers/userController.js";
const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)
userRouter.get("/total", getTotalUsers)
userRouter.get("/address", getUserAddress)

export default userRouter;
