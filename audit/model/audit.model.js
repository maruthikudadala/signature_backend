const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  signer: { type: String, required: true },
  ip: { type: String },
  signedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audit', AuditSchema);
