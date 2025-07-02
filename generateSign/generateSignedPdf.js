const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const Signature = require('../signature/models/Signature');
const Document = require('../multer/model/multer.model'); // from multer

generateSignedPdf = async (req, res) => {
  const { fileId } = req.params;

  try {
    // 1. Fetch file metadata
    const file = await Document.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '..', 'uploads', path.basename(file.filePath));
    const existingPdfBytes = fs.readFileSync(filePath);

    // 2. Load PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    // 3. Get all signatures for this file
    const signatures = await Signature.find({ fileId });

    signatures.forEach(sig => {
      const page = pages[sig.page - 1];
      page.drawText(sig.signer, {
        x: sig.x,
        y: page.getHeight() - sig.y,
        size: 12,
        color: rgb(1, 0.8, 0), // yellow
      });
    });

    // ✅ 4. Ensure 'signed' folder exists
    const signedFolder = path.join(__dirname, '..', 'signed');
    if (!fs.existsSync(signedFolder)) {
      fs.mkdirSync(signedFolder);
    }

    // 5. Save signed PDF
    const signedPath = path.join(signedFolder, `signed-${file.originalName}`);
    fs.writeFileSync(signedPath, await pdfDoc.save());

    return res.status(200).json({
      message: 'Signed PDF generated successfully',
      signedFileUrl: `/signed/signed-${file.originalName}` // static route
    });

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'Error generating signed PDF', error: err.message });
  }
};

module.exports = { generateSignedPdf };
