const router = require("express").Router()
const carController = require("../controllers/CarController")

router.post("/car",carController.createCar)  //localhost:3800/car/car
router.get("/cars",carController.getAllCars)  //localhost:3800/car/cars
router.get("/:id",carController.getCarById) ////localhost:3800/car/car/id
router.put("/:id",carController.updateCar)  //localhost:3800/car/car/:id (car_id)
router.delete("/car/:id",carController.deleteCar) //localhost:3800/car/car/:id (car_id)

module.exports = router