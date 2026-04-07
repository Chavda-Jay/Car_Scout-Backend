const router = require("express").Router();
const userController = require("../controllers/UserController");
const profileUpload = require("../middleware/ProfileUpload");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/forgotpassword", userController.forgotPassword);
router.put("/resetpassword/:token", userController.resetpassword);

// Profile picture update
router.put(
  "/profile-pic/:id",
  profileUpload.single("profilePic"),
  userController.updateProfilePic
);

router.put("/remove-profile-pic/:id", userController.removeProfilePic);

// Admin routes
router.get("/users", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
