const Project = require('../models/Project');
const User = require('../models/User');
// const cloudStorage = require('../config/cloudStorage'); // This would need to be implemented
const AppError = require('../utils/errorHandler');

// A mock cloud storage service for now
const cloudStorage = {
    upload: async (path, data) => {
        console.log(`Mock upload to ${path} with data: ${data.substring(0, 50)}...`);
        return { success: true, path };
    }
};

exports.exportProject = async (project) => {
  try {
    const exportData = {
      version: '1.0',
      project: {
        name: project.name,
        description: project.description,
        primaryLanguage: project.primaryLanguage,
        template: project.template,
        files: project.files,
        metadata: project.metadata,
        createdAt: project.createdAt
      }
    };

    return exportData;
  } catch (err) {
    throw new AppError('Export failed', 500);
  }
};

exports.importProject = async (exportData, userId) => {
  try {
    if (!exportData.project || !exportData.project.name) {
      throw new AppError('Invalid project export format', 400);
    }

    const project = await Project.create({
      name: exportData.project.name,
      description: exportData.project.description,
      primaryLanguage: exportData.project.primaryLanguage,
      template: exportData.project.template,
      files: exportData.project.files || [],
      metadata: exportData.project.metadata || {},
      owner: userId
    });

    await User.findByIdAndUpdate(userId, {
      $push: { projects: project._id }
    });

    return project;
  } catch (err) {
    throw err;
  }
};

exports.syncProjectToCloud = async (projectId, userId) => {
  try {
    const project = await Project.findOne({
      _id: projectId,
      owner: userId
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const exportData = await this.exportProject(project);
    await cloudStorage.upload(`projects/${projectId}.codefusion`, JSON.stringify(exportData));

    project.syncStatus = 'synced';
    await project.save();

    return project;
  } catch (err) {
    throw err;
  }
};
