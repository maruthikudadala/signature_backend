
const mongoose = require('mongoose');

const SignatureSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  signer: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'signed','Rejected'],
    default: 'pending'
  },
  reason: {
    type: String,
    default: ""
  },
  font: {
    type: String,
    default: "Helvetica"
  },
  fontSize: {
    type: Number,
    default: 16
  }

});

const Signature = mongoose.model('Signature', SignatureSchema);
module.exports = Signature
