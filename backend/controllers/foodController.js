import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item

const addFood = async (req, res) => {
  
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data:foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req,res) =>{
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"Food Removed"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

// edit food item
const editFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    
    const updatedFood = {
      name,
      description,
      price,
      category
    };

    if (req.file) {
      const oldFood = await foodModel.findById(id);
      fs.unlink(`uploads/${oldFood.image}`, () => {});
      updatedFood.image = req.file.filename;
    }

    const food = await foodModel.findByIdAndUpdate(id, updatedFood, { new: true });
    
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    res.json({ success: true, message: "Food Updated", data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, removeFood, editFood };
