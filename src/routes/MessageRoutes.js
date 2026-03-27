const router = require("express").Router()
const messageController = require("../controllers/MessageController")

router.post("/message", messageController.createMessage)  //localhost:3800/message/message
router.get("/message", messageController.getAllMessages)  //localhost:3800/message/message
router.get("/message/:id",messageController.getMessageById) //localhost:3800/message/message/:id
router.put("/message/:id", messageController.updateMessage)       //localhost:3800/message/:id
router.delete("/message/:id", messageController.deleteMessage)    //localhost:3800/message/:id

router.put("/message/read/:id",messageController.markAsRead)

module.exports = router