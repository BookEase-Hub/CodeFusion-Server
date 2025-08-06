const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'editor'
    }
  }],
  syncStatus: {
    type: String,
    enum: ['local', 'cloud', 'synced'],
    default: 'local'
  },
  settings: {
    autoSave: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: Number,
      default: 14
    }
  }
}, { timestamps: true });

// Index for faster querying
workspaceSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Workspace', workspaceSchema);
