const router = require("express").Router();
const inspectionController = require("../controllers/InspectionController");

router.post("/", inspectionController.createInspection);
router.get("/inspections", inspectionController.getAllInspections);
router.get("/car/:carId", inspectionController.getInspectionByCarId);
router.get("/:id", inspectionController.getInspectionById);
router.put("/:id", inspectionController.updateInspection);
router.delete("/:id", inspectionController.deleteInspection);

module.exports = router;
