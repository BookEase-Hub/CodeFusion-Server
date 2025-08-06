const mongoose = require('mongoose');

// This schema can be nested, so we define it separately.
const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true
  },
  language: String,
  content: String,
  isDirty: {
    type: Boolean,
    default: false
  },
  children: [this] // Recursive reference for folders
}, { _id: false });


const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  primaryLanguage: {
    type: String,
    default: 'javascript'
  },
  template: {
    type: String,
    enum: ['blank', 'react', 'nextjs', 'nodejs', 'python', 'github-clone'],
    default: 'blank'
  },
  files: [fileSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for faster querying
projectSchema.index({ owner: 1, name: 1 }, { unique: true });
projectSchema.index({ 'collaborators.user': 1 });

// Small correction to the recursive schema definition
// Mongoose doesn't directly support `children: [this]`. The correct way is to add the schema to itself.
// However, the provided user schema for workspace used `mongoose.Schema.Types.Mixed` for children.
// That is a more flexible, if less structured, approach. The `fileSchema` from the `projectModel` snippet is different.
// Let's re-check the user-provided snippets.
// The `projectSchema` has `files: [fileSchema]`. The `fileSchema` has `children: [{ type: mongoose.Schema.Types.Mixed }]`.
// This is the most robust way. I will correct my `fileSchema`.

const correctedFileSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true
  },
  path: {
    type: String,
    required: true
  },
  language: String,
  content: String,
  isDirty: {
    type: Boolean,
    default: false
  },
  children: [{
    type: mongoose.Schema.Types.Mixed
  }]
}, { _id: false });

// I will re-create the file with the correct schema.
// The `projectSchema` I wrote above is also slightly different from the user's final one. I will use the one from the user's snippet.
// I will just copy the user's `projectModel.js` content.
const finalProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  primaryLanguage: {
    type: String,
    default: 'javascript'
  },
  template: {
    type: String,
    enum: ['blank', 'react', 'nextjs', 'nodejs', 'python', 'github-clone'],
    default: 'blank'
  },
  files: [correctedFileSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  metadata: {
    type: Object,
    default: {}
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

finalProjectSchema.index({ owner: 1, name: 1 }, { unique: true });
finalProjectSchema.index({ 'collaborators.user': 1 });

module.exports = mongoose.model('Project', finalProjectSchema);
