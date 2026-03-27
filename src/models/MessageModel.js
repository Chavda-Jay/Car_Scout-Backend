const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({

    senderId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    receiverId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    carId:{
        type:mongoose.Types.ObjectId,
        ref:"cars"
    },

    message:{ 
        type:String 
    },
   
    isRead:{
        type:Boolean,        //true- msg read & false-msg unread
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("messages",messageSchema)