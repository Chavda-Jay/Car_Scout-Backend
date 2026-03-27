const carSchema = require("../models/CarModel")

// CREATE


// const createCar = async (req, res) => {     //Agar JWT/Auth middleware hai to aa code rkhvo
//   try {
//     // 🔥 logged-in user
//     const user = req.user;   // (best way - token se)

//     const car = await Car.create({
//       ...req.body,
//       sellerId: user._id     // ✅ sellerId auto save
//     });

//     res.status(201).json({
//       message: "Car created successfully 🚗",
//       data: car
//     });

//   } catch (err) {
//     console.log("CREATE CAR ERROR:", err);
//     res.status(500).json({
//       message: err.message
//     });
//   }
// }

const Car = require("../models/CarModel");

const createCar = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔍 debug

    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      description,
      location,
      sellerId
    } = req.body;

    // ✅ validation
    if (!sellerId) {
      return res.status(400).json({
        message: "SellerId is required ❌"
      });
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
      sellerId
    });

    res.status(201).json({
      message: "Car created successfully 🚗",
      data: car
    });

  } catch (err) {
    console.log("CREATE CAR ERROR:", err); // 🔥 REAL ERROR
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = { createCar };

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

// GET SINGLE (🔥 IMPORTANT ADD)
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
const updateCar = async(req,res)=>{
    try{
        const car = await carSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            {returnDocument: "after"}
        )

        res.status(200).json({
            message:"Car updated",
            data:car
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

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

module.exports={
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
}







//=============================
// const carSchema = require("../models/CarModel")

// const createCar = async(req,res)=>{
//     const car = await carSchema.create(req.body)

//     res.json({
//         message:"car added",
//         data:car
//     })
// }

// const getAllCars = async(req,res)=>{
//     const cars = await carSchema
//     .find()
//     .populate("sellerId")

//     res.json({
//         message:"cars fetched",
//         data:cars
//     })
// }

// const updateCar = async(req,res)=>{
//     const car = await carSchema.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         {new:true}
//     )

//     res.json({
//         message:"car updated",
//         data:car
//     })
// }

// const deleteCar = async(req,res)=>{
//     await carSchema.findByIdAndDelete(req.params.id)

//     res.json({
//         message:"car deleted"
//     })
// }

// module.exports={
// createCar,
// getAllCars,
// updateCar,
// deleteCar
// }