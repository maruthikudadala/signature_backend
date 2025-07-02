const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Document", DocumentSchema);
