const express = require('express');
const router = express.Router();
const generateSignedPdf  = require('./generateSignedPdf');
//const auth = require('../middleware/verifyToken');

router.get('/generate/:fileId',  generateSignedPdf.generateSignedPdf);

module.exports = router;
