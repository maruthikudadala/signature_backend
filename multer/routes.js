const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifyToken");
const DocumentController = require("./controllers");

// Upload PDF (protected)
router.post("/upload", auth, DocumentController.addDocument);

// Get all PDFs uploaded by user (protected)
router.get("/get-allfiles", auth, DocumentController.getAllDocuments);

module.exports = router;
