const carSchema = require("../models/CarModel");
const Car = require("../models/CarModel");

// ================= CREATE CAR =================
const createCar = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files); // Multiple files

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

    let imageUrls = [];

    // Multiple Image URL Array
    const imageUrl = []
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        imageUrls.push(file.path); // cloudinary url or local path
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
    const cars = await carSchema.find().populate("sellerId","_id name email")
   // const cars = await Car.find().populate("sellerId", "_id name email");  //populate sellerId

    res.status(200).json({
      message: "Cars fetched",
      data: cars,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SINGLE CAR =================
const getCarById = async(req,res)=>{
  try{
    // 🔹 make sure sellerId populate ho
    const car = await carSchema.findById(req.params.id).populate("sellerId")
    // const car = await Car.findById(req.params.id) .populate("sellerId"); // important

   // if(!car) return res.status(404).json({ message: "Car not found" });

    res.status(200).json({
      message:"Car fetched",
      data:car
    })
  }catch(err){
    res.status(500).json({ message:err.message })
  }
}


// ================= UPDATE CAR =================
 const updateCar = async (req, res) => {
   try {
    let updateData = req.body;

     if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (let file of req.files) {
         imageUrls.push(file.path);
       }
       updateData.images = imageUrls; // replace images
     }

      const car = await carSchema.findByIdAndUpdate(req.params.id,updateData,
      { returnDocument: "after" }
    );
//     const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
//       returnDocument: "after",
//     });

    res.status(200).json({
      message: "Car updated",
       data: car,
});
} catch (err) {
     res.status(500).json({ message: err.message });
   }
 };

// const updateCar = async (req, res) => {
//   try {
//     let updateData = req.body;

//     // 🔥 IMPORTANT: old images fetch karo
//     const existingCar = await Car.findById(req.params.id);

//     let imageUrls = existingCar.images || [];

//     // 🔥 agar new images aaye to replace karo
//     if (req.files && req.files.length > 0) {
//       imageUrls = [];

//       for (let file of req.files) {
//         imageUrls.push(file.path);
//       }
//     }

//     updateData.images = imageUrls;

//     const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
//       new: true, // ✅ correct option
//     });

//     res.status(200).json({
//       message: "Car updated",
//       data: car,
//     });
//   } catch (err) {
//     console.log("UPDATE ERROR:", err); // 🔥 debug add karo
//     res.status(500).json({ message: err.message });
//   }
// };

// ================= DELETE CAR =================

//=======Delete Car ===========
const deleteCar = async (req, res) => {
  try {
    //await Car.findByIdAndDelete(req.params.id);
    await carSchema.findByIdAndDelete(req.params.id)

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