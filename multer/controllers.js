const fs = require("fs");
const multer = require("multer");
const Document = require("./model/multer.model");

// Ensure 'uploads' folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"), // ✅ uploads folder
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter }).single("pdf");

const DocumentController = {
  addDocument: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error", error: err.message });
      }

      try {
        const file = req.file;

        if (!file) {
          return res.status(400).json({ message: "No file uploaded or invalid file type" });
        }

        const document = await Document.create({
          user: req.user.id,
          originalName: file.originalname,
          filePath: file.path,
        });

        res.status(201).json({ message: "PDF uploaded successfully", document });
      } catch (error) {
        console.log('errrrr',error)
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  },

  getAllDocuments: async (req, res) => {
    try {
      const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json({ files: documents });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents", error: error.message });
    }
  }
  
};

module.exports = DocumentController;
