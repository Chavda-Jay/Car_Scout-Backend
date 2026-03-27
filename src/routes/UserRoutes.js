const router = require("express").Router()
const userController = require("../controllers/UserController")
router.post("/register",userController.registerUser)  //localhost:3800/user/register
router.post("/login",userController.loginUser)   

router.post("/forgotpassword",userController.forgotPassword)
router.put("/resetpassword/:token",userController.resetpassword)

// 🔹 NEW ADMIN ROUTES
router.get("/users", userController.getAllUsers);          // fetch all users
router.get("/:id", userController.getUserById);           // get single user
router.put("/:id", userController.updateUser);            // update user
router.delete("/:id", userController.deleteUser);         // delete user

module.exports=router   