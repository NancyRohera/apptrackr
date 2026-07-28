const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const dns = require("dns")
dns.setDefaultResultOrder("ipv4first")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ MongoDB connection error:", err.message))

// Routes
app.use("/api/applications", require("./routes/applications"))

app.get("/", (req, res) => {
  res.json({ message: "AppTrackr backend is running!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})