const router = require("express").Router()
const inspectionController = require("../controllers/InspectionController")

router.post("/inspection",inspectionController.createInspection)        //localhost:3800/inspection/inspection
router.get("/inspections",inspectionController.getAllInspections)       //localhost:3800/inspection/inspection
router.get("/inspection/:id",inspectionController.getInspectionById)    //localhost:3800/inspection/inspection/:id
router.put("/inspection/:id",inspectionController.updateInspection)     //localhost:3800/inspection/inspection/:id
router.delete("/inspection/:id",inspectionController.deleteInspection)  ////localhost:3800/inspection/inspection/:id

module.exports = router