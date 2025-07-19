const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const File = require('../models/File');
const Project = require('../models/Project');

// File CRUD operations
exports.createFile = async (req, res) => {
  try {
    const { name, projectId, content, language } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const filePath = path.join(project.name, name);
    const file = new File({
      name,
      path: filePath,
      content: content || '',
      language,
      projectId,
      userId: req.user.id
    });
    await file.save();
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).send('File creation failed');
  }
};

exports.getFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const files = await File.find({ projectId, userId: req.user.id });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching files');
  }
};

exports.updateFile = async (req, res) => {
  try {
    const { content } = req.body;
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content, updatedAt: Date.now() },
      { new: true }
    );
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).send('File update failed');
  }
};

// Terminal execution
exports.executeCommand = async (req, res) => {
  try {
    const { command, projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Whitelist of allowed commands
    const allowedCommands = ['ls', 'npm install', 'npm test'];
    if (!allowedCommands.includes(command)) {
      return res.status(400).json({ error: 'Command not allowed' });
    }

    const projectPath = path.join(__dirname, '..', '..', 'projects', project.name);

    // Basic validation to prevent path traversal
    if (!projectPath.startsWith(path.join(__dirname, '..', '..', 'projects'))) {
        return res.status(400).json({ error: 'Invalid project path' });
    }

    exec(command, { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        return res.status(400).json({ error: stderr });
      }
      res.json({ output: stdout });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Command execution failed');
  }
};
