const router = require("express").Router()
const testDriveController = require("../controllers/TestDriveController")

router.post("/testdrive",testDriveController.createTestDrive)   //localhost:3800/testdrive/testdrive
router.get("/testdrive",testDriveController.getAllTestDrives)   //localhost:3800/testdrive/testdrive
router.get("/testdrive/:id",testDriveController.getTestDriveById) //localhost:3800/testdrive/testdrive/:id
router.put("/:id",testDriveController.updateTestDrive)          //localhost:3800/testdrive/:id
router.delete("/:id",testDriveController.deleteTestDrive)       //localhost:3800/testdrive/:id

module.exports = router