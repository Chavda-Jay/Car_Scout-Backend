const mongoose = require("mongoose")
const Schema = mongoose.Schema

const offerSchema = new Schema({

    buyerId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    sellerId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },

    carId:{
        type:mongoose.Types.ObjectId,
        ref:"cars"
    },

    offerPrice:{
         type:Number 
        },
    
     counterOffer:{
        type:Number
    },

    message: {
         type: String
    },

    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("offers",offerSchema)