const carSchema = require("../models/CarModel");
const Car = require("../models/CarModel");

// CREATE
const createCar = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files); //Multiple files

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
    } = req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "SellerId is required" });
    }

    let imageUrls=[];

    // Multiple Image URL Array
    const imageUrl = []
    if(req.files && req.files.length >0){
        for(let file of req.files){
            imageUrls.push(file.path)  //cloudinary url
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
      images: imageUrls, // Array Save
    });

    res.status(201).json({
      message: "Car created successfully 🚗",
      data: car,
    });
  } catch (err) {
    console.log("CREATE CAR ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
const getAllCars = async(req,res)=>{
    try{
        const cars = await carSchema
        .find()
        .populate("sellerId")

        res.status(200).json({
            message:"Cars fetched",
            data:cars
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

// GET SINGLE
const getCarById = async(req,res)=>{
    try{
        const car = await carSchema
        .findById(req.params.id)
        .populate("sellerId")

        res.status(200).json({
            message:"Car fetched",
            data:car
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

// UPDATE
const updateCar = async (req, res) => {
  try {

    let updateData = req.body;

    // 🔹 agar new images aaye
    if (req.files && req.files.length > 0) {
      let imageUrls = [];

      for (let file of req.files) {
        imageUrls.push(file.path);
      }

      updateData.images = imageUrls; // replace images
    }

    const car = await carSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Car updated",
      data: car
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// DELETE
const deleteCar = async(req,res)=>{
    try{
        await carSchema.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Car deleted"
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

const getUserCars = async (req, res) => {
  try {
    const cars = await Car.find({ sellerId: req.params.id });

    res.status(200).json({
      data: cars,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports={
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
    getUserCars
}