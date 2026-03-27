const mongoose = require("mongoose")
const Schema = mongoose.Schema

const testDriveSchema = new Schema({

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

    scheduleDate:{
         type:Date 
        },

    location:{
        type:String
    },
    
    status:{
        type:String,
        enum:["pending","approved","completed"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
}

})

module.exports = mongoose.model("testdrives",testDriveSchema)