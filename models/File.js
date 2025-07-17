const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  content: { type: String, default: '' },
  language: { type: String, default: 'plaintext' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
