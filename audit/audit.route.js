const express = require("express");
const router = express.Router();
const getAuditLogsByFile  = require("./audit.controller");
const auth = require("../middleware/verifyToken"); // Optional: use if you want to protect this route

// Get audit logs by fileId
router.get("/:fileId", auth, getAuditLogsByFile.getAuditLogsByFile);

module.exports = router;
