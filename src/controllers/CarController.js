const carSchema = require("../models/CarModel");
const Car = require("../models/CarModel");

// ================= CREATE CAR =================
const createCar = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      description,
      location,
      sellerId,
      condition,
    } = req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "SellerId is required" });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        imageUrls.push(file.path);
      }
    }

    const car = await Car.create({
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      description,
      location,
      sellerId,
      condition,
      images: imageUrls,
    });

    res.status(201).json({
      message: "Car created successfully",
      data: car,
    });
  } catch (err) {
    console.log("CREATE CAR ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL CARS =================
const getAllCars = async (req, res) => {
  try {
    const cars = await carSchema.find().populate("sellerId", "_id name email");

    res.status(200).json({
      message: "Cars fetched",
      data: cars,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SINGLE CAR =================
const getCarById = async (req, res) => {
  try {
    const car = await carSchema.findById(req.params.id).populate("sellerId");

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({
      message: "Car fetched",
      data: car,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE CAR =================
const updateCar = async (req, res) => {
  try {
    const existingCar = await Car.findById(req.params.id);

    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    let updateData = { ...req.body };

    // Keep old images and append new uploaded images
    let updatedImages = existingCar.images || [];

    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((file) => file.path);
      updatedImages = [...updatedImages, ...newImageUrls];
    }

    updateData.images = updatedImages;

    const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: "after",
    });

    res.status(200).json({
      message: "Car updated successfully",
      data: car,
    });
  } catch (err) {
    console.log("UPDATE CAR ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE CAR =================
const deleteCar = async (req, res) => {
  try {
    await carSchema.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET USER CARS =================
const getUserCars = async (req, res) => {
  try {
    const cars = await Car.find({ sellerId: req.params.id }).populate(
      "sellerId",
      "_id name email"
    );

    res.status(200).json({ data: cars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  getUserCars,
};
