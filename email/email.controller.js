// controllers/email.controller.js
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

dotenv.config()

JWT_SECRET = process.env.JWT_SECRET;
EMAIL_USER = process.env.EMAIL_USER;
EMAIL_PASS = process.env.EMAIL_PASS;

const sendSignatureLink = async (req, res) => {
  const { fileId, signerEmail } = req.body;

  if (!fileId || !signerEmail) {
    return res.status(400).json({ message: "fileId and signerEmail required" });
  }

  try {
    // Create token with fileId + signerEmail
    const token = jwt.sign({ fileId, signerEmail }, JWT_SECRET, { expiresIn: "2d" });

    // Link for public signature (frontend should handle this route)
    const link = `http://localhost:3000/public-sign/${token}`;

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: signerEmail,
      subject: "Signature Request",
      html: `
        <p>You have been requested to sign a document.</p>
        <p><a href="${link}">Click here to sign the document</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Signature link sent successfully", link });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Error sending signature email", error: err.message });
  }
};

module.exports = {sendSignatureLink}
