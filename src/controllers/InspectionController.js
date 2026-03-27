const inspectionSchema = require("../models/InspectionModel")

// CREATE INSPECTION
const createInspection = async(req,res)=>{
    try{
        const inspection = await inspectionSchema.create(req.body)

        res.status(201).json({
            message:"Inspection report added",
            data:inspection
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// GET ALL INSPECTIONS
const getAllInspections = async(req,res)=>{
    try{
        const inspections = await inspectionSchema
        .find()
        .populate("carId")

        res.status(200).json({
            message:"Inspections fetched",
            data:inspections
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// GET SINGLE 🔥
const getInspectionById = async(req,res)=>{
    try{
        const inspection = await inspectionSchema
        .findById(req.params.id)
        .populate("carId")

        res.status(200).json({
            message:"Inspection fetched",
            data:inspection
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// UPDATE INSPECTION
const updateInspection = async(req,res)=>{
    try{
        const inspection = await inspectionSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        )

        res.status(200).json({
            message:"Inspection updated",
            data:inspection
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// DELETE INSPECTION
const deleteInspection = async(req,res)=>{
    try{
        await inspectionSchema.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Inspection deleted"
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    createInspection,
    getAllInspections,
    getInspectionById,
    updateInspection,
    deleteInspection
}