const Signature = require('./models/Signature');
const Audit = require('../audit/model/audit.model')

const addSignaturePlaceholder = async (req, res) => {
  const { fileId, signer, x, y, page ,font = 'Helvetica', fontSize = 16 } = req.body;

  if (!fileId || !signer || x == null || y == null || page == null) {
    return res.status(400).json({ message: "All fields required" });
  }

  console.log("Sending signature placeholder:", { fileId, signer, x, y, page });

  try {
    // Save the signature
    const signature = await Signature.create({ fileId, signer, x, y, page,font, fontSize });

    // ✅ Save to audit log
    await Audit.create({
      fileId,
      signer,
      ip: req.ip || req.headers["x-forwarded-for"] || "unknown"
    });

    res.status(201).json({ message: "Signature placeholder added", signature });
  } catch (error) {
    console.error('errrrr', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSignaturesByFile = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const signatures = await Signature.find({ fileId });
    res.status(200).json({ signatures });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch signatures", error: error.message });
  }
};

//pdf lo status update cheyataniki
const updatePosition = async (req, res) => {
  const { signatureId } = req.params;  
  const { x, y } = req.body;

  if (typeof x !== "number" || typeof y !== "number") {
    return res.status(400).json({ message: "x and y must be numbers" });
  }

  try {
    const updatedSignature = await Signature.findByIdAndUpdate(
      signatureId,
      { x, y },
      { new: true }
    );

    if (!updatedSignature) {
      console.error('errr',updatedSignature)
      return res.status(404).json({ message: "Signature not found" });
    }

    res.json({
      message: "Signature position updated",
      signature: updatedSignature,
    });
  } catch (err) {
    console.error("Error updating signature:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const deleteSignature = async (req, res) => {
  try {
    const id = req.params.id;
    await Signature.findByIdAndDelete(id);
    res.json({ message: "Signature deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete signature" });
  }
};


module.exports = {  addSignaturePlaceholder,  getSignaturesByFile,updatePosition,deleteSignature};
