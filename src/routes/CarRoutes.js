// const router = require("express").Router()
// const carController = require("../controllers/CarController")

// router.post("/car",carController.createCar)  //localhost:3800/car/car
// router.get("/cars",carController.getAllCars)  //localhost:3800/car/cars
// router.get("/:id",carController.getCarById) ////localhost:3800/car/car/id
// router.put("/:id",carController.updateCar)  //localhost:3800/car/:id (car_id)
// router.delete("/car/:id",carController.deleteCar) //localhost:3800/car/car/:id (car_id)

// const upload = require("../middleware/Upload")
// router.post("/car",upload.single("image"),carController.createCar) //single image

// module.exports = router

const router = require("express").Router()
const carController = require("../controllers/CarController")
const upload = require("../middleware/Upload")

//  CREATE CAR
router.post("/car", upload.array("images",5), carController.createCar)
// GET ALL CARS
router.get("/cars", carController.getAllCars)
//  VERY IMPORTANT ORDER FIX
router.get("/user/:id", carController.getUserCars); 
router.get("/:id", carController.getCarById);       
// UPDATE
router.put("/:id", upload.array("images",5), carController.updateCar)
//  DELETE
router.delete("/:id", carController.deleteCar)

module.exports = router