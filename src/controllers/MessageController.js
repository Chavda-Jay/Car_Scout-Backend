const messageSchema = require("../models/MessageModel")

// CREATE MESSAGE
const createMessage = async (req, res) => {
    try{
        const message = await messageSchema.create(req.body)

        res.status(201).json({
            message: "Message sent",
            data: message
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// GET ALL MESSAGES
const getAllMessages = async (req, res) => {
    try{
        const messages = await messageSchema
            .find()
            .populate("senderId")
            .populate("receiverId")
            .populate("carId")

        res.status(200).json({
            message: "Messages fetched",
            data: messages
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// GET SINGLE MESSAGE (🔥 ADD)
const getMessageById = async (req,res)=>{
    try{
        const message = await messageSchema
            .findById(req.params.id)
            .populate("senderId receiverId carId")

        res.status(200).json({
            message:"Message fetched",
            data:message
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// UPDATE MESSAGE
const updateMessage = async (req, res) => {
    try{
        const message = await messageSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        )

        res.status(200).json({
            message: "Message updated",
            data: message
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// DELETE MESSAGE
const deleteMessage = async (req, res) => {
    try{
        await messageSchema.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: "Message deleted"
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// MARK AS READ (IMPORTANT FEATURE)
const markAsRead = async (req,res)=>{
    try{
        const message = await messageSchema.findByIdAndUpdate(
            req.params.id,
            { isRead:true },
            { new:true }
        )

        res.status(200).json({
            message:"Message marked as read",
            data:message
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    markAsRead
}


















//========================================

// const messageSchema = require("../models/MessageModel")

// // CREATE MESSAGE
// const createMessage = async (req, res) => {
//     const message = await messageSchema.create(req.body)

//     res.json({
//         message: "message sent",
//         data: message
//     })
// }

// // GET ALL MESSAGES
// const getAllMessages = async (req, res) => {
//     const messages = await messageSchema
//         .find()
//         .populate("senderId")
//         .populate("receiverId")
//         .populate("carId")

//     res.json({
//         message: "messages fetched",
//         data: messages
//     })
// }

// // UPDATE MESSAGE
// const updateMessage = async (req, res) => {
//     const message = await messageSchema.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//     )

//     res.json({
//         message: "message updated",
//         data: message
//     })
// }

// // DELETE MESSAGE
// const deleteMessage = async (req, res) => {
//     await messageSchema.findByIdAndDelete(req.params.id)

//     res.json({
//         message: "message deleted"
//     })
// }

// module.exports = {
//     createMessage,
//     getAllMessages,
//     updateMessage,
//     deleteMessage
// }