
import express from "express";
import { getAlamat, tambahAlamat, updateAlamat, hapusAlamat, getAlamatById, getAlamatByUser } from "../controllers/alamatController.js";

const alamatRouter = express.Router();

alamatRouter.get("/", getAlamat);
alamatRouter.get("/:id", getAlamatById);
alamatRouter.get("/user/:userId", getAlamatByUser);
alamatRouter.post("/", tambahAlamat);
alamatRouter.put("/:id", updateAlamat);
alamatRouter.delete("/:id", hapusAlamat);

export default alamatRouter;
