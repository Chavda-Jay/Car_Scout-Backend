const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config() //load env file... using process

app.use(express.json())
app.use(cors()) //allow all requests

const DBConnection = require("./src/utils/DBConnection")
DBConnection()

const userRoutes = require("./src/routes/UserRoutes")
app.use("/user",userRoutes)

const carRoutes = require("./src/routes/CarRoutes")
app.use("/car",carRoutes)

const offerRoutes = require("./src/routes/OfferRoutes")
app.use("/offer",offerRoutes)

const notificationRoutes = require("./src/routes/NotificationRoutes");
app.use("/notification", notificationRoutes);

const messageRoutes = require("./src/routes/MessageRoutes")
app.use("/message",messageRoutes)

const testDriveRoutes = require("./src/routes/TestDriveRoutes")
app.use("/testdrive",testDriveRoutes)

const inspectionRoutes = require("./src/routes/InspectionRoutes")
app.use("/inspection",inspectionRoutes)

const adminRoutes = require("./src/routes/AdminRoutes");
app.use("/admin", adminRoutes);

const authRoutes = require("./src/routes/AuthRoutes")
app.use("/auth",authRoutes)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})

