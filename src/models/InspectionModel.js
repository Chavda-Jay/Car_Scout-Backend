const mongoose = require("mongoose")
const Schema = mongoose.Schema

const inspectionSchema = new Schema({

    carId:{
        type:mongoose.Types.ObjectId,
        ref:"cars"
    },

    report:{
        type:String
    },

    rating:{
        type:Number
    },

    accidentHistory:{
        type:String
    },

    serviceHistory:{
        type:String
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("inspections",inspectionSchema)