import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, userOrders, verifyOrder, listOrders, updateStatus, deleteOrder, completeOrder, getCompletedOrders, getOrdersForCourier, acceptOrderByCourier, completeOrderByCourier, getCompletedOrderss, deleteKurir } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get('/list', listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.delete("/delete/:orderId", deleteOrder);
orderRouter.post("/complete/:orderId", completeOrder);
orderRouter.get("/completed", getCompletedOrders);
orderRouter.get("/completed/:kurirId", getCompletedOrderss);

// Rute untuk kurir
orderRouter.get("/courier", getOrdersForCourier);
orderRouter.post("/courier/accept/:orderId", acceptOrderByCourier);
orderRouter.post("/courier/complete/:orderId", completeOrderByCourier);

// Rute untuk menghapus kurir
orderRouter.delete("/kurir/:kurirId", deleteKurir);

export default orderRouter;
