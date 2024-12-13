import express from "express"
import { addFood, listFood, removeFood, editFood } from "../controllers/foodController.js"
import adminAuth from "../middleware/adminauth.js"
import multer from "multer"

const foodRouter = express.Router();

// image storage Engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

foodRouter.post("/add", adminAuth, upload.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove",adminAuth, removeFood)
foodRouter.put("/edit/:id", adminAuth, upload.single("image"), editFood)

export default foodRouter;