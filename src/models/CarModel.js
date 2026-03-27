const mongoose = require("mongoose")
const Schema = mongoose.Schema

const carSchema = new Schema({

    brand:{ 
        type:String 
    },

    model:{
         type:String 
        },

    year:{ 
        type:Number 
    },

    price:{
         type:Number 
        },

    mileage:{
         type:Number
         },

    fuelType:{
         type:String
         },

    description:{
         type:String 
        },

    location:{
        type:String
    },

    condition:{
        type:String,
        enum:["Excellent","Good","Fair"],
        default:"Excellent"
    },

    sellerId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    
    images:{                                //Ex: "images":["car1.jpg","car2.jpg"]
            type:String,
           // default:""
    },                                     
        //  Cloudinary use karega To :images:[
        //                                    {
        //                                      url:String,
        //                                      public_id:String
        //                                     }
        //                                    ]     
        
        
    status:{
        type:String,
        enum:["available","sold"],
        default:"available"
    },
     createdAt:{
        type:Date,
        default:Date.now
    }


})

module.exports = mongoose.model("cars",carSchema)