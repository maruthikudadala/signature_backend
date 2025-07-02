const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const Signature = require("../signature/models/Signature"); 
const Document = require('../multer/model/multer.model'); 

const downloadSignedPdf = async (req, res) => {
  const { fileId } = req.params;

  try {
    const doc = await Document.findById(fileId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const signatures = await Signature.find({ fileId });

    const pdfPath = path.join(__dirname, "..", doc.filePath);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "PDF file not found on server" });
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    for (const sig of signatures) {
      const page = pages[sig.page - 1];
      page.drawText(sig.signer, {
        x: sig.x,
        y: page.getHeight() - sig.y, // PDF-lib y-axis is from bottom
        size: 14,
        color: rgb(0, 0, 0),
      });
    }

    const signedPdfBytes = await pdfDoc.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="signed-${doc.originalName}"`,
    });

    res.send(Buffer.from(signedPdfBytes));
  } catch (err) {
    console.error("Download signed PDF failed:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {downloadSignedPdf}