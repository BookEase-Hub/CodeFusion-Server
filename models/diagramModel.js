const mongoose = require('mongoose');

const diagramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  mermaidCode: {
    type: String,
    required: true
  },
  svg: {
    type: String
  },
  lastGenerated: {
    type: Date,
    default: Date.now
  },
  settings: {
    theme: {
      type: String,
      default: 'dark'
    },
    zoom: {
      type: Number,
      default: 1
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Diagram', diagramSchema);
