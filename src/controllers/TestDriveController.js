const TestDrive = require("../models/TestDriveModel");
const { createNotification } = require("../utils/notificationHelper");

// ================= CREATE TEST DRIVE =================
const createTestDrive = async (req, res) => {
  try {
    const {
      buyerId,
      sellerId,
      carId,
      requestedDate,
      requestedTime,
      location,
      message
    } = req.body;

    if (!buyerId || !sellerId || !carId || !requestedDate || !requestedTime || !location) {
      return res.status(400).json({
        message: "All required fields are mandatory"
      });
    }

    const testDrive = await TestDrive.create({
      buyerId,
      sellerId,
      carId,
      requestedDate,
      requestedTime,
      location,
      message
    });

    // Notify seller when buyer books a test drive
    await createNotification({
      userId: sellerId,
      senderId: buyerId,
      carId,
      type: "test_drive_request",
      title: "New Test Drive Request",
      message: `A buyer has requested a test drive on ${requestedDate} at ${requestedTime}.`
    });

    res.status(201).json({
      message: "Test drive booked successfully",
      data: testDrive
    });
  } catch (err) {
    console.log("CREATE TEST DRIVE ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= GET ALL TEST DRIVES =================
const getAllTestDrives = async (req, res) => {
  try {
    const { buyerId, sellerId, status } = req.query;
    let filter = {};

    if (buyerId) {
      filter.buyerId = buyerId;
    }

    if (sellerId) {
      filter.sellerId = sellerId;
    }

    if (status) {
      filter.status = status;
    }

    const testDrives = await TestDrive.find(filter)
      .populate("buyerId", "firstName lastName email")
      .populate("sellerId", "firstName lastName email")
      .populate("carId", "brand model price images location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Test drives fetched successfully",
      data: testDrives
    });
  } catch (err) {
    console.log("GET TEST DRIVES ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= GET SINGLE TEST DRIVE =================
const getTestDriveById = async (req, res) => {
  try {
    const testDrive = await TestDrive.findById(req.params.id)
      .populate("buyerId", "firstName lastName email")
      .populate("sellerId", "firstName lastName email")
      .populate("carId", "brand model price images location");

    if (!testDrive) {
      return res.status(404).json({
        message: "Test drive not found"
      });
    }

    res.status(200).json({
      message: "Test drive fetched successfully",
      data: testDrive
    });
  } catch (err) {
    console.log("GET SINGLE TEST DRIVE ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= UPDATE TEST DRIVE =================
const updateTestDrive = async (req, res) => {
  try {
    const { status, requestedDate, requestedTime, location, message, actionBy } = req.body;

    const existingTestDrive = await TestDrive.findById(req.params.id)
      .populate("buyerId")
      .populate("sellerId")
      .populate("carId");

    if (!existingTestDrive) {
      return res.status(404).json({
        message: "Test drive not found"
      });
    }

    let updateData = {
      updatedAt: Date.now()
    };

    if (status) {
      if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }
      updateData.status = status;
    }

    if (requestedDate) {
      updateData.requestedDate = requestedDate;
    }

    if (requestedTime) {
      updateData.requestedTime = requestedTime;
    }

    if (location) {
      updateData.location = location;
    }

    if (message !== undefined) {
      updateData.message = message;
    }

    const testDrive = await TestDrive.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("buyerId", "firstName lastName email")
      .populate("sellerId", "firstName lastName email")
      .populate("carId", "brand model price images location");

    // Notify buyer when seller accepts request
    if (status === "accepted" && actionBy === "seller") {
      await createNotification({
        userId: existingTestDrive.buyerId._id,
        senderId: existingTestDrive.sellerId._id,
        carId: existingTestDrive.carId._id,
        type: "test_drive_accepted",
        title: "Test Drive Accepted",
        message: `Your test drive request for ${existingTestDrive.carId.brand} ${existingTestDrive.carId.model} has been accepted.`
      });
    }

    // Notify buyer when seller rejects request
    if (status === "rejected" && actionBy === "seller") {
      await createNotification({
        userId: existingTestDrive.buyerId._id,
        senderId: existingTestDrive.sellerId._id,
        carId: existingTestDrive.carId._id,
        type: "test_drive_rejected",
        title: "Test Drive Rejected",
        message: `Your test drive request for ${existingTestDrive.carId.brand} ${existingTestDrive.carId.model} has been rejected.`
      });
    }

    // Notify seller when buyer completes test drive
    if (status === "completed" && actionBy === "buyer") {
      await createNotification({
        userId: existingTestDrive.sellerId._id,
        senderId: existingTestDrive.buyerId._id,
        carId: existingTestDrive.carId._id,
        type: "test_drive_completed",
        title: "Test Drive Completed",
        message: `Buyer has marked the test drive for ${existingTestDrive.carId.brand} ${existingTestDrive.carId.model} as completed.`
      });
    }

    res.status(200).json({
      message: "Test drive updated successfully",
      data: testDrive
    });
  } catch (err) {
    console.log("UPDATE TEST DRIVE ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= DELETE TEST DRIVE =================
const deleteTestDrive = async (req, res) => {
  try {
    const testDrive = await TestDrive.findById(req.params.id);

    if (!testDrive) {
      return res.status(404).json({
        message: "Test drive not found"
      });
    }

    await TestDrive.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Test drive deleted successfully"
    });
  } catch (err) {
    console.log("DELETE TEST DRIVE ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  createTestDrive,
  getAllTestDrives,
  getTestDriveById,
  updateTestDrive,
  deleteTestDrive
};
