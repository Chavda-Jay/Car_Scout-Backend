const testDriveSchema = require("../models/TestDriveModel")

// CREATE
const createTestDrive = async(req,res)=>{
    try{
        const testDrive = await testDriveSchema.create(req.body)

        res.status(201).json({
            message:"Test drive scheduled",
            data:testDrive
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// GET ALL
const getAllTestDrives = async(req,res)=>{
    try{
        const testDrives = await testDriveSchema
        .find()
        .populate("buyerId")
        .populate("sellerId")
        .populate("carId")

        res.status(200).json({
            message:"Test drives fetched",
            data:testDrives
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// GET SINGLE 🔥
const getTestDriveById = async(req,res)=>{
    try{
        const testDrive = await testDriveSchema
        .findById(req.params.id)
        .populate("buyerId sellerId carId")

        res.status(200).json({
            message:"Test drive fetched",
            data:testDrive
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// UPDATE
const updateTestDrive = async(req,res)=>{
    try{
        const testDrive = await testDriveSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        )

        res.status(200).json({
            message:"Test drive updated",
            data:testDrive
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// DELETE
const deleteTestDrive = async(req,res)=>{
    try{
        await testDriveSchema.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Test drive deleted"
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    createTestDrive,
    getAllTestDrives,
    getTestDriveById,
    updateTestDrive,
    deleteTestDrive
}

























//=================================================================
// const testDriveSchema = require("../models/TestDriveModel")

// // CREATE TEST DRIVE
// const createTestDrive = async(req,res)=>{
//     const testDrive = await testDriveSchema.create(req.body)

//     res.json({
//         message:"test drive scheduled",
//         data:testDrive
//     })
// }

// // GET ALL TEST DRIVES
// const getAllTestDrives = async(req,res)=>{
//     const testDrives = await testDriveSchema
//     .find()
//     .populate("buyerId")
//     .populate("carId")

//     res.json({
//         message:"test drives fetched",
//         data:testDrives
//     })
// }

// // UPDATE TEST DRIVE
// const updateTestDrive = async(req,res)=>{
//     const testDrive = await testDriveSchema.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         {new:true}
//     )

//     res.json({
//         message:"test drive updated",
//         data:testDrive
//     })
// }

// // DELETE TEST DRIVE
// const deleteTestDrive = async(req,res)=>{
//     await testDriveSchema.findByIdAndDelete(req.params.id)

//     res.json({
//         message:"test drive deleted"
//     })
// }

// module.exports = {
// createTestDrive,
// getAllTestDrives,
// updateTestDrive,
// deleteTestDrive
// }