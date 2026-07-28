const express = require("express")
const router = express.Router()
const Application = require("../models/Application")

// GET all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST add new application
router.post("/", async (req, res) => {
  try {
    const application = new Application(req.body)
    const saved = await application.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update application
router.put("/:id", async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE application
router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id)
    res.json({ message: "Application deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router