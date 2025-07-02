// routes/email.routes.js
const express = require("express");
const router = express.Router();
const sendSignatureLink = require("./email.controller");

router.post("/send-signature-link", sendSignatureLink.sendSignatureLink);

module.exports = router;
