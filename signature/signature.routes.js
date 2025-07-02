const express = require('express');
const router = express.Router();
const auth = require("../middleware/verifyToken");
const SignatureController = require('./signature.controller');


router.post('/add', auth, SignatureController.addSignaturePlaceholder);
router.get('/get-by-file/:fileId',auth, SignatureController.getSignaturesByFile);
router.put("/update-position/:signatureId", SignatureController.updatePosition);
router.delete("/delete/:id",  SignatureController.deleteSignature);

module.exports = router;
