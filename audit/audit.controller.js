const Audit = require("./model/audit.model");

const getAuditLogsByFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const logs = await Audit.find({ fileId }).sort({ signedAt: -1 });
    res.status(200).json({ auditLogs: logs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs", error: err.message });
  }
};

module.exports = { getAuditLogsByFile };
