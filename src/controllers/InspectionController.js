const Inspection = require("../models/InspectionModel");

// ================= CREATE INSPECTION =================
const createInspection = async (req, res) => {
  try {
    const { carId, report, rating, accidentHistory, serviceHistory } = req.body;

    if (!carId || !report || !rating) {
      return res.status(400).json({
        message: "carId, report and rating are required"
      });
    }

    const existingInspection = await Inspection.findOne({ carId });

    if (existingInspection) {
      return res.status(400).json({
        message: "Inspection report already exists for this car"
      });
    }

    const inspection = await Inspection.create({
      carId,
      report,
      rating,
      accidentHistory,
      serviceHistory
    });

    res.status(201).json({
      message: "Inspection report added successfully",
      data: inspection
    });
  } catch (err) {
    console.log("CREATE INSPECTION ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= GET ALL INSPECTIONS =================
const getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find()
      .populate("carId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Inspections fetched successfully",
      data: inspections
    });
  } catch (err) {
    console.log("GET INSPECTIONS ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= GET INSPECTION BY ID =================
const getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id).populate("carId");

    if (!inspection) {
      return res.status(404).json({
        message: "Inspection not found"
      });
    }

    res.status(200).json({
      message: "Inspection fetched successfully",
      data: inspection
    });
  } catch (err) {
    console.log("GET INSPECTION BY ID ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= GET INSPECTION BY CAR ID =================
const getInspectionByCarId = async (req, res) => {
  try {
    const inspection = await Inspection.findOne({
      carId: req.params.carId
    }).populate("carId");

    if (!inspection) {
      return res.status(404).json({
        message: "Inspection report not found for this car"
      });
    }

    res.status(200).json({
      message: "Inspection fetched successfully",
      data: inspection
    });
  } catch (err) {
    console.log("GET INSPECTION BY CAR ID ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= UPDATE INSPECTION =================
const updateInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("carId");

    if (!inspection) {
      return res.status(404).json({
        message: "Inspection not found"
      });
    }

    res.status(200).json({
      message: "Inspection updated successfully",
      data: inspection
    });
  } catch (err) {
    console.log("UPDATE INSPECTION ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= DELETE INSPECTION =================
const deleteInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);

    if (!inspection) {
      return res.status(404).json({
        message: "Inspection not found"
      });
    }

    res.status(200).json({
      message: "Inspection deleted successfully"
    });
  } catch (err) {
    console.log("DELETE INSPECTION ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  createInspection,
  getAllInspections,
  getInspectionById,
  getInspectionByCarId,
  updateInspection,
  deleteInspection
};
