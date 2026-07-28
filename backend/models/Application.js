const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, default: "" },
  secondPreference: { type: String, default: "" },
  status: { type: String, default: "Applied" },
  dateApplied: { type: String, default: "" },
  interviewDate: { type: String, default: "" },
  jobLink: { type: String, default: "" },
  source: { type: String, default: "" },
  notes: { type: String, default: "" },
}, { timestamps: true })

module.exports = mongoose.model("Application", applicationSchema)