const express = require('express');
const router = express.Router();
const auth = require("../middleware/verifyToken");
const downloadSignedPdf = require('./pdfDown.controller');

// Add the route to download the signed PDF
router.get("/download-signed/:fileId", auth, downloadSignedPdf.downloadSignedPdf);

module.exports = router;
